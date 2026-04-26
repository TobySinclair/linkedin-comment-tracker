/** @returns {Response | null} 401 if unauthorized, null if ok */
export function requireAuth({ request, env }) {
  const key = request.headers.get("X-Tracker-Key");
  const expected = env.TRACKER_KEY;
  if (!expected || key !== expected) {
    return jsonError(401, "Unauthorized");
  }
  return null;
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export function jsonError(status, message) {
  return json({ error: message }, status);
}
