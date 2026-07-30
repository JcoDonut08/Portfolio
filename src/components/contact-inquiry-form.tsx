"use client";

import type { FormEvent } from "react";

type ContactInquiryFormProps = {
  recipientEmail: string;
};

const projectCategories = [
  "Website development",
  "UI/UX design",
  "Portfolio or personal site",
  "Collaboration",
  "Other",
] as const;

function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

export function ContactInquiryForm({
  recipientEmail,
}: ContactInquiryFormProps) {
  const prepareEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const name = getFormValue(formData, "name");
    const replyEmail = getFormValue(formData, "email");
    const category = getFormValue(formData, "category");
    const message = getFormValue(formData, "message");
    const subject = `${category} inquiry from ${name}`;
    const body = [
      "Hello Jericho,",
      "",
      message,
      "",
      `Project category: ${category}`,
      `From: ${name}`,
      `Reply email: ${replyEmail}`,
    ].join("\r\n");

    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form
      aria-describedby="contact-form-note"
      className="contact-form"
      onSubmit={prepareEmail}
    >
      <div className="contact-form-row">
        <label className="contact-field">
          <span>Your name</span>
          <input
            autoComplete="name"
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
          {projectCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="contact-field">
        <span>Project details</span>
        <textarea
          name="message"
          placeholder="A quick outline of the idea, goals, or problem to solve…"
          required
          rows={4}
        />
      </label>

      <button className="contact-primary-action" type="submit">
        Prepare email
        <span aria-hidden="true" className="contact-action-icon">
          ↗
        </span>
      </button>

      <p className="contact-form-note" id="contact-form-note">
        Opens your email app with the details filled in.
      </p>
    </form>
  );
}
