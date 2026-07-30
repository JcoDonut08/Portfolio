import { randomUUID } from "node:crypto";

import {
  type ContactApiResponse,
  validateContactSubmission,
} from "@/lib/contact";
import { createContactEmailContent } from "@/lib/contact-email";
import {
  checkContactEmailRateLimit,
  checkContactRequestRateLimits,
  getClientIdentifier,
  isTrustedContactRequest,
  verifyTurnstile,
} from "@/lib/contact-security";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

const resendEndpoint = "https://api.resend.com/emails";
const requestBodyLimit = 12_000;
const providerTimeoutMs = 10_000;

type ResendErrorResponse = {
  message?: string;
  name?: string;
};

const responseHeaders = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
} as const;

function jsonResponse(body: ContactApiResponse, status: number) {
  return Response.json(body, {
    headers: responseHeaders,
    status,
  });
}

export async function POST(request: Request) {
  if (!isTrustedContactRequest(request)) {
    return jsonResponse(
      {
        ok: false,
        message: "This message must be sent from the portfolio.",
      },
      403,
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse(
      {
        ok: false,
        message: "Send the contact details as JSON.",
      },
      415,
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > requestBodyLimit) {
    return jsonResponse(
      {
        ok: false,
        message: "The contact message is too large.",
      },
      413,
    );
  }

  let requestBody: unknown;

  try {
    const rawBody = await request.text();

    if (rawBody.length > requestBodyLimit) {
      return jsonResponse(
        {
          ok: false,
          message: "The contact message is too large.",
        },
        413,
      );
    }

    requestBody = JSON.parse(rawBody);
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "The contact message could not be read.",
      },
      400,
    );
  }

  const requestRecord =
    typeof requestBody === "object" &&
    requestBody !== null &&
    !Array.isArray(requestBody)
      ? (requestBody as Record<string, unknown>)
      : null;

  if (
    requestRecord &&
    typeof requestRecord.website === "string" &&
    requestRecord.website.trim().length > 0
  ) {
    return jsonResponse(
      {
        ok: true,
        message: "Your message has been sent.",
      },
      200,
    );
  }

  const validation = validateContactSubmission(requestBody);

  if (!validation.success) {
    return jsonResponse(
      {
        ok: false,
        message: "Check the highlighted contact details and try again.",
        errors: validation.errors,
      },
      400,
    );
  }

  const clientIdentifier = getClientIdentifier(request);
  const rateLimit = checkContactRequestRateLimits(clientIdentifier);

  if (!rateLimit.allowed) {
    return Response.json(
      {
        ok: false,
        message: "Too many messages were sent. Please try again later.",
      } satisfies ContactApiResponse,
      {
        headers: {
          ...responseHeaders,
          "Retry-After": String(rateLimit.retryAfter),
        },
        status: 429,
      },
    );
  }

  const isVerifiedVisitor = await verifyTurnstile(
    requestRecord && requestRecord.turnstileToken,
    clientIdentifier,
  );

  if (!isVerifiedVisitor) {
    return jsonResponse(
      {
        ok: false,
        message: "Complete the security check and try again.",
      },
      403,
    );
  }

  const emailRateLimit = checkContactEmailRateLimit(validation.data.email);

  if (!emailRateLimit.allowed) {
    return Response.json(
      {
        ok: false,
        message: "Too many messages were sent. Please try again later.",
      } satisfies ContactApiResponse,
      {
        headers: {
          ...responseHeaders,
          "Retry-After": String(emailRateLimit.retryAfter),
        },
        status: 429,
      },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  if (!resendApiKey) {
    return jsonResponse(
      {
        ok: false,
        message:
          "Direct delivery is being configured. Please use the email link below.",
      },
      503,
    );
  }

  const recipientEmail =
    process.env.CONTACT_TO_EMAIL?.trim() || siteConfig.email;
  const senderEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Jericho Portfolio <onboarding@resend.dev>";
  const emailContent = createContactEmailContent(validation.data);

  try {
    const providerResponse = await fetch(resendEndpoint, {
      body: JSON.stringify({
        from: senderEmail,
        html: emailContent.html,
        reply_to: validation.data.email,
        subject: emailContent.subject,
        text: emailContent.text,
        to: [recipientEmail],
      }),
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": randomUUID(),
        "User-Agent": "Jericho-Portfolio/1.0",
      },
      method: "POST",
      signal: AbortSignal.timeout(providerTimeoutMs),
    });

    if (!providerResponse.ok) {
      const providerError = (await providerResponse
        .json()
        .catch(() => ({}))) as ResendErrorResponse;

      console.error("[contact] Email provider rejected the request.", {
        message: providerError.message,
        name: providerError.name,
        status: providerResponse.status,
      });

      return jsonResponse(
        {
          ok: false,
          message:
            "The message could not be delivered right now. Please use the email link below.",
        },
        502,
      );
    }

    return jsonResponse(
      {
        ok: true,
        message: "Message sent. I’ll get back to you as soon as I can.",
      },
      200,
    );
  } catch (error) {
    console.error("[contact] Email provider request failed.", {
      name: error instanceof Error ? error.name : "UnknownError",
    });

    return jsonResponse(
      {
        ok: false,
        message:
          "The message could not be delivered right now. Please use the email link below.",
      },
      502,
    );
  }
}
