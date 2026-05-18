import { requireAuth, json, jsonError } from "../_utils.js";

function todayUK() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
}

function addDaysYMD(ymd, delta) {
  const [y, m, d] = ymd.split("-").map((x) => parseInt(x, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().slice(0, 10);
}

/**
 * GET /api/posts/drafts?days=90
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "GET") {
    return jsonError(405, "Method not allowed");
  }
  const unauthorized = requireAuth(ctx);
  if (unauthorized) return unauthorized;

  const url = new URL(ctx.request.url);
  let days = parseInt(url.searchParams.get("days") || "90", 10);
  if (!Number.isFinite(days) || days < 1) days = 90;
  days = Math.min(days, 365);

  const end = todayUK();
  const start = addDaysYMD(end, -days);

  const { results } = await ctx.env.DB.prepare(
    `SELECT data_id, day, icp, register, one_point, hook_format, score, critique, body, created_at
     FROM linkedin_post_draft
     WHERE day >= ?1 AND day <= ?2
     ORDER BY day DESC, data_id ASC`
  )
    .bind(start, end)
    .all();

  return json({ posts: results || [] });
}
