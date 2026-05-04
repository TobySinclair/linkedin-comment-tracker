import { json, jsonError } from "../_utils.js";

/**
 * POST /api/inbox/notes
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }

  let body;
  try {
    body = await ctx.request.json();
  } catch {
    return jsonError(400, "Invalid JSON");
  }

  const threadId = body && body.thread_id != null ? String(body.thread_id) : "";
  if (!threadId) {
    return jsonError(400, "thread_id required");
  }

  const notes = body && body.notes != null ? String(body.notes) : "";

  await ctx.env.DB.prepare(
    "UPDATE inbox_threads SET notes = ?1 WHERE thread_id = ?2"
  )
    .bind(notes, threadId)
    .run();

  return json({ ok: true });
}
