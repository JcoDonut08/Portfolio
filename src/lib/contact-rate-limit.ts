import { createHash } from "node:crypto";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const rateLimitTimeoutMs = 2_500;
const rateLimitStoreMaxSize = 500;

type ContactRateLimitResult = {
  allowed: boolean;
  available: boolean;
  retryAfter: number;
};

type MemoryRateLimitEntry = {
  count: number;
  resetAt: number;
};

type MemoryRateLimitPolicy = {
  key: string;
  limit: number;
  windowMs: number;
};

type DurableRateLimitPolicy = {
  identifier: string;
  limiter: Ratelimit;
  scope: "email" | "global" | "ip";
};

const globalWithContactRateLimit = globalThis as typeof globalThis & {
  contactRateLimit?: Map<string, MemoryRateLimitEntry>;
};

const developmentRateLimitStore =
  globalWithContactRateLimit.contactRateLimit ??
  new Map<string, MemoryRateLimitEntry>();

globalWithContactRateLimit.contactRateLimit = developmentRateLimitStore;

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

function createRedisClient() {
  if (!upstashUrl || !upstashToken) {
    return null;
  }

  try {
    return new Redis({ token: upstashToken, url: upstashUrl });
  } catch (error) {
    console.error("[contact] Durable rate limiter configuration is invalid.", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return null;
  }
}

const redis = createRedisClient();

function createDurableLimiter(
  limit: number,
  window: "15 m" | "1 h",
  prefix: string,
) {
  if (!redis) {
    return null;
  }

  return new Ratelimit({
    analytics: false,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix,
    redis,
    timeout: rateLimitTimeoutMs,
  });
}

const ipRateLimiter = createDurableLimiter(5, "15 m", "jps:contact:ip");
const globalRateLimiter = createDurableLimiter(
  60,
  "15 m",
  "jps:contact:global",
);
const emailRateLimiter = createDurableLimiter(
  3,
  "1 h",
  "jps:contact:email",
);

function hashIdentifier(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

function unavailableResult(): ContactRateLimitResult {
  return {
    allowed: false,
    available: false,
    retryAfter: 0,
  };
}

function cleanExpiredDevelopmentLimits(now: number) {
  if (developmentRateLimitStore.size <= rateLimitStoreMaxSize) {
    return;
  }

  for (const [identifier, entry] of developmentRateLimitStore) {
    if (entry.resetAt <= now) {
      developmentRateLimitStore.delete(identifier);
    }
  }

  while (developmentRateLimitStore.size > rateLimitStoreMaxSize) {
    const oldestIdentifier = developmentRateLimitStore.keys().next().value;

    if (typeof oldestIdentifier !== "string") {
      break;
    }

    developmentRateLimitStore.delete(oldestIdentifier);
  }
}

function checkDevelopmentPolicy(
  policy: MemoryRateLimitPolicy,
): ContactRateLimitResult {
  const now = Date.now();
  const currentEntry = developmentRateLimitStore.get(policy.key);

  if (!currentEntry || currentEntry.resetAt <= now) {
    developmentRateLimitStore.set(policy.key, {
      count: 1,
      resetAt: now + policy.windowMs,
    });
    cleanExpiredDevelopmentLimits(now);

    return { allowed: true, available: true, retryAfter: 0 };
  }

  if (currentEntry.count >= policy.limit) {
    return {
      allowed: false,
      available: true,
      retryAfter: Math.max(
        1,
        Math.ceil((currentEntry.resetAt - now) / 1_000),
      ),
    };
  }

  currentEntry.count += 1;
  developmentRateLimitStore.set(policy.key, currentEntry);

  return { allowed: true, available: true, retryAfter: 0 };
}

function checkDevelopmentPolicies(policies: MemoryRateLimitPolicy[]) {
  for (const policy of policies) {
    const result = checkDevelopmentPolicy(policy);

    if (!result.allowed) {
      return result;
    }
  }

  return { allowed: true, available: true, retryAfter: 0 };
}

async function checkDurablePolicies(
  policies: DurableRateLimitPolicy[],
): Promise<ContactRateLimitResult> {
  for (const policy of policies) {
    try {
      const result = await policy.limiter.limit(policy.identifier);

      if (result.reason === "timeout") {
        console.error("[contact] Durable rate limiter timed out.", {
          scope: policy.scope,
        });
        return unavailableResult();
      }

      if (!result.success) {
        return {
          allowed: false,
          available: true,
          retryAfter: Math.max(
            1,
            Math.ceil((result.reset - Date.now()) / 1_000),
          ),
        };
      }
    } catch (error) {
      console.error("[contact] Durable rate limiter failed.", {
        name: error instanceof Error ? error.name : "UnknownError",
        scope: policy.scope,
      });
      return unavailableResult();
    }
  }

  return { allowed: true, available: true, retryAfter: 0 };
}

export function isDurableContactRateLimitConfigured() {
  return Boolean(
    ipRateLimiter && globalRateLimiter && emailRateLimiter && redis,
  );
}

export async function checkContactRequestRateLimits(
  clientIdentifier: string,
) {
  if (ipRateLimiter && globalRateLimiter) {
    return checkDurablePolicies([
      {
        identifier: hashIdentifier(clientIdentifier),
        limiter: ipRateLimiter,
        scope: "ip",
      },
      {
        identifier: "portfolio-contact",
        limiter: globalRateLimiter,
        scope: "global",
      },
    ]);
  }

  if (process.env.NODE_ENV === "production") {
    return unavailableResult();
  }

  const fifteenMinutes = 15 * 60 * 1_000;

  return checkDevelopmentPolicies([
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
  ]);
}

export async function checkContactEmailRateLimit(senderEmail: string) {
  if (emailRateLimiter) {
    return checkDurablePolicies([
      {
        identifier: hashIdentifier(senderEmail),
        limiter: emailRateLimiter,
        scope: "email",
      },
    ]);
  }

  if (process.env.NODE_ENV === "production") {
    return unavailableResult();
  }

  return checkDevelopmentPolicies([
    {
      key: `contact:email:${hashIdentifier(senderEmail)}`,
      limit: 3,
      windowMs: 60 * 60 * 1_000,
    },
  ]);
}
