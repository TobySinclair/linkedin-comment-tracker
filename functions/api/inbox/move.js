import { json, jsonError } from "../_utils.js";

const COLUMNS = new Set(["new", "my_move", "their_move", "booked", "archive"]);

/**
 * POST /api/inbox/move
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
  const column = body && body.column != null ? String(body.column) : "";
  if (!threadId) {
    return jsonError(400, "thread_id required");
  }
  if (!COLUMNS.has(column)) {
    return json({ error: "invalid column" }, 400);
  }

  await ctx.env.DB.prepare(
    "UPDATE inbox_threads SET \"column\" = ?1 WHERE thread_id = ?2"
  )
    .bind(column, threadId)
    .run();

  return json({ ok: true });
}
