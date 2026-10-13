-- Private preview page per prospect: what we show after they agree to look.
-- A prospect has a page only while preview_token is set.

ALTER TABLE prospects ADD COLUMN preview_findings TEXT; -- JSON: [{ "seen": "...", "check": "..." }], up to 3
ALTER TABLE prospects ADD COLUMN preview_token TEXT;    -- 20 hex characters, the secret part of the link
ALTER TABLE prospects ADD COLUMN preview_views INTEGER NOT NULL DEFAULT 0;
ALTER TABLE prospects ADD COLUMN preview_first_viewed_at TEXT;
ALTER TABLE prospects ADD COLUMN preview_last_viewed_at TEXT;

CREATE UNIQUE INDEX prospects_preview_token_idx ON prospects(preview_token) WHERE preview_token IS NOT NULL;
