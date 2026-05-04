/** @param {{ linkedinUrl?: string, name?: string, dataId?: string }} parts */
export function normalizeContactKey(parts) {
  const u = normalizeLinkedinUrlForDedup(parts.linkedinUrl);
  if (u) return "url:" + u;
  const n = String(parts.name || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  if (n && n !== "—") return "name:" + n;
  if (parts.dataId) return "id:" + String(parts.dataId);
  return null;
}

function normalizeLinkedinUrlForDedup(href) {
  if (!href || typeof href !== "string") return "";
  try {
    const u = new URL(href.trim());
    if (!u.hostname.includes("linkedin.com")) {
      return u.href.split("#")[0].toLowerCase();
    }
    let p = u.pathname || "";
    if (/\/in\/[^/]+\/?$/i.test(p) || /^\/in\/[^/]+/i.test(p)) {
      return (u.origin + p.replace(/\/$/, "")).toLowerCase();
    }
    return u.href.split("#")[0].toLowerCase();
  } catch {
    return String(href).toLowerCase();
  }
}

export function lastMessageDateToUnix(iso) {
  if (!iso || typeof iso !== "string") return null;
  const dayStr = iso.length >= 10 ? iso.slice(0, 10) : iso;
  const parts = dayStr.split("-");
  if (parts.length !== 3) return null;
  const y = Number(parts[0]);
  const mo = Number(parts[1]) - 1;
  const d = Number(parts[2]);
  if (Number.isNaN(y) || Number.isNaN(mo) || Number.isNaN(d)) return null;
  const ms = Date.UTC(y, mo, d, 12, 0, 0);
  return Math.floor(ms / 1000);
}

const ICP = new Set(["hr", "compliance", "other"]);

/**
 * Upsert one directory row from a comment card or inbox thread.
 * @param {*} db
 * @param {{
 *   name: string,
 *   job_title?: string,
 *   linkedin_url?: string,
 *   data_id?: string,
 *   touched_at: number,
 *   source: "comment" | "inbox",
 *   icp_category?: string | null
 * }} t
 */
export async function upsertDirectoryTouch(db, t) {
  const key = normalizeContactKey({
    linkedinUrl: t.linkedin_url,
    name: t.name,
    dataId: t.data_id,
  });
  if (!key) return;

  const touchedAt = Number(t.touched_at);
  const ts = Number.isFinite(touchedAt) ? touchedAt : Math.floor(Date.now() / 1000);
  const source = t.source === "inbox" ? "inbox" : "comment";

  const name = String(t.name || "").trim() || "—";
  const jobTitle = String(t.job_title || "").trim();
  const linkedinUrl = String(t.linkedin_url || "").trim();
  const rawIcp = t.icp_category != null ? String(t.icp_category).trim().toLowerCase() : "";
  const inboxIcp = ICP.has(rawIcp) ? rawIcp : null;

  const existing = await db
    .prepare(
      "SELECT name, job_title, linkedin_url, icp_category, last_interaction_at, last_interaction_source FROM directory_contact WHERE contact_key = ?1"
    )
    .bind(key)
    .first();

  let mergedName = name;
  let mergedJob = jobTitle;
  let mergedUrl = linkedinUrl;
  let mergedIcp = inboxIcp;
  let mergedLast = ts;
  let mergedSrc = source;
  const now = Math.floor(Date.now() / 1000);

  if (existing) {
    mergedName =
      name.length && name !== "—" ? name : (existing.name != null ? String(existing.name) : "—");
    mergedJob = jobTitle.length
      ? jobTitle
      : existing.job_title != null
        ? String(existing.job_title)
        : "";
    mergedUrl = linkedinUrl.length
      ? linkedinUrl
      : existing.linkedin_url != null
        ? String(existing.linkedin_url)
        : "";

    const exIcp = existing.icp_category != null ? String(existing.icp_category).trim() : "";
    const hasManualIcp = exIcp.length > 0;
    mergedIcp = hasManualIcp ? exIcp : inboxIcp || exIcp || null;

    const exLast = Number(existing.last_interaction_at) || 0;
    const exSrc = existing.last_interaction_source != null ? String(existing.last_interaction_source) : "";

    if (ts > exLast) {
      mergedLast = ts;
      mergedSrc = source;
    } else if (ts === exLast && exSrc && exSrc !== source) {
      mergedLast = ts;
      mergedSrc = "both";
    } else {
      mergedLast = exLast;
      mergedSrc = exSrc || source;
    }
  }

  await db
    .prepare(
      `INSERT INTO directory_contact (
        contact_key, name, job_title, linkedin_url, icp_category,
        last_interaction_at, last_interaction_source, updated_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
      ON CONFLICT(contact_key) DO UPDATE SET
        name = excluded.name,
        job_title = excluded.job_title,
        linkedin_url = excluded.linkedin_url,
        icp_category = excluded.icp_category,
        last_interaction_at = excluded.last_interaction_at,
        last_interaction_source = excluded.last_interaction_source,
        updated_at = excluded.updated_at`
    )
    .bind(
      key,
      mergedName,
      mergedJob || null,
      mergedUrl || null,
      mergedIcp,
      mergedLast,
      mergedSrc,
      now
    )
    .run();
}

/**
 * Full refresh from inbox_threads (all rows, including unstarred).
 */
export async function reconcileInboxThreads(db) {
  const { results } = await db
    .prepare(
      "SELECT title, role, company, profile_url, last_message_at, icp_category FROM inbox_threads"
    )
    .all();

  const fallbackTs = Math.floor(Date.now() / 1000);
  for (const row of results || []) {
    const title = row.title != null ? String(row.title) : "";
    const role = row.role != null ? String(row.role) : "";
    const company = row.company != null ? String(row.company) : "";
    const jobTitle = [role, company].filter(Boolean).join(" · ");
    const profileUrl = row.profile_url != null ? String(row.profile_url) : "";
    const tUnix = lastMessageDateToUnix(row.last_message_at) || fallbackTs;

    await upsertDirectoryTouch(db, {
      name: title || "—",
      job_title: jobTitle,
      linkedin_url: profileUrl,
      data_id: "",
      touched_at: tUnix,
      source: "inbox",
      icp_category: row.icp_category,
    });
  }
}
