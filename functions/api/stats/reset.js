import { requireAuth, json, jsonError } from "../_utils.js";

/**
 * POST /api/stats/reset
 * Clears UTC day log used for streaks (used after “Reset all” on the queue).
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }

  const unauthorized = requireAuth(ctx);
  if (unauthorized) return unauthorized;

  await ctx.env.DB.prepare("DELETE FROM engagement_days").run();
  return json({ ok: true });
}
