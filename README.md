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
```

`onboarding@resend.dev` is suitable while testing when the recipient is the
email address associated with the Resend account. For production delivery from
your own address, verify a domain in Resend and update `CONTACT_FROM_EMAIL`.

The route validates every field, rejects oversized and cross-site requests,
uses a spam honeypot, and applies a lightweight per-instance request limit.
For stricter distributed throttling across multiple server instances, connect
the route to a shared rate-limit store before a high-traffic launch.
