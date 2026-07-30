import { randomUUID } from "node:crypto";

import {
  type ContactApiResponse,
  validateContactSubmission,
} from "@/lib/contact";
import { createContactEmailContent } from "@/lib/contact-email";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

const resendEndpoint = "https://api.resend.com/emails";
const requestBodyLimit = 12_000;
const requestWindowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 5;
const providerTimeoutMs = 10_000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type ResendErrorResponse = {
  message?: string;
  name?: string;
};

const globalWithContactRateLimit = globalThis as typeof globalThis & {
  contactRateLimit?: Map<string, RateLimitEntry>;
};

const contactRateLimit =
  globalWithContactRateLimit.contactRateLimit ??
  new Map<string, RateLimitEntry>();

globalWithContactRateLimit.contactRateLimit = contactRateLimit;

const responseHeaders = {
  "Cache-Control": "no-store",
} as const;

function jsonResponse(body: ContactApiResponse, status: number) {
  return Response.json(body, {
    headers: responseHeaders,
    status,
  });
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();

  return (
    forwardedFor ||
    request.headers.get("x-real-ip")?.trim() ||
    "local-or-unknown"
  );
}

function checkRateLimit(clientIdentifier: string) {
  const now = Date.now();
  const currentEntry = contactRateLimit.get(clientIdentifier);

  if (!currentEntry || currentEntry.resetAt <= now) {
    contactRateLimit.set(clientIdentifier, {
      count: 1,
      resetAt: now + requestWindowMs,
    });

    return {
      allowed: true,
      retryAfter: 0,
    };
  }

  if (currentEntry.count >= maxRequestsPerWindow) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((currentEntry.resetAt - now) / 1000)),
    };
  }

  currentEntry.count += 1;
  contactRateLimit.set(clientIdentifier, currentEntry);

  if (contactRateLimit.size > 500) {
    for (const [identifier, entry] of contactRateLimit) {
      if (entry.resetAt <= now) {
        contactRateLimit.delete(identifier);
      }
    }

    while (contactRateLimit.size > 500) {
      const oldestIdentifier = contactRateLimit.keys().next().value;

      if (typeof oldestIdentifier !== "string") {
        break;
      }

      contactRateLimit.delete(oldestIdentifier);
    }
  }

  return {
    allowed: true,
    retryAfter: 0,
  };
}

function isBlockedCrossSiteRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");

  return Boolean(
    fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site",
  );
}

export async function POST(request: Request) {
  if (isBlockedCrossSiteRequest(request)) {
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

  if (
    typeof requestBody === "object" &&
    requestBody !== null &&
    !Array.isArray(requestBody) &&
    typeof (requestBody as Record<string, unknown>).website === "string" &&
    (requestBody as Record<string, string>).website.trim().length > 0
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

  const rateLimit = checkRateLimit(getClientIdentifier(request));

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
