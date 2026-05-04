import { requireAuth, json, jsonError } from "../_utils.js";

/**
 * GET /api/directory
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "GET") {
    return jsonError(405, "Method not allowed");
  }

  const unauthorized = requireAuth(ctx);
  if (unauthorized) return unauthorized;

  const { results } = await ctx.env.DB.prepare(
    `SELECT contact_key, name, job_title, linkedin_url, icp_category,
            last_interaction_at, last_interaction_source
     FROM directory_contact
     ORDER BY last_interaction_at DESC, name ASC`
  ).all();

  return json({ contacts: results || [] });
}
