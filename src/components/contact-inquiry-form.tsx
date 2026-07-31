"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";

import {
  type ContactApiResponse,
  type ContactField,
  type ContactFieldErrors,
  contactCategories,
  contactLimits,
} from "@/lib/contact";

type ContactInquiryFormProps = {
  recipientEmail: string;
};

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

type TurnstileApi = {
  ready: (callback: () => void) => void;
  remove: (widgetId: string) => void;
  render: (
    container: HTMLElement,
    options: {
      action: string;
      appearance: "interaction-only";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      sitekey: string;
      size: "flexible";
      theme: "dark";
    },
  ) => string;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const submitButtonLabels: Record<SubmissionStatus, string> = {
  idle: "Send message",
  submitting: "Sending message…",
  success: "Message sent",
  error: "Try sending again",
};

const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

const contactFieldOrder: readonly ContactField[] = [
  "name",
  "email",
  "category",
  "message",
];

export function ContactInquiryForm({
  recipientEmail,
}: ContactInquiryFormProps) {
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [isTurnstileReady, setIsTurnstileReady] = useState(false);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const turnstile = window.turnstile;
    const container = turnstileContainerRef.current;

    if (
      !turnstileSiteKey ||
      !isTurnstileReady ||
      !turnstile ||
      !container ||
      turnstileWidgetIdRef.current
    ) {
      return;
    }

    let isActive = true;

    turnstile.ready(() => {
      if (!isActive || turnstileWidgetIdRef.current) {
        return;
      }

      turnstileWidgetIdRef.current = turnstile.render(container, {
        action: "portfolio_contact",
        appearance: "interaction-only",
        callback: setTurnstileToken,
        "error-callback": () => setTurnstileToken(""),
        "expired-callback": () => setTurnstileToken(""),
        sitekey: turnstileSiteKey,
        size: "flexible",
        theme: "dark",
      });
    });

    return () => {
      isActive = false;

      if (turnstileWidgetIdRef.current) {
        turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [isTurnstileReady]);

  const clearFieldError = (field: ContactField) => {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });

    if (submissionStatus === "success") {
      setSubmissionStatus("idle");
      setStatusMessage("");
    }
  };

  const focusFirstInvalidField = (
    form: HTMLFormElement,
    errors: ContactFieldErrors,
  ) => {
    const firstInvalidField = contactFieldOrder.find((field) => errors[field]);

    if (!firstInvalidField) {
      return;
    }

    window.requestAnimationFrame(() => {
      const control = form.elements.namedItem(firstInvalidField);

      if (control instanceof HTMLElement) {
        control.focus();
      }
    });
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    setFieldErrors({});

    const formData = new FormData(form);

    if (turnstileSiteKey && !turnstileToken) {
      setSubmissionStatus("error");
      setStatusMessage("Complete the security check and try again.");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);

    setSubmissionStatus("submitting");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          ...Object.fromEntries(formData),
          turnstileToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });
      const result = (await response
        .json()
        .catch(() => null)) as ContactApiResponse | null;

      if (!response.ok || !result?.ok) {
        const nextFieldErrors =
          result && !result.ok ? result.errors ?? {} : {};

        setFieldErrors(nextFieldErrors);
        setSubmissionStatus("error");
        setStatusMessage(
          result?.message ||
            "The message could not be delivered right now. Please use the email link below.",
        );
        focusFirstInvalidField(form, nextFieldErrors);
        return;
      }

      form.reset();
      setFieldErrors({});
      setSubmissionStatus("success");
      setStatusMessage(result.message);
    } catch (error) {
      setSubmissionStatus("error");
      setStatusMessage(
        error instanceof Error && error.name !== "AbortError"
          ? error.message
          : "The request timed out. Please try again or use the email link below.",
      );
    } finally {
      window.clearTimeout(timeout);

      if (turnstileWidgetIdRef.current) {
        window.turnstile?.reset(turnstileWidgetIdRef.current);
        setTurnstileToken("");
      }
    }
  };

  return (
    <form
      aria-busy={submissionStatus === "submitting"}
      aria-describedby={
        submissionStatus === "error" ? "contact-form-status" : undefined
      }
      className="contact-form"
      onSubmit={sendMessage}
    >
      <div className="contact-form-row">
        <div className="contact-field">
          <label htmlFor="contact-name">Your name</label>
          <input
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
            aria-errormessage={fieldErrors.name ? "contact-name-error" : undefined}
            aria-invalid={Boolean(fieldErrors.name)}
            autoComplete="name"
            id="contact-name"
            maxLength={contactLimits.name.max}
            minLength={contactLimits.name.min}
            name="name"
            onChange={() => clearFieldError("name")}
            placeholder="Your name"
            required
            type="text"
          />
          {fieldErrors.name ? (
            <p className="contact-field-error" id="contact-name-error">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="contact-field">
          <label htmlFor="contact-email">Your email</label>
          <input
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
            aria-errormessage={fieldErrors.email ? "contact-email-error" : undefined}
            aria-invalid={Boolean(fieldErrors.email)}
            autoComplete="email"
            id="contact-email"
            maxLength={contactLimits.email.max}
            name="email"
            onChange={() => clearFieldError("email")}
            placeholder="you@example.com"
            required
            spellCheck={false}
            type="email"
          />
          {fieldErrors.email ? (
            <p className="contact-field-error" id="contact-email-error">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor="contact-category">Project category</label>
        <select
          aria-describedby={fieldErrors.category ? "contact-category-error" : undefined}
          aria-errormessage={fieldErrors.category ? "contact-category-error" : undefined}
          aria-invalid={Boolean(fieldErrors.category)}
          defaultValue=""
          id="contact-category"
          name="category"
          onChange={() => clearFieldError("category")}
          required
        >
          <option disabled value="">
            Select a category
          </option>
          {contactCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {fieldErrors.category ? (
          <p className="contact-field-error" id="contact-category-error">
            {fieldErrors.category}
          </p>
        ) : null}
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message">Project details</label>
        <textarea
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
          aria-errormessage={fieldErrors.message ? "contact-message-error" : undefined}
          aria-invalid={Boolean(fieldErrors.message)}
          id="contact-message"
          maxLength={contactLimits.message.max}
          minLength={contactLimits.message.min}
          name="message"
          onChange={() => clearFieldError("message")}
          placeholder="A quick outline of the idea, goals, or problem to solve…"
          required
          rows={4}
        />
        {fieldErrors.message ? (
          <p className="contact-field-error" id="contact-message-error">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <label aria-hidden="true" className="contact-honeypot">
        <span>Website</span>
        <input
          autoComplete="off"
          name="website"
          tabIndex={-1}
          type="text"
        />
      </label>

      {turnstileSiteKey ? (
        <>
          <Script
            onReady={() => setIsTurnstileReady(true)}
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
          />
          <div
            aria-label="Security verification"
            className="contact-turnstile"
            ref={turnstileContainerRef}
            role="group"
          />
        </>
      ) : null}

      <button
        className="contact-primary-action"
        disabled={submissionStatus === "submitting"}
        type="submit"
      >
        {submitButtonLabels[submissionStatus]}
        <span aria-hidden="true" className="contact-action-icon">
          {submissionStatus === "success" ? "✓" : "↗"}
        </span>
      </button>

      {submissionStatus === "error" ? (
        <p
          aria-live="assertive"
          className="contact-form-status is-error"
          id="contact-form-status"
          role="alert"
        >
          {statusMessage}{" "}
          <a href={`mailto:${recipientEmail}`}>Email me directly.</a>
        </p>
      ) : null}
      {submissionStatus === "success" ? (
        <p
          aria-live="polite"
          className="contact-form-status is-success"
          id="contact-form-success"
          role="status"
        >
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
