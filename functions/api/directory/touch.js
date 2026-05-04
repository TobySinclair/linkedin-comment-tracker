import { requireAuth, json, jsonError } from "../_utils.js";
import { upsertDirectoryTouch } from "../_directory.js";

/**
 * POST /api/directory/touch
 * Body: one touch { name, job_title, linkedin_url, data_id, touched_at, source, icp_category }
 *    or { touches: [ ... ] } (batch, max 500)
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }

  const unauthorized = requireAuth(ctx);
  if (unauthorized) return unauthorized;

  let body;
  try {
    body = await ctx.request.json();
  } catch {
    return jsonError(400, "Invalid JSON");
  }

  let list = [];
  if (body && Array.isArray(body.touches)) {
    list = body.touches;
  } else if (body && (body.name != null || body.linkedin_url != null || body.data_id)) {
    list = [body];
  } else {
    return jsonError(400, "Provide touches array or a single contact object");
  }

  if (list.length > 500) {
    return jsonError(400, "Maximum 500 touches per request");
  }

  for (const t of list) {
    if (!t || typeof t !== "object") continue;
    await upsertDirectoryTouch(ctx.env.DB, {
      name: t.name != null ? String(t.name) : "—",
      job_title: t.job_title != null ? String(t.job_title) : "",
      linkedin_url: t.linkedin_url != null ? String(t.linkedin_url) : "",
      data_id: t.data_id != null ? String(t.data_id) : "",
      touched_at: t.touched_at != null ? Number(t.touched_at) : Math.floor(Date.now() / 1000),
      source: t.source === "inbox" ? "inbox" : "comment",
      icp_category: t.icp_category != null ? t.icp_category : null,
    });
  }

  return json({ ok: true, count: list.length });
}
