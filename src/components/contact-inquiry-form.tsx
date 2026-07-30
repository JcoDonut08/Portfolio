"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";

import {
  type ContactApiResponse,
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

export function ContactInquiryForm({
  recipientEmail,
}: ContactInquiryFormProps) {
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
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

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

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
        throw new Error(
          result?.message ||
            "The message could not be delivered right now. Please use the email link below.",
        );
      }

      form.reset();
      setSubmissionStatus("success");
      setStatusMessage("");
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
        <label className="contact-field">
          <span>Your name</span>
          <input
            autoComplete="name"
            maxLength={contactLimits.name.max}
            minLength={contactLimits.name.min}
            name="name"
            placeholder="Your name"
            required
            type="text"
          />
        </label>

        <label className="contact-field">
          <span>Your email</span>
          <input
            autoComplete="email"
            maxLength={contactLimits.email.max}
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </label>
      </div>

      <label className="contact-field">
        <span>Project category</span>
        <select defaultValue="" name="category" required>
          <option disabled value="">
            Select a category
          </option>
          {contactCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="contact-field">
        <span>Project details</span>
        <textarea
          maxLength={contactLimits.message.max}
          minLength={contactLimits.message.min}
          name="message"
          placeholder="A quick outline of the idea, goals, or problem to solve…"
          required
          rows={4}
        />
      </label>

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
    </form>
  );
}
