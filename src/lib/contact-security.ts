import { createHash, randomUUID } from "node:crypto";
import { isIP } from "node:net";

const turnstileEndpoint =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const turnstileAction = "portfolio_contact";
const turnstileTimeoutMs = 8_000;
const turnstileTokenMaxLength = 2_048;
const rateLimitStoreMaxSize = 500;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitPolicy = {
  key: string;
  limit: number;
  windowMs: number;
};

type TurnstileResponse = {
  action?: string;
  hostname?: string;
  success?: boolean;
};

const globalWithContactRateLimit = globalThis as typeof globalThis & {
  contactRateLimit?: Map<string, RateLimitEntry>;
};

const contactRateLimit =
  globalWithContactRateLimit.contactRateLimit ??
  new Map<string, RateLimitEntry>();

globalWithContactRateLimit.contactRateLimit = contactRateLimit;

function normalizeOrigin(value: string | null | undefined) {
  if (!value || value === "null") {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

function getConfiguredOrigins() {
  const configuredOrigins = (process.env.CONTACT_ALLOWED_ORIGINS ?? "")
    .split(",");
  const vercelOrigins = [
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ].map((hostname) => (hostname ? `https://${hostname}` : ""));

  return [...configuredOrigins, ...vercelOrigins]
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter((origin): origin is string => Boolean(origin));
}

function getTargetOrigins(request: Request) {
  const configuredOrigins = getConfiguredOrigins();

  if (configuredOrigins.length > 0) {
    return new Set(configuredOrigins);
  }

  const targetOrigins = new Set<string>();
  const requestOrigin = normalizeOrigin(request.url);

  if (requestOrigin) {
    targetOrigins.add(requestOrigin);
  }

  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const host =
    forwardedHost ||
    request.headers.get("host")?.split(",")[0]?.trim();
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  if (host) {
    const protocol =
      forwardedProtocol ||
      (new URL(request.url).protocol === "https:" ? "https" : "http");
    const forwardedOrigin = normalizeOrigin(`${protocol}://${host}`);

    if (forwardedOrigin) {
      targetOrigins.add(forwardedOrigin);
    }
  }

  return targetOrigins;
}

function getSourceOrigin(request: Request) {
  const origin = normalizeOrigin(request.headers.get("origin"));

  if (origin) {
    return origin;
  }

  const referer = request.headers.get("referer");
  return normalizeOrigin(referer);
}

function cleanExpiredRateLimits(now: number) {
  if (contactRateLimit.size <= rateLimitStoreMaxSize) {
    return;
  }

  for (const [identifier, entry] of contactRateLimit) {
    if (entry.resetAt <= now) {
      contactRateLimit.delete(identifier);
    }
  }

  while (contactRateLimit.size > rateLimitStoreMaxSize) {
    const oldestIdentifier = contactRateLimit.keys().next().value;

    if (typeof oldestIdentifier !== "string") {
      break;
    }

    contactRateLimit.delete(oldestIdentifier);
  }
}

function checkRateLimitPolicy(policy: RateLimitPolicy) {
  const now = Date.now();
  const currentEntry = contactRateLimit.get(policy.key);

  if (!currentEntry || currentEntry.resetAt <= now) {
    contactRateLimit.set(policy.key, {
      count: 1,
      resetAt: now + policy.windowMs,
    });
    cleanExpiredRateLimits(now);

    return {
      allowed: true,
      retryAfter: 0,
    };
  }

  if (currentEntry.count >= policy.limit) {
    return {
      allowed: false,
      retryAfter: Math.max(
        1,
        Math.ceil((currentEntry.resetAt - now) / 1_000),
      ),
    };
  }

  currentEntry.count += 1;
  contactRateLimit.set(policy.key, currentEntry);

  return {
    allowed: true,
    retryAfter: 0,
  };
}

function hashIdentifier(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

function getFirstValidIp(value: string | null) {
  if (!value) {
    return null;
  }

  for (const candidate of value.split(",")) {
    const normalizedCandidate = candidate.trim();

    if (isIP(normalizedCandidate)) {
      return normalizedCandidate;
    }
  }

  return null;
}

export function getClientIdentifier(request: Request) {
  return (
    getFirstValidIp(request.headers.get("x-vercel-forwarded-for")) ||
    getFirstValidIp(request.headers.get("x-forwarded-for")) ||
    getFirstValidIp(request.headers.get("x-real-ip")) ||
    "local-or-unknown"
  );
}

export function isTrustedContactRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") {
    return false;
  }

  const sourceOrigin = getSourceOrigin(request);

  if (!sourceOrigin) {
    return false;
  }

  return getTargetOrigins(request).has(sourceOrigin);
}

function checkRateLimitPolicies(policies: RateLimitPolicy[]) {
  for (const policy of policies) {
    const result = checkRateLimitPolicy(policy);

    if (!result.allowed) {
      return result;
    }
  }

  return {
    allowed: true,
    retryAfter: 0,
  };
}

export function checkContactRequestRateLimits(clientIdentifier: string) {
  const fifteenMinutes = 15 * 60 * 1_000;
  const policies: RateLimitPolicy[] = [
    {
      key: `contact:ip:${hashIdentifier(clientIdentifier)}`,
      limit: 5,
      windowMs: fifteenMinutes,
    },
    {
      key: "contact:global",
      limit: 60,
      windowMs: fifteenMinutes,
    },
  ];

  return checkRateLimitPolicies(policies);
}

export function checkContactEmailRateLimit(senderEmail: string) {
  return checkRateLimitPolicies([
    {
      key: `contact:email:${hashIdentifier(senderEmail)}`,
      limit: 3,
      windowMs: 60 * 60 * 1_000,
    },
  ]);
}

export async function verifyTurnstile(
  token: unknown,
  clientIdentifier: string,
) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (!secret && !siteKey) {
    return true;
  }

  if (!secret || !siteKey) {
    return false;
  }

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > turnstileTokenMaxLength
  ) {
    return false;
  }

  const allowedHostnames = new Set(
    [
      ...(process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "").split(","),
      ...getConfiguredOrigins().map((origin) => new URL(origin).hostname),
    ]
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );

  if (process.env.NODE_ENV === "production" && allowedHostnames.size === 0) {
    return false;
  }

  try {
    const verificationBody = new URLSearchParams({
      idempotency_key: randomUUID(),
      response: token,
      secret,
    });

    if (isIP(clientIdentifier)) {
      verificationBody.set("remoteip", clientIdentifier);
    }

    const verificationResponse = await fetch(turnstileEndpoint, {
      body: verificationBody,
      cache: "no-store",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      signal: AbortSignal.timeout(turnstileTimeoutMs),
    });

    if (!verificationResponse.ok) {
      return false;
    }

    const result = (await verificationResponse.json()) as TurnstileResponse;
    const hostname = result.hostname?.toLowerCase();
    const isAllowedHostname =
      allowedHostnames.size === 0 ||
      Boolean(hostname && allowedHostnames.has(hostname));

    return Boolean(
      result.success &&
        result.action === turnstileAction &&
        isAllowedHostname,
    );
  } catch {
    return false;
  }
}
