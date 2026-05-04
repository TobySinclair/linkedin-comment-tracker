import { requireAuth, json, jsonError } from "../_utils.js";

const ALLOWED = new Set(["hr", "compliance", "other"]);

/**
 * POST /api/directory/icp
 * Body: { contact_key, icp_category: "hr"|"compliance"|"other"|"" }
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

  const contactKey =
    body && body.contact_key != null ? String(body.contact_key).trim() : "";
  if (!contactKey) {
    return jsonError(400, "contact_key required");
  }

  const raw =
    body && body.icp_category != null ? String(body.icp_category).trim().toLowerCase() : "";
  let icpVal = null;
  if (raw !== "") {
    if (!ALLOWED.has(raw)) {
      return jsonError(400, "icp_category must be hr, compliance, other, or empty");
    }
    icpVal = raw;
  }

  const now = Math.floor(Date.now() / 1000);
  const r = await ctx.env.DB.prepare(
    "UPDATE directory_contact SET icp_category = ?1, updated_at = ?2 WHERE contact_key = ?3"
  )
    .bind(icpVal, now, contactKey)
    .run();

  if (!r.meta?.changes) {
    return jsonError(404, "Contact not found");
  }

  return json({ ok: true, icp_category: icpVal });
}
