import { randomUUID } from "node:crypto";
import { isIP } from "node:net";

const turnstileEndpoint =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const turnstileAction = "portfolio_contact";
const turnstileTimeoutMs = 8_000;
const turnstileTokenMaxLength = 2_048;

type TurnstileResponse = {
  action?: string;
  hostname?: string;
  success?: boolean;
};

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

export function isContactProtectionConfigured() {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const hasAllowedHostname =
    (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
      .split(",")
      .some((hostname) => hostname.trim().length > 0) ||
    getConfiguredOrigins().length > 0;

  return Boolean(secret && siteKey && hasAllowedHostname);
}

export async function verifyTurnstile(
  token: unknown,
  clientIdentifier: string,
) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (!secret && !siteKey) {
    return process.env.NODE_ENV !== "production";
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
