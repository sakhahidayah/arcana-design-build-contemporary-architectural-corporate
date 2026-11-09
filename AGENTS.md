# AGENTS.md — OpenCode / Codex Project Rules

> OpenCode should read this file from the repository root. Implementation is driven by `prd.md`, `design.md`, `database-schema.md`, and **ONE numbered block copied from `alltask.txt` at a time**. Never execute the whole file or several tasks in one uncontrolled run.

## Project intent and scope

Build a production-minded multi-page **Arkana Design & Build (fictional/demo brand) corporate website** (architecture/design/interior/construction/renovation) with a CMS/admin, PostgreSQL, projects/case studies, articles, services, certifications, careers, clients/testimonials, SEO, media uploads, and secure quotation workflow. Website UI language: Indonesian. Project is **not** an e-commerce store, generic SaaS landing page, CRM/ERP, or internal construction project manager.

## Brand, demo seed and images — LOCKED

- Brand: **Arkana Design & Build** (demo identity, not a legally verified organization). Tagline “Designed with Vision. Built with Precision.” Homepage Indonesian headline “Dari Konsep hingga Bangunan Nyata.”
- Default website/copy in **Bahasa Indonesia**, no Lorem ipsum. Use legal curated Unsplash Free photo **pages in `design.md` as source catalog**, download files legally & import into Payload Media; store origin/credit/license metadata. Do not hotlink Pinterest, Unsplash photo *HTML pages*, random image proxies, or paid Unsplash+.
- Dev/staging seed: at least 8 fictional concept projects, 6 services, 4 original informational articles, verified taxonomy and optional 1–2 clearly labeled example job posts. Every fictional project must have `isDemo=true` and visibly show **Konsep Ilustratif**. Site `site_settings.demoMode=true` shows a persistent demo disclosure and sets `noindex`; sitemap must not suggest they are real portfolio.
- NEVER fabricate clients, partners, testimonials, certificates, awards, founding dates, team identities, addresses, reachable email/phone, completion counts, or outcomes. `contact_settings` remains genuinely blank until business details are supplied; inquiry can still be saved to database with email notification gracefully disabled.
- If demo mode is disabled, exclude all `isDemo` items from public routes, sitemap, OG/JSON-LD, related items; don't remove visible demo disclosures while demo content remains. Mode switch and publication rules are tested.
- Add source metadata on media `sourceUrl/creditName/licenseType`, review individual license and avoid implied endorsement. All imported example images are illustrative. If download fails, log it and leave a clear safe fallback, not a broken photo pretending to be real.

## Locked decisions

- Next.js 16 App Router + TypeScript + React.
- Payload CMS 3 integrated into Next.js, PostgreSQL 17 (`@payloadcms/db-postgres`), **no separate Laravel backend**.
- Tailwind CSS 4; Manrope + Barlow Condensed, Lucide; optional shadcn/Radix and Motion where appropriate.
- Palette: Navy `#142D3D`, Cloud `#EAEFF1`, Copper `#D99737`, Slate `#72828B`, White `#FFFFFF`. Read `design.md` for accessible semantic variants.
- PostgreSQL already exists on user's Windows Docker Desktop: Compose service `postgres`, container `designbuild_postgres`, DB `designbuild_db`, username `designbuild_admin`, port bound to `127.0.0.1:5432`. **Never recreate/reset/drop it.**
- Local development app runs on the host unless instructed otherwise. Node app reaches Postgres at `127.0.0.1:5432`; do not use `postgres` host from a host-local Node process.
- Use one package manager (prefer pnpm); pin known-compatible versions per OFFICIAL Payload installation docs. Don't blindly upgrade Next/Payload mismatch. Recommended supported Node 24 LTS release after checking current docs and local installation.

## Agent startup checklist for EVERY task

1. Read `AGENTS.md`, the **single active numbered task copied from `alltask.txt`**, and relevant sections of `prd.md`, `design.md`, `database-schema.md` (do not ingest all 28 tasks into model context).
2. Inspect current repository, git status, package scripts, and existing code; **do not assume an empty repo**. Pay attention to existing `docker-compose.yml`, `.env`, `.gitignore`.
3. If an essential secret/service is missing, report exactly what is missing and implement everything safe without inventing secrets. Do not ask the owner to paste credentials into chat.
4. Work **only** on the requested task and its necessary dependencies; avoid unrelated refactors. Keep changes small and reviewable.
5. Update schema through Payload config and migrations (no ad hoc raw SQL changes). Do not execute destructive commands.
6. Run focused tests, typecheck/lint where applicable, `build` for end-to-end/structural tasks. Fix detected errors within scope; do not claim success unless commands pass.
7. Finish with a concise report: changed files, functional behavior, migration changes, verification commands/results, issues/risks, next task suggestion. No 'done' based on screenshots alone.

## Repository & naming conventions

Suggested layout (adapt to Payload official scaffold rather than breaking it):

```text
src/
  app/
    (frontend)/ ...     # public App Router pages
    (payload)/ ...      # Payload admin/API generated routes
  collections/           # Payload CollectionConfig
  globals/               # Payload GlobalConfig
  blocks/                # approved editorial page blocks
  components/            # public UI components
  lib/                   # server-only Payload helpers, auth, SEO, validation
  styles/                # tokens / Tailwind setup
  migrations/            # Payload-generated migration files
  tests/                 # unit/integration
  payload.config.ts      # or root per official scaffold
public/                  # static safe assets only; NO private uploads
```

Use `kebab-case` file names where idiomatic; `PascalCase` React components; TypeScript strict; server-render where feasible; minimize `use client`. Keep utilities modular and do not invent duplicate data sources.

## Database & secrets — HARD SAFETY RULES

- **Do not overwrite** root `.env`, `docker-compose.yml`, `.gitignore`, or existing `postgres_data` volume. Add only necessary keys and explain changes. App-specific secrets can go into `.env.local` (ignored by Git). Commit `.env.example` with placeholders but NO secrets.
- Never run `docker compose down -v`, `docker volume rm`, `DROP DATABASE`, `TRUNCATE`, `migrate:fresh`, `migrate:reset`, `migrate:refresh`, destructive migration on user's existing data, or unreviewed deletes. Need permission for destructive operations.
- Never print/commit real passwords, connection URLs, tokens, email recipient credentials, or internal quotations.
- DBeaver is for inspection; schema source of truth is Payload config and migration files.
- Dev may use Postgres push mode per Payload docs; create migration files for schema changes and validate on a **disposable separate DB**. Do not assume generated migration is already applied to existing DB.
- Login admin securely; bootstrap only via explicit local first-user flow or an opt-in script with env password, never hardcoded credentials.

## Access & privacy — HARD SAFETY RULES

- `Super Admin` may manage users, roles, settings, content, inquiries. `Editor` may manage editorial content and limited quotation workflow; cannot alter roles/users, delete quote audit, or self-promote. Public may read approved+published content and submit validated inquiries only.
- Payload Local API `overrideAccess` defaults true: use `overrideAccess: false` plus authenticated `user` for user-scoped operations; enforce explicit published filters even for trusted public server-rendered calls. Deny anonymous REST/GraphQL access to protected collections.
- Drafts, editorial versions and secure previews must never be publicly exposed; noindex preview and admin.
- Separate public media and private quote attachments physically and in auth policy. No private upload files under publicly served static directory. Validate MIME/file signatures, size, max count, filename; safe downloads only through authenticated route or signed URLs.
- Validate all public forms with Zod on server; persist first then send notification; robust failure messages; rate limit public endpoints, implement spam defenses; don't leak PII in analytics, logs or error responses.
- Quotation statuses `new → contacted → in_review → closed` with append-only audit. No marketing form that only calls `alert()` or `console.log()`.
- Demo brand copy and clearly labeled concept projects are allowed only with `isDemo=true` and visible demo disclosure. Do not invent real client names, certification numbers, project outcome claims, testimonial identities, business contact info, or employment offers.

## Design & UX rules

- Review user-supplied references under `references/` and synthesis in `design.md`. Never copy reference screenshots into the site. **Use curated Unsplash Free / Pexels Free images as illustrated demo media**, legally fetched and imported into Payload; preserve original photo page, credits, demo labeling. No random hotlink sources or fake project attributions.
- Architectural editorial; expressive layouts, well-crafted large imagery, precise lines, spacious typography; no generic glassmorphism, 20 identical cards, SaaS dashboard visual language for public site, gratuitous orange/neon.
- Body text white surfaces must be navy or accessible dark semantic text. Copper on white is not accessible as small body text. Ensure WCAG 2.2 AA target, keyboard navigation, image alt, focus states, 320px+ mobile.
- Every CTA must lead to a working route/form/contact or be hidden when the necessary configuration is unavailable. No dead links or mock functions.
- Components should use CMS-provided content, never hardcode business claims. Good graceful empty states.

## Functional completion protocol

A task is completed only when: implementation is real (including persistence where appropriate), acceptance criteria in task met, bad-path states handled, tests passed or blockers explicitly recorded, no accidental secrets/debug assets, and developer can reproduce it.

For the whole project, run: `pnpm lint` (if configured), `pnpm typecheck`, `pnpm test`, `pnpm exec playwright test` (where configured), `pnpm build`; report actual command outputs. Add appropriate npm scripts once the scaffolding exists; don't write false success claims.

## Task sequencing

Open `alltask.txt` and **copy-paste only the desired numbered `TASK NN/28` block** into OpenCode. Run TASK 01 → 28 in order, based on dependencies; do not ask OpenCode to read alltask.txt in full every turn. Each task has acceptance criteria. Verify, report, then ask for next separate prompt.

## Official source links / verify APIs before writing code

- https://payloadcms.com/docs/getting-started/installation
- https://payloadcms.com/docs/database/postgres
- https://payloadcms.com/docs/database/migrations
- https://payloadcms.com/docs/versions/drafts
- https://payloadcms.com/docs/admin/preview
- https://payloadcms.com/docs/plugins/seo
- https://payloadcms.com/docs/upload/storage-adapters
- https://payloadcms.com/docs/local-api/access-control
- https://payloadcms.com/docs/upload/overview
- https://unsplash.com/license/
- https://www.pexels.com/legal-pages/license/
- https://opencode.ai/docs/rules/

If official docs/API versions differ, follow current compatible official instructions; document exact resolved versions and changes in final report, without violating locked architecture.
