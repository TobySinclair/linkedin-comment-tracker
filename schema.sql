-- Legacy DBs missing inbox_threads.icp_category (add once; skip if duplicate column error):
--   npx wrangler d1 execute linkedin-tracker --local  --command="ALTER TABLE inbox_threads ADD COLUMN icp_category TEXT;"
--   npx wrangler d1 execute linkedin-tracker --remote --command="ALTER TABLE inbox_threads ADD COLUMN icp_category TEXT;"

-- Card statuses: only non-todo rows are stored (todo = absence of row).
-- Engagement types follow index.html: comment-only, comment-and-connect, skip.
CREATE TABLE IF NOT EXISTS card_status (
  data_id    TEXT PRIMARY KEY,
  status     TEXT NOT NULL CHECK (status IN ('skip', 'comment-only', 'comment-and-connect')),
  audience   TEXT CHECK (audience IS NULL OR audience IN ('chro', 'icp', 'influencer')),
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_card_status_audience ON card_status (audience);

-- One row per UTC calendar day the user saved a Comment / +Connect mark (streak + backfill).
CREATE TABLE IF NOT EXISTS engagement_days (
  day          TEXT PRIMARY KEY,
  touch_count  INTEGER NOT NULL DEFAULT 1
);

INSERT INTO engagement_days (day, touch_count)
SELECT strftime('%Y-%m-%d', updated_at, 'unixepoch', 'utc'), COUNT(*)
FROM card_status
WHERE status IN ('comment-only', 'comment-and-connect')
GROUP BY 1
ON CONFLICT(day) DO UPDATE SET touch_count = excluded.touch_count;

-- Single-row JSON documents for the ops hub (OKRs, KPIs, weekly check-ins).
CREATE TABLE IF NOT EXISTS hub_blob (
  doc_id     TEXT PRIMARY KEY,
  json       TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS inbox_threads (
  thread_id              TEXT PRIMARY KEY,
  title                  TEXT NOT NULL,
  is_group               INTEGER NOT NULL DEFAULT 0,
  participants_json      TEXT,
  role                   TEXT,
  company                TEXT,
  profile_url            TEXT,
  presence               TEXT,
  last_message_at        TEXT,
  last_sender            TEXT,
  last_message_snippet   TEXT,
  column                 TEXT NOT NULL DEFAULT 'new',
  notes                  TEXT,
  icp_category           TEXT,
  starred                INTEGER NOT NULL DEFAULT 1,
  first_seen_at          TEXT NOT NULL,
  last_synced_at         TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inbox_column ON inbox_threads(column);
CREATE INDEX IF NOT EXISTS idx_inbox_starred ON inbox_threads(starred);
CREATE INDEX IF NOT EXISTS idx_inbox_last_message ON inbox_threads(last_message_at DESC);

-- Contacts directory (merged from comment touches + inbox threads).
CREATE TABLE IF NOT EXISTS directory_contact (
  contact_key              TEXT PRIMARY KEY,
  name                     TEXT NOT NULL,
  job_title                TEXT,
  linkedin_url             TEXT,
  icp_category             TEXT,
  last_interaction_at      INTEGER NOT NULL,
  last_interaction_source  TEXT,
  updated_at               INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_directory_last ON directory_contact (last_interaction_at DESC);