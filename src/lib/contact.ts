export const contactCategories = [
  "Internship / recruitment",
  "Website development",
  "UI/UX design",
  "Portfolio or personal site",
  "Collaboration",
  "Other",
] as const;

export const contactLimits = {
  name: {
    min: 2,
    max: 80,
  },
  email: {
    max: 254,
  },
  message: {
    min: 20,
    max: 3000,
  },
} as const;

export type ContactCategory = (typeof contactCategories)[number];

export type ContactSubmission = {
  name: string;
  email: string;
  category: ContactCategory;
  message: string;
};

export type ContactField = keyof ContactSubmission;

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactApiResponse =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
      errors?: ContactFieldErrors;
    };

type ContactValidationResult =
  | {
      success: true;
      data: ContactSubmission;
    }
  | {
      success: false;
      errors: ContactFieldErrors;
    };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getTextField(
  value: Record<string, unknown>,
  fieldName: string,
): string {
  const fieldValue = value[fieldName];
  return typeof fieldValue === "string" ? fieldValue.trim() : "";
}

function isContactCategory(value: string): value is ContactCategory {
  return (contactCategories as readonly string[]).includes(value);
}

export function validateContactSubmission(
  value: unknown,
): ContactValidationResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {
      success: false,
      errors: {
        message: "Enter your message before sending.",
      },
    };
  }

  const record = value as Record<string, unknown>;
  const name = getTextField(record, "name").replace(/\s+/g, " ");
  const email = getTextField(record, "email").toLowerCase();
  const category = getTextField(record, "category");
  const message = getTextField(record, "message");
  const errors: ContactFieldErrors = {};

  if (
    name.length < contactLimits.name.min ||
    name.length > contactLimits.name.max
  ) {
    errors.name = `Use between ${contactLimits.name.min} and ${contactLimits.name.max} characters for your name.`;
  }

  if (
    email.length > contactLimits.email.max ||
    !emailPattern.test(email)
  ) {
    errors.email = "Enter a valid reply email address.";
  }

  if (!isContactCategory(category)) {
    errors.category = "Select a reason for getting in touch.";
  }

  if (
    message.length < contactLimits.message.min ||
    message.length > contactLimits.message.max
  ) {
    errors.message = `Use between ${contactLimits.message.min} and ${contactLimits.message.max} characters for your message.`;
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data: {
      name,
      email,
      category: category as ContactCategory,
      message,
    },
  };
}
