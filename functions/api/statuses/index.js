import { requireAuth, json, jsonError } from "../_utils.js";

const STORED = new Set(["skip", "comment-only", "comment-and-connect"]);

/**
 * GET /api/statuses
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "GET") {
    return jsonError(405, "Method not allowed");
  }

  const unauthorized = requireAuth(ctx);
  if (unauthorized) return unauthorized;

  const { results } = await ctx.env.DB.prepare(
    "SELECT data_id, status, updated_at FROM card_status"
  ).all();

  const out = {};
  for (const row of results || []) {
    if (row.data_id && STORED.has(row.status)) {
      out[row.data_id] = {
        status: row.status,
        updated_at: Number(row.updated_at) || 0,
      };
    }
  }
  return json(out);
}
