import { requireAuth, json, jsonError } from "../_utils.js";

const VALID_STATUS = new Set([
  "todo",
  "done",
  "skip",
  "comment-only",
  "comment-and-connect",
]);
const STORED = new Set(["skip", "comment-only", "comment-and-connect"]);
const AUDIENCE = new Set(["chro", "icp", "influencer"]);

/**
 * PUT /api/statuses/:id
 * DELETE /api/statuses/:id
 */
export async function onRequest(ctx) {
  const unauthorized = requireAuth(ctx);
  if (unauthorized) return unauthorized;

  const raw = ctx.params && ctx.params.id != null ? String(ctx.params.id) : "";
  const id = raw ? decodeURIComponent(raw) : "";
  if (!id) {
    return jsonError(400, "Missing id");
  }

  if (ctx.request.method === "PUT") {
    return handlePut(ctx, id);
  }
  if (ctx.request.method === "DELETE") {
    return handleDelete(ctx, id);
  }
  return jsonError(405, "Method not allowed");
}

async function handlePut(ctx, dataId) {
  let body;
  try {
    body = await ctx.request.json();
  } catch {
    return jsonError(400, "Invalid JSON");
  }

  let status = body && body.status != null ? String(body.status) : "";
  if (!VALID_STATUS.has(status)) {
    return jsonError(400, "status must be todo, done, skip, comment-only, or comment-and-connect");
  }
  if (status === "done") {
    status = "comment-and-connect";
  }
  if (status === "todo" || !STORED.has(status)) {
    if (status === "todo") {
      await ctx.env.DB.prepare("DELETE FROM card_status WHERE data_id = ?1")
        .bind(dataId)
        .run();
      return json({ ok: true });
    }
    return jsonError(400, "Invalid status for upsert");
  }

  let audience = null;
  if (body && body.audience != null && body.audience !== "") {
    const a = String(body.audience);
    if (!AUDIENCE.has(a)) {
      return jsonError(400, "audience must be chro, icp, or influencer");
    }
    audience = a;
  }

  const now = Math.floor(Date.now() / 1000);
  await ctx.env.DB.prepare(
    `INSERT INTO card_status (data_id, status, audience, updated_at)
     VALUES (?1, ?2, ?3, ?4)
     ON CONFLICT (data_id) DO UPDATE SET
       status = excluded.status,
       audience = excluded.audience,
       updated_at = excluded.updated_at`
  )
    .bind(dataId, status, audience, now)
    .run();

  if (status === "comment-only" || status === "comment-and-connect") {
    const dayKey = new Date(now * 1000).toISOString().slice(0, 10);
    await ctx.env.DB.prepare(
      `INSERT INTO engagement_days (day, touch_count) VALUES (?1, 1)
       ON CONFLICT(day) DO UPDATE SET touch_count = touch_count + 1`
    )
      .bind(dayKey)
      .run();
  }

  return json({ ok: true });
}

async function handleDelete(ctx, dataId) {
  await ctx.env.DB.prepare("DELETE FROM card_status WHERE data_id = ?1")
    .bind(dataId)
    .run();
  return json({ ok: true });
}
