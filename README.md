# Portfolio

A personal portfolio built with Next.js, React, TypeScript, and Tailwind CSS.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- npm
- Git + GitHub

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Contact Email Backend

The contact form posts to the server-side `/api/contact` route and sends the
message through the Resend REST API. Copy `.env.example` to `.env.local`, then
set:

```bash
RESEND_API_KEY=re_replace_with_your_key
CONTACT_TO_EMAIL=jerichosalvador08@gmail.com
CONTACT_FROM_EMAIL="Jericho Portfolio <onboarding@resend.dev>"
CONTACT_ALLOWED_ORIGINS=https://your-domain.example,https://your-project.vercel.app
NEXT_PUBLIC_TURNSTILE_SITE_KEY=replace_with_your_site_key
TURNSTILE_SECRET_KEY=replace_with_your_secret_key
TURNSTILE_ALLOWED_HOSTNAMES=your-domain.example,your-project.vercel.app
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=replace_with_your_token
```

`onboarding@resend.dev` is suitable while testing when the recipient is the
email address associated with the Resend account. For production delivery from
your own address, verify a domain in Resend and update `CONTACT_FROM_EMAIL`.

The route validates every field, escapes user content before building the
email, rejects oversized or cross-origin requests, uses a spam honeypot, and
applies separate durable per-IP, per-email, and global request limits through
Upstash Redis. The site also sends a Content Security Policy and browser
hardening headers.

### Required production contact protection

For stronger bot protection, create a Cloudflare Turnstile widget for the
production domains and add all three values to Vercel:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=replace_with_your_site_key
TURNSTILE_SECRET_KEY=replace_with_your_secret_key
TURNSTILE_ALLOWED_HOSTNAMES=your-domain.example,your-project.vercel.app
```

Set all three Turnstile values together and redeploy. The public site key
renders the widget; the secret is used only by the server to validate a
single-use token. Production requests fail closed if Turnstile is missing or
misconfigured.

Create an Upstash Redis database and configure its REST URL and token. The
serverless limiter uses shared sliding windows across deployments and fails
closed if the production rate-limit store is missing or unavailable. Local
development keeps a bounded in-memory fallback so the form remains testable
without production secrets.

## Automated smoke tests

The Playwright suite covers the loading handoff, section navigation, mobile
menu, contact validation, and error-page recovery:

```bash
npm run test:e2e
```

Playwright starts its own temporary development server for the test run. The
GitHub Actions workflow runs the same suite in CI.
