import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  const isDevelopment = phase === PHASE_DEVELOPMENT_SERVER;
  const isVercelDeployment = process.env.VERCEL === "1";
  const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${isDevelopment ? " ws: wss:" : ""}`,
    "frame-src https://challenges.cloudflare.com",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDevelopment || !isVercelDeployment
      ? []
      : ["upgrade-insecure-requests"]),
  ].join("; ");
  const securityHeaders = [
    {
      key: "Content-Security-Policy",
      value: contentSecurityPolicy,
    },
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin",
    },
    {
      key: "Cross-Origin-Resource-Policy",
      value: "same-origin",
    },
    {
      key: "Origin-Agent-Cluster",
      value: "?1",
    },
    {
      key: "Permissions-Policy",
      value:
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "X-DNS-Prefetch-Control",
      value: "off",
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "X-Permitted-Cross-Domain-Policies",
      value: "none",
    },
    ...(isDevelopment || !isVercelDeployment
      ? []
      : [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000",
          },
        ]),
  ];

  return {
    devIndicators: false,
    distDir: isDevelopment ? ".next-dev" : ".next",
    headers: async () => [
      {
        headers: securityHeaders,
        source: "/(.*)",
      },
    ],
    poweredByHeader: false,
    transpilePackages: ["three"],
  };
}
