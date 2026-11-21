# Portfolio project content sources

Reviewed on 21 November 2026. This file maps portfolio descriptions to supplied roles and repository evidence. Repository features describe the project; they do not establish individual authorship or a successful production deployment.

The user confirmed a full-stack role for Saan Tayo? and graduation around April. Public copy uses expected April 2027, taking this as the upcoming April in the fourth-year context. No internship start date or detailed module-by-module ownership was supplied.

| Project / claim | Evidence |
| --- | --- |
| GabayIskolar is an OVERCLOCK 2026 scholarship-preparation prototype built by The Prompters | [README](https://github.com/Rikitu03/Hackathon-Da-Prompters-2026/blob/main/README.md) |
| Jericho's role is frontend | User supplied in this portfolio update; no backend or AI module ownership inferred |
| Applicant guides, local checklist/drafts, document-review and source-backed assistance interfaces | [README](https://github.com/Rikitu03/Hackathon-Da-Prompters-2026/blob/main/README.md), [architecture](https://github.com/Rikitu03/Hackathon-Da-Prompters-2026/blob/main/docs/ARCHITECTURE.md) |
| Next.js/React/TypeScript frontend; Supabase/Lumen server integrations belong to the overall project | [architecture](https://github.com/Rikitu03/Hackathon-Da-Prompters-2026/blob/main/docs/ARCHITECTURE.md) |
| GabayIskolar interface screenshots | [committed screenshots](https://github.com/Rikitu03/Hackathon-Da-Prompters-2026/tree/main/docs/screenshots); local image provenance at `public/assets/projects/reviewed/SOURCES.md` |
| AgriFarm is the Laravel/React application owned by JcoDonut08, replacing the previously linked Next.js/NestJS repository | User supplied corrected repository; [README](https://github.com/JcoDonut08/agrifarm/blob/main/README.md) |
| Jericho's AgriFarm role is full-stack | User supplied; do not infer ownership of every feature |
| Laravel 12, React 19/Inertia, PostgreSQL; Laravel owns business rules and persistence | [README](https://github.com/JcoDonut08/agrifarm/blob/main/README.md), [architecture](https://github.com/JcoDonut08/agrifarm/blob/main/docs/architecture.md) |
| Customer catalog, seller operations, COD checkout, stock locking, forecasts | [README](https://github.com/JcoDonut08/agrifarm/blob/main/README.md), [architecture](https://github.com/JcoDonut08/agrifarm/blob/main/docs/architecture.md) |
| Online payment processing is deferred | [README](https://github.com/JcoDonut08/agrifarm/blob/main/README.md); do not describe an integrated online payment gateway |
| AgriFarm homepage interface image | [homepage sharing image](https://github.com/JcoDonut08/agrifarm/blob/main/public/images/agrifarm-homepage-share-v1.jpg) |
| Loveby Ade is a team project; Jericho's supplied role is full-stack | User supplied role; [original contribution report](https://github.com/JcoDonut08/Loveby_Ade/blob/main/README.md) |
| Team lead, UI/UX and QA responsibilities appear in the academic report | [original contribution report](https://github.com/JcoDonut08/Loveby_Ade/blob/main/README.md); specific module authorship is unconfirmed |
| PHP 8.2+, Laravel 12, Dompdf, Socialite | [composer.json](https://github.com/JcoDonut08/Loveby_Ade/blob/main/composer.json) |
| Blade interface, catalog/cart/checkout/orders, admin promotions/reports/audit routes | [routes/web.php](https://github.com/JcoDonut08/Loveby_Ade/blob/main/routes/web.php), [resources/views](https://github.com/JcoDonut08/Loveby_Ade/tree/main/resources/views) |
| MySQL local defaults; logged mail; optional Google credentials | [.env.example](https://github.com/JcoDonut08/Loveby_Ade/blob/main/.env.example) |
| Tailwind 4 and Vite 7; npm dev/build scripts | [package.json](https://github.com/JcoDonut08/Loveby_Ade/blob/main/package.json) |
| Order creation uses a transaction and product stock locks | [CheckoutService](https://github.com/JcoDonut08/Loveby_Ade/blob/main/app/Services/CheckoutService.php) |
| Database tables and sample product setup | [migrations](https://github.com/JcoDonut08/Loveby_Ade/tree/main/database/migrations), [ProductSeeder](https://github.com/JcoDonut08/Loveby_Ade/blob/main/database/seeders/ProductSeeder.php) |
| Feature-test areas exist, with in-memory SQLite test configuration | [tests/Feature](https://github.com/JcoDonut08/Loveby_Ade/tree/main/tests/Feature), [phpunit.xml](https://github.com/JcoDonut08/Loveby_Ade/blob/main/phpunit.xml); tests have not been rerun as part of this content review |
| Saan Tayo? is an Expo/React Native mobile-first Metro Manila discovery prototype | [README](https://github.com/JcoDonut08/Saan-Tayo-/blob/main/README.md), [package.json](https://github.com/JcoDonut08/Saan-Tayo-/blob/main/package.json) |
| Local deterministic matching, venue discovery, onboarding and saved places | [README](https://github.com/JcoDonut08/Saan-Tayo-/blob/main/README.md) |
| Real authentication, backend, maps, live availability and AI recommendations are not implemented | [README](https://github.com/JcoDonut08/Saan-Tayo-/blob/main/README.md); do not present as a complete full-stack service |

## Related documentation update

The application-focused Loveby Ade README was published through [Loveby_Ade PR #1](https://github.com/JcoDonut08/Loveby_Ade/pull/1). The original academic report is preserved verbatim at [docs/contribution-report.md](https://github.com/JcoDonut08/Loveby_Ade/blob/main/docs/contribution-report.md), reusing its original Git blob. No application behavior changed in that documentation update.

## Content maintenance

Demo check on 21 November 2026: the documented AgriFarm Railway URL returned a Railway 404 and is omitted from public demo actions. GabayIskolar's Vercel URL loaded an earlier deployed homepage; its case study distinguishes the deployment from repository screenshots. No public demo was verified for Loveby Ade or Saan Tayo?.

Keep dates, test counts, availability, demos, and individual module ownership tied to current evidence or direct confirmation. Explain prototype limits in the case study. A repository homepage URL alone does not prove that a deployment's complete user flow works.

