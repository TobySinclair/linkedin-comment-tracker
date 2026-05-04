import { requireAuth, json, jsonError } from "../_utils.js";

function startOfIsoWeekUtcSeconds(nowSec) {
  const d = new Date(nowSec * 1000);
  const dow = d.getUTCDay();
  const daysFromMonday = (dow + 6) % 7;
  d.setUTCDate(d.getUTCDate() - daysFromMonday);
  d.setUTCHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
}

function parseYmdUtc(ymd) {
  const p = String(ymd).split("-");
  if (p.length !== 3) return NaN;
  return Date.UTC(+p[0], +p[1] - 1, +p[2]);
}

/**
 * Consecutive UTC days with activity, ending at last mark, if last mark is today or yesterday.
 */
function streakFromDaySet(daySet) {
  if (!daySet.size) return 0;
  const sorted = Array.from(daySet).sort();
  const last = sorted[sorted.length - 1];
  const today = new Date();
  const todayYmd = today.toISOString().slice(0, 10);
  const lastMs = parseYmdUtc(last);
  const todayMs = parseYmdUtc(todayYmd);
  if (Number.isNaN(lastMs) || Number.isNaN(todayMs)) return 0;
  const gapDays = (todayMs - lastMs) / 86400000;
  if (gapDays > 1) return 0;

  let streak = 0;
  const cur = new Date(lastMs);
  for (;;) {
    const key = cur.toISOString().slice(0, 10);
    if (!daySet.has(key)) break;
    streak++;
    cur.setUTCDate(cur.getUTCDate() - 1);
  }
  return streak;
}

/**
 * GET /api/stats
 * week: Comment / +Connect rows updated since Mon 00:00 UTC
 * days30: same, rolling last 30×24h from now
 * streak: consecutive UTC days in engagement_days (today or yesterday must be covered by latest mark)
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "GET") {
    return jsonError(405, "Method not allowed");
  }

  const unauthorized = requireAuth(ctx);
  if (unauthorized) return unauthorized;

  const now = Math.floor(Date.now() / 1000);
  const weekStart = startOfIsoWeekUtcSeconds(now);
  const sec30 = now - 30 * 86400;

  const weekRow = await ctx.env.DB.prepare(
    `SELECT COUNT(*) AS c FROM card_status
     WHERE status IN ('comment-only', 'comment-and-connect') AND updated_at >= ?1`
  )
    .bind(weekStart)
    .first();

  const d30Row = await ctx.env.DB.prepare(
    `SELECT COUNT(*) AS c FROM card_status
     WHERE status IN ('comment-only', 'comment-and-connect') AND updated_at >= ?1`
  )
    .bind(sec30)
    .first();

  const { results } = await ctx.env.DB.prepare(
    "SELECT day FROM engagement_days"
  ).all();

  const days = new Set();
  for (const row of results || []) {
    if (row.day) days.add(String(row.day));
  }

  const streak = streakFromDaySet(days);

  return json({
    week: Number(weekRow && weekRow.c) || 0,
    days30: Number(d30Row && d30Row.c) || 0,
    streak,
  });
}
