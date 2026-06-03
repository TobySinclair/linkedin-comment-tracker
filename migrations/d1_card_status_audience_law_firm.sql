-- Add law-firm to card_status.audience CHECK (SQLite cannot relax CHECK in place).
CREATE TABLE card_status_new (
  data_id    TEXT PRIMARY KEY,
  status     TEXT NOT NULL CHECK (status IN ('skip', 'comment-only', 'comment-and-connect')),
  audience   TEXT CHECK (audience IS NULL OR audience IN ('chro', 'icp', 'compliance', 'influencer', 'watchlist', 'law-firm')),
  updated_at INTEGER NOT NULL
);

INSERT INTO card_status_new SELECT * FROM card_status;
DROP TABLE card_status;
ALTER TABLE card_status_new RENAME TO card_status;
CREATE INDEX IF NOT EXISTS idx_card_status_audience ON card_status (audience);
