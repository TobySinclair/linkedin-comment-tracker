import { json, jsonError } from "../_utils.js";
import { reconcileInboxThreads } from "../_directory.js";

function unauthorized() {
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function normStr(v) {
  if (v == null) return null;
  const s = String(v);
  return s === "" ? null : s;
}

function boolToInt(b) {
  return b === true || b === 1 ? 1 : 0;
}

function defaultColumnForSender(lastSender) {
  return String(lastSender) === "them" ? "my_move" : "their_move";
}

/**
 * POST /api/inbox/sync
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }

  const token =
    ctx.request.headers.get("X-Sync-Token") ||
    ctx.request.headers.get("X-Tracker-Key");
  const expected = ctx.env.INBOX_SYNC_TOKEN || ctx.env.TRACKER_KEY;
  if (!expected || token !== expected) {
    return unauthorized();
  }

  let body;
  try {
    body = await ctx.request.json();
  } catch {
    return jsonError(400, "Invalid JSON");
  }

  const syncedAt =
    body && body.synced_at != null ? String(body.synced_at) : "";
  if (!syncedAt) {
    return jsonError(400, "synced_at required");
  }

  const threadsRaw = Array.isArray(body.threads) ? body.threads : [];
  const byId = new Map();
  for (const t of threadsRaw) {
    if (t && t.thread_id != null) {
      byId.set(String(t.thread_id), t);
    }
  }
  const threads = [...byId.values()];
  const incomingIds = new Set(byId.keys());

  let inserted = 0;
  let updated = 0;
  let untouched = 0;

  for (const t of threads) {
    const threadId = String(t.thread_id);

    const title = t.title != null ? String(t.title) : "";
    const isGroup = boolToInt(t.is_group);
    const participantsJson = JSON.stringify(
      Array.isArray(t.participants) ? t.participants : []
    );
    const incomingRole = normStr(t.role);
    const incomingCompany = normStr(t.company);
    const incomingProfileUrl = normStr(t.profile_url);
    const presence = normStr(t.presence);
    const lastMessageAt = normStr(t.last_message_at);
    const lastSender = normStr(t.last_sender) || "them";
    const snippet = normStr(t.last_message_snippet);
    const starredInt = boolToInt(t.starred);

    const existing = await ctx.env.DB.prepare(
      "SELECT thread_id, title, is_group, participants_json, role, company, profile_url, presence, last_message_at, last_sender, last_message_snippet, starred FROM inbox_threads WHERE thread_id = ?1"
    )
      .bind(threadId)
      .first();

    if (!existing) {
      const col = defaultColumnForSender(lastSender);
      await ctx.env.DB.prepare(
        `INSERT INTO inbox_threads (
          thread_id, title, is_group, participants_json, role, company, profile_url,
          presence, last_message_at, last_sender, last_message_snippet,
          "column", notes, starred, first_seen_at, last_synced_at, icp_category
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, NULL, ?13, ?14, ?15, NULL)`
      )
        .bind(
          threadId,
          title,
          isGroup,
          participantsJson,
          incomingRole,
          incomingCompany,
          incomingProfileUrl,
          presence,
          lastMessageAt,
          lastSender,
          snippet,
          col,
          starredInt,
          syncedAt,
          syncedAt
        )
        .run();
      inserted++;
      continue;
    }

    const mergedRole = incomingRole != null ? incomingRole : existing.role;
    const mergedCompany =
      incomingCompany != null ? incomingCompany : existing.company;
    const mergedProfile =
      incomingProfileUrl != null ? incomingProfileUrl : existing.profile_url;

    const exStar = existing.starred === 1 ? 1 : 0;
    const same =
      normStr(existing.presence) === presence &&
      normStr(existing.last_message_at) === lastMessageAt &&
      normStr(existing.last_sender) === lastSender &&
      normStr(existing.last_message_snippet) === snippet &&
      exStar === starredInt &&
      normStr(existing.role) === normStr(mergedRole) &&
      normStr(existing.company) === normStr(mergedCompany) &&
      normStr(existing.profile_url) === normStr(mergedProfile);

    if (same) {
      untouched++;
      continue;
    }

    await ctx.env.DB.prepare(
      `UPDATE inbox_threads SET
        presence = ?1,
        last_message_at = ?2,
        last_sender = ?3,
        last_message_snippet = ?4,
        starred = ?5,
        last_synced_at = ?6,
        role = ?7,
        company = ?8,
        profile_url = ?9
      WHERE thread_id = ?10`
    )
      .bind(
        presence,
        lastMessageAt,
        lastSender,
        snippet,
        starredInt,
        syncedAt,
        mergedRole,
        mergedCompany,
        mergedProfile,
        threadId
      )
      .run();
    updated++;
  }

  let markedUnstarred = 0;
  if (incomingIds.size === 0) {
    const r = await ctx.env.DB.prepare(
      "UPDATE inbox_threads SET starred = 0 WHERE starred = 1"
    ).run();
    markedUnstarred = r.meta?.changes ?? 0;
  } else {
    const ids = [...incomingIds];
    const ph = ids.map(() => "?").join(", ");
    const r = await ctx.env.DB.prepare(
      `UPDATE inbox_threads SET starred = 0 WHERE starred = 1 AND thread_id NOT IN (${ph})`
    )
      .bind(...ids)
      .run();
    markedUnstarred = r.meta?.changes ?? 0;
  }

  try {
    await reconcileInboxThreads(ctx.env.DB);
  } catch (e) {
    console.warn("[inbox/sync] directory reconcile:", e && e.message ? e.message : e);
  }

  return json({
    inserted,
    updated,
    untouched,
    marked_unstarred: markedUnstarred,
  });
}
