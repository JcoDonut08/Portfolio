"use client";

import { useState, type FormEvent } from "react";

import {
  type ContactApiResponse,
  contactCategories,
  contactLimits,
} from "@/lib/contact";

type ContactInquiryFormProps = {
  recipientEmail: string;
};

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const submitButtonLabels: Record<SubmissionStatus, string> = {
  idle: "Send message",
  submitting: "Sending message…",
  success: "Message sent",
  error: "Try sending again",
};

export function ContactInquiryForm({
  recipientEmail,
}: ContactInquiryFormProps) {
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);

    setSubmissionStatus("submitting");
    setStatusMessage("Sending your message securely…");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify(Object.fromEntries(formData)),
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
    }
  };

  return (
    <form
      aria-busy={submissionStatus === "submitting"}
      aria-describedby="contact-form-status"
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

      <p
        aria-live="polite"
        className={`contact-form-status is-${submissionStatus}`}
        id="contact-form-status"
        role={submissionStatus === "error" ? "alert" : "status"}
      >
        {statusMessage}
        {submissionStatus === "error" ? (
          <>
            {" "}
            <a href={`mailto:${recipientEmail}`}>Email me directly.</a>
          </>
        ) : null}
      </p>
    </form>
  );
}
