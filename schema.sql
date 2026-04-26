-- Card statuses: only non-todo rows are stored (todo = absence of row).
-- Engagement types follow index.html: comment-only, comment-and-connect, skip.
CREATE TABLE IF NOT EXISTS card_status (
  data_id    TEXT PRIMARY KEY,
  status     TEXT NOT NULL CHECK (status IN ('skip', 'comment-only', 'comment-and-connect')),
  audience   TEXT CHECK (audience IS NULL OR audience IN ('chro', 'icp', 'influencer')),
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_card_status_audience ON card_status (audience);
