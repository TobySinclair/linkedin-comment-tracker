import { requireAuth, json, jsonError } from "../_utils.js";
import {
  SYSTEM_PROMPT,
  USER_MESSAGE_VOICE_RIDER,
} from "./autopilot-prompt.js";

/** Not configurable via env — change here when upgrading models. */
const OPENAI_CHAT_MODEL = "gpt-5.5";
const OPENAI_CHAT_TEMPERATURE = 0.8;

const ICPS = new Set(["compliance", "hr-risk", "l-and-d"]);
const REGISTERS = new Set(["A", "B", "C"]);
const ICPS_ROTATE = ["compliance", "hr-risk", "l-and-d"];

const DAILY_MIX_SLOTS = [
  { register: "A", icp: "compliance" },
  { register: "A", icp: "hr-risk" },
  { register: "A", icp: "l-and-d" },
  { register: "B", icp: "compliance" },
  { register: "B", icp: "hr-risk" },
  { register: "B", icp: "l-and-d" },
  {
    register: "C",
    icp: "compliance",
    hookHint: "the flag",
  },
  {
    register: "C",
    icp: "hr-risk",
    hookHint: "the line in the sand",
  },
  {
    register: "C",
    icp: "l-and-d",
    hookHint: "the we-vs-them",
  },
];

const C_HOOK_FORMATS = [
  "the flag",
  "the line in the sand",
  "the we-vs-them",
  "the belief",
  "the origin",
  "the reframe",
];

function todayUK() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
}

function sanitizeSlug(s) {
  const t = String(s || "draft")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return (t || "draft").slice(0, 48);
}

function clampScore(n) {
  const x = parseInt(n, 10);
  if (Number.isNaN(x)) return 6;
  return Math.min(10, Math.max(0, x));
}

function resolveIcp(filter, index) {
  if (filter && filter !== "all") return filter;
  return ICPS_ROTATE[index % 3];
}

function buildSlots(mode, countRaw, icpFilter) {
  if (mode === "daily-mix") {
    return DAILY_MIX_SLOTS.map((s) => ({ ...s }));
  }
  const n = Math.min(Math.max(parseInt(countRaw, 10) || 1, 1), 15);
  const reg =
    mode === "register-a" ? "A" : mode === "register-b" ? "B" : "C";
  const slots = [];
  for (let i = 0; i < n; i++) {
    const icp = resolveIcp(icpFilter, i);
    let hookHint = null;
    if (reg === "C") {
      hookHint = C_HOOK_FORMATS[i % C_HOOK_FORMATS.length];
    }
    slots.push({ register: reg, icp, hookHint });
  }
  return slots;
}

function slotsToTaskText(slots) {
  const lines = slots.map((s, i) => {
    let line = `${i + 1}. Register ${s.register}, ICP ${s.icp}`;
    if (s.hookHint) line += `, Register C hook format: "${s.hookHint}"`;
    return line;
  });
  return `Generate exactly ${slots.length} posts. Slots (must match posts[0..${slots.length - 1}] in order):\n${lines.join("\n")}`;
}

function buildUserMessage(slots, extraInstructions) {
  let msg = `${USER_MESSAGE_VOICE_RIDER}\n\n${slotsToTaskText(slots)}`;
  if (extraInstructions && String(extraInstructions).trim()) {
    msg += `\n\nAdditional instructions from Toby:\n${String(extraInstructions).trim()}`;
  }
  return msg;
}

function validateAndAlign(posts, slots) {
  if (!Array.isArray(posts) || posts.length !== slots.length) {
    return { ok: false, error: "Model returned wrong number of posts" };
  }
  for (let i = 0; i < slots.length; i++) {
    const p = posts[i];
    if (!p || typeof p !== "object") {
      return { ok: false, error: `Post ${i} invalid` };
    }
    if (!ICPS.has(p.icp) || !REGISTERS.has(p.register)) {
      return { ok: false, error: `Post ${i} missing icp/register` };
    }
    if (p.register !== slots[i].register || p.icp !== slots[i].icp) {
      return {
        ok: false,
        error: `Post ${i} must be register ${slots[i].register} icp ${slots[i].icp} (model had ${p.register} ${p.icp})`,
      };
    }
    if (!p.body || typeof p.body !== "string" || !p.body.trim()) {
      return { ok: false, error: `Post ${i} empty body` };
    }
    if (!p.one_point || typeof p.one_point !== "string") {
      return { ok: false, error: `Post ${i} missing one_point` };
    }
    if (!p.slugSuffix || typeof p.slugSuffix !== "string") {
      return { ok: false, error: `Post ${i} missing slugSuffix` };
    }
    if (!p.critique || typeof p.critique !== "string") {
      return { ok: false, error: `Post ${i} missing critique` };
    }
  }
  return { ok: true };
}

/**
 * POST /api/posts/generate
 * Body: { mode, count?, icp?, extraInstructions? }
 */
export async function onRequest(ctx) {
  if (ctx.request.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }
  const unauthorized = requireAuth(ctx);
  if (unauthorized) return unauthorized;

  if (!ctx.env.OPENAI_API_KEY) {
    return jsonError(503, "OPENAI_API_KEY not configured");
  }

  let body;
  try {
    body = await ctx.request.json();
  } catch {
    return jsonError(400, "Invalid JSON");
  }

  const mode =
    body && body.mode != null ? String(body.mode).toLowerCase() : "";
  const allowedModes = new Set(["register-a", "register-b", "register-c", "daily-mix"]);
  if (!allowedModes.has(mode)) {
    return jsonError(400, "mode must be register-a, register-b, register-c, or daily-mix");
  }

  const icpFilter =
    body && body.icp != null && body.icp !== "all"
      ? String(body.icp).toLowerCase()
      : "all";
  if (icpFilter !== "all" && !ICPS.has(icpFilter)) {
    return jsonError(400, "icp must be compliance, hr-risk, l-and-d, or all");
  }

  const extraInstructions =
    body && body.extraInstructions != null ? String(body.extraInstructions) : "";

  const slots = buildSlots(mode, body.count, icpFilter);
  const userMessage = buildUserMessage(slots, extraInstructions);

  const safeTemp = Math.min(1, Math.max(0.2, OPENAI_CHAT_TEMPERATURE));

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ctx.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      temperature: safeTemp,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!openaiRes.ok) {
    const errText = await openaiRes.text();
    return json(
      { error: "OpenAI error", detail: errText.slice(0, 2000) },
      502
    );
  }

  const completion = await openaiRes.json();
  const content = completion?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    return jsonError(502, "No content from OpenAI");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return jsonError(502, "OpenAI returned non-JSON");
  }

  const posts = parsed.posts;
  const check = validateAndAlign(posts, slots);
  if (!check.ok) {
    return json({ error: check.error, raw: posts }, 422);
  }

  const day = todayUK();
  const countRow = await ctx.env.DB.prepare(
    "SELECT COUNT(*) as c FROM linkedin_post_draft WHERE day = ?1"
  )
    .bind(day)
    .first();
  const existing = countRow && countRow.c != null ? Number(countRow.c) : 0;

  const now = Math.floor(Date.now() / 1000);
  const inserted = [];

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const nn = existing + i + 1;
    const icp = p.icp;
    const slugPart = sanitizeSlug(p.slugSuffix);
    let dataId = `${day}-${String(nn).padStart(2, "0")}-${icp}-${slugPart}`;

    const score = clampScore(p.score);
    const critique = String(p.critique).trim();
    const bodyText = String(p.body).trim();
    const onePoint = String(p.one_point).trim();
    const hookFormat =
      p.hook_format != null && String(p.hook_format).trim()
        ? String(p.hook_format).trim()
        : slots[i].hookHint || null;

    let finalId = dataId;
    let savedId = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      try {
        await ctx.env.DB.prepare(
          `INSERT INTO linkedin_post_draft
           (data_id, day, icp, register, one_point, hook_format, score, critique, body, created_at)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`
        )
          .bind(
            finalId,
            day,
            icp,
            p.register,
            onePoint,
            hookFormat,
            score,
            critique,
            bodyText,
            now
          )
          .run();
        savedId = finalId;
        break;
      } catch {
        finalId = `${dataId}-${attempt + 1}`;
      }
    }
    if (!savedId) {
      return jsonError(500, "Could not save draft row");
    }

    inserted.push({
      data_id: savedId,
      day,
      icp,
      register: p.register,
      one_point: onePoint,
      hook_format: hookFormat,
      score,
      critique,
      body: bodyText,
      created_at: now,
    });
  }

  return json({ ok: true, day, posts: inserted });
}
