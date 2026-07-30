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
```

`onboarding@resend.dev` is suitable while testing when the recipient is the
email address associated with the Resend account. For production delivery from
your own address, verify a domain in Resend and update `CONTACT_FROM_EMAIL`.

The route validates every field, escapes user content before building the
email, rejects oversized or cross-origin requests, uses a spam honeypot, and
applies separate per-IP, per-email, and global per-instance request limits.
The site also sends a Content Security Policy and browser hardening headers.

### Optional Turnstile protection

For stronger bot protection, create a Cloudflare Turnstile widget for the
production domains and add all three values to Vercel:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=replace_with_your_site_key
TURNSTILE_SECRET_KEY=replace_with_your_secret_key
TURNSTILE_ALLOWED_HOSTNAMES=your-domain.example,your-project.vercel.app
```

Set all three values together and redeploy. The public site key renders the
widget; the secret is used only by the server to validate a single-use token.
The API fails closed when the secret is configured but a valid token is
missing.

The built-in limits are deliberately lightweight and reset with a serverless
instance. For distributed protection on Vercel, also create a Firewall rate
limit rule for `/api/contact`.
