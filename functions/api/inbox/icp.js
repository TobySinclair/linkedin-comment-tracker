import { json, jsonError } from "../_utils.js";

const ALLOWED = new Set(["hr", "compliance", "other"]);

/**
 * POST /api/inbox/icp
 * Body: { thread_id, icp_category: "hr" | "compliance" | "other" | "" to clear }
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

  const raw =
    body && body.icp_category != null ? String(body.icp_category).trim().toLowerCase() : "";
  if (raw === "") {
    await ctx.env.DB.prepare(
      "UPDATE inbox_threads SET icp_category = NULL WHERE thread_id = ?1"
    )
      .bind(threadId)
      .run();
    return json({ ok: true, icp_category: null });
  }

  if (!ALLOWED.has(raw)) {
    return jsonError(400, "icp_category must be hr, compliance, or other");
  }

  await ctx.env.DB.prepare(
    "UPDATE inbox_threads SET icp_category = ?1 WHERE thread_id = ?2"
  )
    .bind(raw, threadId)
    .run();

  return json({ ok: true, icp_category: raw });
}
