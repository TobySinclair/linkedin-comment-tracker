import { requireAuth, json, jsonError } from "../_utils.js";
import { reconcileInboxThreads } from "../_directory.js";

/**
 * POST /api/directory/reconcile-inbox
 * Rebuilds directory rows from inbox_threads (no extension sync required).
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }

  const unauthorized = requireAuth(ctx);
  if (unauthorized) return unauthorized;

  try {
    await reconcileInboxThreads(ctx.env.DB);
  } catch (e) {
    const msg = e && e.message ? String(e.message) : "reconcile failed";
    console.error("[directory/reconcile-inbox]", msg);
    return jsonError(500, msg);
  }

  return json({ ok: true });
}
