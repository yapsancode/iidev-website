PRAGMA foreign_keys = ON;

CREATE TABLE internal_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'founder' CHECK (role IN ('founder','admin')),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_activity_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  full_name TEXT NOT NULL, business_name TEXT, whatsapp TEXT NOT NULL, email TEXT,
  budget TEXT, timeline TEXT, raw_enquiry TEXT NOT NULL, service_context TEXT,
  source_page TEXT, referrer TEXT, utm TEXT NOT NULL DEFAULT '{}', consent_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', processing_status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'needs_review', lead_score INTEGER,
  score_breakdown TEXT, ai_extraction TEXT, ai_confidence REAL, ai_model TEXT,
  ai_prompt_version TEXT, ai_input_tokens INTEGER, ai_output_tokens INTEGER,
  ai_latency_ms INTEGER, ai_error TEXT, processing_attempts INTEGER NOT NULL DEFAULT 0,
  telegram_status TEXT NOT NULL DEFAULT 'pending', telegram_sent_at TEXT, telegram_error TEXT,
  owner_id TEXT REFERENCES internal_users(id) ON DELETE SET NULL,
  retention_review_due INTEGER NOT NULL DEFAULT 0 CHECK (retention_review_due IN (0,1)),
  CHECK (lead_score IS NULL OR lead_score BETWEEN 0 AND 100)
);
CREATE INDEX leads_active_priority_idx ON leads(status,priority,created_at DESC);
CREATE INDEX leads_processing_idx ON leads(processing_status,created_at);
CREATE INDEX leads_owner_idx ON leads(owner_id,status);

CREATE TABLE lead_notes (
  id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES internal_users(id) ON DELETE RESTRICT,
  body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 4000),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE lead_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  actor_id TEXT REFERENCES internal_users(id) ON DELETE SET NULL, event_type TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX lead_events_lead_created_idx ON lead_events(lead_id,created_at DESC);
CREATE TABLE lead_rate_limits (ip_hash TEXT PRIMARY KEY, window_started_at TEXT NOT NULL, request_count INTEGER NOT NULL DEFAULT 1);
