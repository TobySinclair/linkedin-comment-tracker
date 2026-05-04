import { json, jsonError } from "../_utils.js";

function rowToApi(row) {
  let participants = [];
  try {
    participants = row.participants_json ? JSON.parse(row.participants_json) : [];
    if (!Array.isArray(participants)) participants = [];
  } catch {
    participants = [];
  }
  const hasMetadata = row.role != null && row.company != null;
  const col =
    row.column !== undefined && row.column !== null
      ? row.column
      : row["column"];
  return {
    thread_id: row.thread_id,
    title: row.title,
    is_group: row.is_group === 1,
    participants,
    role: row.role,
    company: row.company,
    profile_url: row.profile_url,
    presence: row.presence,
    last_message_at: row.last_message_at,
    last_sender: row.last_sender,
    last_message_snippet: row.last_message_snippet,
    column: col,
    notes: row.notes,
    icp_category: row.icp_category || null,
    starred: row.starred === 1,
    has_metadata: hasMetadata,
    first_seen_at: row.first_seen_at,
    last_synced_at: row.last_synced_at,
  };
}

/**
 * GET /api/inbox/list
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "GET") {
    return jsonError(405, "Method not allowed");
  }

  const { results } = await ctx.env.DB.prepare(
    "SELECT thread_id, title, is_group, participants_json, role, company, profile_url, presence, last_message_at, last_sender, last_message_snippet, \"column\", notes, icp_category, starred, first_seen_at, last_synced_at FROM inbox_threads ORDER BY last_message_at DESC, thread_id"
  ).all();

  const threads = (results || []).map(rowToApi);
  return json({ threads });
}
