# N5Deal Marketplace Prototype

## Project Overview

N5Deal is a prototype European M&A and financial-asset marketplace inspired by the N5Deal product scenario.

- **Buyer**: discovers active assets, manages acquisition preferences, reviews Smart Match explanations, and contacts Sellers.
- **Seller**: creates and manages assets, discovers Buyers, and responds to inquiries.
- **Platform Manager**: monitors marketplace activity and moderates users and assets.

## Live Demo

Not deployed yet. Follow the Vercel steps below for deployment.

## Demo Accounts

The seed creates application users for these demo roles:

| Role | Email |
| --- | --- |
| Buyer | `ana.novak@northstarcapital.eu` |
| Seller | `martin.hughes@finwave.co.uk` |
| Manager | `manager@n5deal.eu` |

Authentication is handled by Supabase Auth, so passwords are not stored in this repository. Create Supabase Auth users with the emails above and temporary reviewer-chosen passwords. On first sign-in, the application links the Supabase identity to the matching seeded application user by email.

Run the seed before creating the Auth users. Re-running the seed recreates application users and requires linking the Auth users again.

## Core Features

### Buyer

- Browse, search, filter, and sort active assets.
- Manage acquisition preferences.
- Review deterministic, explainable Smart Match scores.
- Contact Sellers through persisted inquiries.

### Seller

- Create, view, edit, and delete owned assets.
- Browse and filter Buyers.
- Contact Buyers through persisted inquiries.

### Manager

- Review marketplace users and assets.
- Suspend and reactivate users.
- Suspend, reactivate, and moderate assets.

## Tech Stack

- Next.js App Router
- TypeScript
- PostgreSQL / Supabase PostgreSQL
- Prisma
- Supabase Auth
- Tailwind CSS
- shadcn/ui-style Radix components
- Zod
- React Hook Form
- Vitest
- pnpm

## Architecture

```text
Next.js App Router
        ↓
Server Components / Server Actions
        ↓
Role authorization + Zod validation
        ↓
Prisma ORM
        ↓
Supabase PostgreSQL
```

Supabase Auth owns identity and sessions. The Prisma `User` record stores application role, status, and marketplace data; it is linked to Auth through `authUserId` and can be linked by email on first sign-in.

## Data Model

- **User**: identity link, company, country, role, and moderation status.
- **BuyerProfile**: acquisition budget and preferred countries, industries, and asset types.
- **Asset**: Seller-owned M&A/financial asset, commercial details, operating metrics, and moderation status.
- **Inquiry**: persisted Buyer/Seller contact message, optionally linked to an Asset.

## Key Technical Decisions

1. **PostgreSQL** provides relational integrity for users, ownership, moderation, and inquiries.
2. **Supabase** provides hosted PostgreSQL and authentication without adding a separate identity service.
3. **Prisma** provides typed database access, migrations, and a schema close to the domain model.
4. **Server Actions and server-side authorization** keep ownership, role, status, and validation checks close to data mutations.
5. **Smart Match is deterministic** so scores are fast, reproducible, explainable, and do not require external AI infrastructure.

## Assumptions

- Each application user has one role: Buyer, Seller, or Manager.
- Sellers may own multiple assets.
- Contact is represented by an Inquiry rather than realtime chat.
- Only `ACTIVE` assets owned by `ACTIVE` Sellers are visible to Buyers.
- Suspended Buyers are hidden from Seller discovery.
- Manager moderation overrides marketplace visibility.

## Smart Match

Smart Match calculates a score from current BuyerProfile and Asset data:

- Budget fit: **30 points**
- Industry/business type: **30 points**
- Preferred geography: **20 points**
- Asset type: **10 points**
- Relevant active status: **10 points**

Missing optional preferences are treated neutrally. The result is clamped to 0–100 and includes a match level, score breakdown, and concise human-readable reasons. No LLM, embeddings, vector database, or external AI API is used.

## Setup

Requirements: Node.js 20.9+, pnpm 11, a PostgreSQL-compatible database, and a Supabase project for authentication.

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create local environment configuration:

   ```bash
   cp .env.example .env.local
   ```

3. Set these values in `.env.local`:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
   NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
   ```

   `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported as a legacy fallback for the public key variable.

4. Apply existing migrations and generate Prisma Client:

   ```bash
   pnpm db:migrate
   pnpm db:generate
   ```

5. Seed the demo application data. This replaces existing application rows, so do not run it against production data:

   ```bash
   pnpm db:seed
   ```

6. Create the three demo users in Supabase Auth using the emails in the Demo Accounts section and reviewer-chosen temporary passwords.

7. Start the app:

   ```bash
   pnpm dev
   ```

Open `http://localhost:3000/login`.

For a Supabase PostgreSQL deployment, use the production-compatible connection string supplied by Supabase. Keep database credentials server-side; only the public Supabase URL and publishable/anon key belong in `NEXT_PUBLIC_*` variables.

## Testing

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```

The automated tests cover Smart Match, validation, and permission rules.

## Vercel Deployment

1. Import the repository into Vercel.
2. Select the Next.js framework and keep the default pnpm install behavior.
3. Add `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the relevant Vercel environments.
4. Apply migrations from a trusted environment with `pnpm db:migrate` before using the deployment.
5. Run `pnpm db:seed` only for a disposable demo database.
6. Deploy with the existing `pnpm build` command.

No Vercel deployment URL is included because deployment credentials and a target project are not configured in this workspace.

## AI Tools Used

OpenAI Codex was used as an AI-assisted development tool for implementation support, debugging, refactoring suggestions, and iteration.

Architecture, product scope, data-model decisions, validation rules, and final implementation decisions were reviewed and owned by the developer.

## What I Would Improve With More Time

- Threaded messaging and email notifications.
- Audit logs and richer Manager moderation history.
- Stronger end-to-end coverage and pagination for larger datasets.
- Localization and a more advanced recommendation model.
