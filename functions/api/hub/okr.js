import { requireAuth, json, jsonError } from "../_utils.js";

const DOC_ID = "okr";
const MAX_BYTES = 512 * 1024;

function parseBody(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizePayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }
  const kpis = body.kpis && typeof body.kpis === "object" && !Array.isArray(body.kpis) ? body.kpis : {};
  const weekly = Array.isArray(body.weekly) ? body.weekly : [];
  return { kpis, weekly };
}

/**
 * GET /api/hub/okr
 * PUT /api/hub/okr
 */
export async function onRequest(ctx) {
  const unauthorized = requireAuth(ctx);
  if (unauthorized) return unauthorized;

  if (ctx.request.method === "GET") {
    const row = await ctx.env.DB.prepare(
      "SELECT json FROM hub_blob WHERE doc_id = ?1"
    )
      .bind(DOC_ID)
      .first();

    if (!row || !row.json) {
      return json({ kpis: {}, weekly: [] });
    }
    const data = parseBody(row.json);
    const normalized = normalizePayload(data);
    if (!normalized) {
      return json({ kpis: {}, weekly: [] });
    }
    return json(normalized);
  }

  if (ctx.request.method === "PUT") {
    const raw = await ctx.request.text();
    if (raw.length > MAX_BYTES) {
      return jsonError(413, "Payload too large");
    }
    const data = parseBody(raw);
    const normalized = normalizePayload(data);
    if (!normalized) {
      return jsonError(400, "Expected JSON object with kpis and weekly");
    }

    const now = Math.floor(Date.now() / 1000);
    const packed = JSON.stringify(normalized);

    await ctx.env.DB.prepare(
      `INSERT INTO hub_blob (doc_id, json, updated_at)
       VALUES (?1, ?2, ?3)
       ON CONFLICT (doc_id) DO UPDATE SET
         json = excluded.json,
         updated_at = excluded.updated_at`
    )
      .bind(DOC_ID, packed, now)
      .run();

    return json({ ok: true });
  }

  return jsonError(405, "Method not allowed");
}
