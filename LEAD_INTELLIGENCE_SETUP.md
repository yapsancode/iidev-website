# Cloudflare Lead Intelligence — beginner setup

The code is ready, but Cloudflare needs a database and login rule before real leads appear.

## What each product does

- **Workers** runs the website and API.
- **D1** stores leads, notes, scores, and audit events.
- **Access** lets only the two founders into `/internal`.
- **Telegram** sends an alert the moment an enquiry arrives, with the enquiry as the visitor wrote it.
- **Claude** writes the summary, only when a founder asks for it in the Claude app. There is no AI key on the website. See "Claude connector" at the end.

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
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put RATE_LIMIT_SALT
npx wrangler secret put CRON_SECRET
```

## 5. Local testing

Create `.env.development.local` (never `.env.local`, which would also be read by the live build), copy `.env.example`, and make `DEV_FOUNDER_EMAIL` match a founder inserted into the local D1 database.

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
4. Confirm the lead and the Telegram alert appear. The lead shows "Not summarised yet".
5. In Claude, ask "summarise the new enquiries" and approve the save. Confirm the summary and score appear on the lead.
6. Try a non-founder email and confirm Cloudflare Access blocks it.

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

## Claude connector (added October 2026)

A founder can open Claude (web, desktop or phone) and ask "what is due today?" or "summarise the new enquiries". Claude reaches the data through a small, separate Worker called `iidev-claude-connector` at `https://mcp.iidevstudio.com/mcp`. It uses the same D1 database as the website.

How sign-in works:

1. Claude asks the connector for data. With no sign-in, the connector answers 401 and tells Claude where to sign in.
2. Claude opens `https://mcp.iidevstudio.com/authorize` in the browser. Cloudflare Access guards this one page, so the founder signs in the same way as for `/internal`.
3. The connector checks the signed Access token, then checks that the email is an active row in `internal_users`. Only then does it show the "Allow" page.
4. After "Allow", Claude gets a token. On every call the connector checks the founder list again, so switching a founder off in the database locks them out at once.

Only `/authorize` is behind Access. Never put Access on `/mcp`, `/oauth/*` or `/.well-known/*`: Claude's servers call those and cannot pass a login page.

### First-time setup

Run these in the `iidev-website` folder.

1. Create the storage for sign-ins, then copy the printed `id` into `wrangler.connector.jsonc`, replacing `REPLACE_WITH_KV_NAMESPACE_ID`:

```bash
npx wrangler kv namespace create OAUTH_KV --config wrangler.connector.jsonc
```

2. In Cloudflare Zero Trust, go to **Access controls**, then **Applications**, and open **iidev Internal**. Add a second public hostname: subdomain `mcp`, domain `iidevstudio.com`, path `authorize`. Save. The connector now shares the founders policy and the same Application Audience (AUD) tag as `/internal`.

3. Give the connector the same two Access values the website uses:

```bash
npx wrangler secret put CF_ACCESS_TEAM_DOMAIN --config wrangler.connector.jsonc
```

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.connector.jsonc
```

4. Deploy. The first deploy also creates the DNS name `mcp.iidevstudio.com`:

```bash
npm run deploy:connector
```

5. In Claude, open **Settings**, then **Connectors**, then **Add custom connector**. Name: `IIDev Studio`. URL: `https://mcp.iidevstudio.com/mcp`. Click **Connect** and sign in.

6. In the connector's tool list in Claude, leave read tools on "Always allow" and set every tool that changes data to "Ask every time". Enquiry text is written by strangers, so a change must always be approved by a person.

Without the two Access secrets the sign-in page refuses everyone. That is on purpose.

### Local testing

```bash
npm run dev:connector
```

```bash
node scripts/connector-smoke.mjs
```

The first command runs the connector on this computer with the local database (`wrangler.connector.dev.jsonc`). It skips the Access login and signs in as `DEV_FOUNDER_EMAIL`, which only works on a localhost address. The second command walks the whole Claude sign-in and calls one tool.
