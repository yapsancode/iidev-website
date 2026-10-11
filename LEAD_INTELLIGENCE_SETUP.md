# Cloudflare Lead Intelligence — beginner setup

The code is ready, but Cloudflare needs a database and login rule before real leads appear.

## What each product does

- **Workers** runs the website and API.
- **D1** stores leads, notes, scores, and audit events.
- **Access** lets only the two founders into `/internal`.
- OpenAI creates the internal summary; Telegram sends the alert.

## 1. Create D1

```bash
npx wrangler login
npx wrangler d1 create iidev-leads
```

Copy the returned `database_id` into `wrangler.jsonc`, replacing the all-zero value. Then run:

```bash
npm run db:migrate:remote
```

Put the same ID in `wrangler.retention.jsonc`.

## 2. Add both founders

Open `scripts/seed-founders.sql.example`, replace both emails and names, then run its SQL in Cloudflare Dashboard → D1 → iidev-leads → Console.

## 3. Protect the dashboard

In Cloudflare Zero Trust:

1. Go to Access → Applications → Add self-hosted application.
2. Protect `www.iidevstudio.com/internal/*`.
3. Add an **Allow** policy containing exactly the two founder emails.
4. Use One-time PIN if you do not have Google Workspace.

Cloudflare now performs the founder login. There is no Supabase Auth or shared password.

## 4. Add secrets

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put RATE_LIMIT_SALT
npx wrangler secret put CRON_SECRET
```

## 5. Local testing

Create `.env.local`, copy `.env.example`, and make `DEV_FOUNDER_EMAIL` match a founder inserted into the local D1 database.

```bash
npm run db:migrate:local
npm run dev
```

Open `http://localhost:3000/internal`.

## 6. Deploy

```bash
npm run deploy:cf
npm run deploy:retention
```

Connect `www.iidevstudio.com` as the Worker's custom domain. Keep the `workers.dev` URL disabled so the Access rule cannot be bypassed.

The small retention Worker runs daily at 03:00 UTC to enforce the 12/24-month data rules.

## First live test

1. Submit a test enquiry from the booking modal.
2. Confirm WhatsApp opens after D1 accepts it.
3. Sign in at `/internal` with a founder email.
4. Confirm the lead, score, AI summary, and Telegram alert appear.
5. Try a non-founder email and confirm Cloudflare Access blocks it.

## Outbound prospects (added October 2026)

The internal area also tracks businesses we contact first, at `/internal/prospects`. Claude Code reads and updates them through `/api/internal/prospects`, which needs its own secret.

Deploy in this order. The pages read the new tables, so the migration must run before the new code goes live.

```bash
npm run db:migrate:remote
npx wrangler secret put SALES_API_TOKEN
npm run deploy:cf
npm run deploy:retention
```

Use at least 32 random characters for `SALES_API_TOKEN`. Put the same value, plus `SALES_API_URL=https://www.iidevstudio.com`, in the `.env` file of the IIDEV Studio folder so the sales skills can reach the API. Without the secret the API answers 401 to everyone.

Prospects marked Lost or Not fit are deleted after 12 months with no activity, the same rule as leads.
