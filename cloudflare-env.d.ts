/// <reference types="@cloudflare/workers-types" />

interface CloudflareEnv {
  DB: D1Database;
  OPENAI_API_KEY?: string;
  OPENAI_LEAD_MODEL?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  RATE_LIMIT_SALT?: string;
  CRON_SECRET?: string;
  DEV_FOUNDER_EMAIL?: string;
}
