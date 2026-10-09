-- Outbound prospects: public business listings we plan to contact.
-- Kept apart from `leads`, which holds consented inbound enquiries.

CREATE TABLE prospects (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL CHECK (length(business_name) BETWEEN 1 AND 160),
  category TEXT NOT NULL DEFAULT 'Other',
  area TEXT,
  phone TEXT,
  whatsapp TEXT, -- E.164 mobile number, NULL for landlines
  google_reviews INTEGER CHECK (google_reviews IS NULL OR google_reviews >= 0),
  priority TEXT NOT NULL DEFAULT 'B' CHECK (priority IN ('A','B')),
  status TEXT NOT NULL DEFAULT 'not_contacted' CHECK (status IN (
    'not_contacted','messaged','replied','audit_booked','audit_done','proposal','won','lost','not_fit'
  )),
  website TEXT,
  website_state TEXT CHECK (website_state IS NULL OR website_state IN ('none','weak','ok')),
  mobile_score INTEGER CHECK (mobile_score IS NULL OR mobile_score BETWEEN 0 AND 100),
  has_gbp INTEGER CHECK (has_gbp IS NULL OR has_gbp IN (0,1)),
  top_finding TEXT,
  suggested_angle TEXT,
  findings TEXT,
  draft_first TEXT,
  draft_followup TEXT,
  draft_language TEXT CHECK (draft_language IS NULL OR draft_language IN ('ms','en')),
  audit_date TEXT,      -- YYYY-MM-DD, Malaysia time
  last_contact TEXT,    -- YYYY-MM-DD, Malaysia time
  next_follow_up TEXT,  -- YYYY-MM-DD, Malaysia time
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_activity_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- One row per business + phone, so a repeated import updates instead of duplicating.
CREATE UNIQUE INDEX prospects_identity_idx ON prospects(lower(business_name), ifnull(phone,''));
CREATE INDEX prospects_status_idx ON prospects(status, priority);
CREATE INDEX prospects_follow_up_idx ON prospects(next_follow_up);

CREATE TABLE prospect_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prospect_id TEXT NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  actor TEXT NOT NULL, -- internal_users.id, or 'claude' for the sales API
  event_type TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX prospect_events_prospect_idx ON prospect_events(prospect_id, created_at DESC);
CREATE INDEX prospect_events_type_idx ON prospect_events(event_type, created_at);
