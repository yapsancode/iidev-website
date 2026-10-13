-- Measuring what works: why a prospect was lost, which message version they got,
-- and the main objection heard in their reply.

ALTER TABLE prospects ADD COLUMN lost_reason TEXT;     -- see lostReasons in src/lib/prospects/types.ts
ALTER TABLE prospects ADD COLUMN message_variant TEXT; -- short label of the first-message version, for example "v2-no-price"
ALTER TABLE prospects ADD COLUMN objection TEXT;       -- see objections in src/lib/prospects/types.ts

CREATE INDEX prospects_lost_reason_idx ON prospects(lost_reason);
