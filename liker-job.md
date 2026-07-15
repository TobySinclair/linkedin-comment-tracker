# LinkedIn Liker Mining (stage 2 — pairs with discovery-job.md)

Automated run. Toby is not present — execute autonomously, note anything unusual when reporting the run.
Do NOT post comments or send DMs on LinkedIn; outreach is handled automatically by lemlist.

**Run this straight after the discovery job, same session ideally.** It reads the candidate cards the discovery job just wrote to `index.html` and pushes ICP reactors into the lemlist campaign. Run it soon — if posts age, reaction lists shift and re-reaching gets harder.

## Why this is its own job

Liker extraction is the most efficient lead source (reactors have pre-qualified themselves by reacting to an ICP post) AND the step most often skipped when it sits at the end of a long discovery run. As a standalone job it cannot be skipped — feeding likers into lemlist is the only thing it does.

## Output destination

Kept reactors go to the **lemlist campaign `cam_rJHFMPZWSTbioQaZE` ("Automatic Liker Connect")** via the lemlist MCP `add_leads_to_campaign` tool. lemlist then auto-connects with them — no manual DMs, no liker cards, no tracker history. This job does NOT modify `index.html` or any other tracker page, and does NOT git-push.

## Setup

1. Clone the repo read-only (playbook §1; bootstrap supplies `$PAT` and `$WORK`).
2. Read `${WORK}/playbook.md` in full (audience routing / ICP definitions are §3).
3. This job's input page = **`index.html`** — read today's day section only. Do not edit any page.
4. Navigate to https://www.linkedin.com/feed/ to confirm login. Login wall → stop and surface a clear error.

## Step 1 — Read today's candidate cards

In `index.html`, find today's `<section class="day" data-date="YYYY-MM-DD">` (the newest, just below the insert marker). For each candidate card in it, read:

- `data-id` slug, name, `data-audience`.
- The **Engagement** field (reaction count) — apply the 10+ threshold.
- The **Link** field — a confirmed `/in/<slug>/recent-activity/all/` URL is the cheap re-reach path; a people-search URL means you'll need to find the post from search.
- The **Post topic** — used to identify the exact post on the person's activity feed.

**Only process CHRO / Compliance / Law Firm candidates.** Skip Influencer candidates entirely — their reactors are stages, not leads. Skip any candidate with fewer than 10 reactions (note it). If today's section has zero eligible candidates, report a one-line empty-run note and stop — that's a legitimate empty run.

## Step 2 — Re-reach each post and extract reactors

For each eligible candidate:

1. **Navigate to the post.** Preferred: the `/in/<real-slug>/recent-activity/all/` URL from the card, then find the post matching the Post topic. Fallback: re-run the keyword search the discovery run used (the topic usually makes it findable). If neither works, skip and note "liker extraction skipped — post not reachable."
2. **Open the reactions modal by clicking the reaction COUNT number, NEVER the Like button** (the Like button registers Toby as a reactor). If the modal won't open, try the three-dots overflow; do NOT click Like. If an accidental Like registers, capture the other reactors anyway and flag prominently: "needs manual unlike."
3. **Capture each reactor:** name, full headline, degree, company, and **LinkedIn profile URL** (from the modal entry's link — required for lemlist).

## Step 3 — Filter and route (ICP only)

**Exclude:** Toby himself; company pages (logo + "X followers", no person); obviously off-ICP roles; **Influencer-tier reactors** (vendors, consultants, recruiters, Big 4, journalists, generic thought leaders) — stages, not leads. Keep law-firm partners.

**Route kept reactors to one of three audiences only — CHRO / Compliance / Law Firm** (playbook §3). Gold-standard examples: Verdun Moar (Speak Up Lead, Lloyds) and Kate Hinchy (Head of Audit — Conduct & Regulatory Compliance, Santander) → Compliance. Drop everything else. If every reactor on a post is non-ICP, note "Liker extraction on [Poster]'s post: 0 ICP reactors out of N."

## Step 4 — Add kept reactors to the lemlist campaign

Add all kept reactors as leads to campaign `cam_rJHFMPZWSTbioQaZE` using the lemlist MCP `add_leads_to_campaign` tool (batch them — up to 100 per call). Per lead:

- `linkedinUrl` — the profile URL captured in Step 2 (this is the key field; the campaign auto-connects on LinkedIn).
- `firstName`, `lastName`, `companyName`.
- `customVariables`: `{ "audience": "chro|compliance|law-firm", "headline": "<full headline>", "sourcePoster": "<poster name>", "sourcePostTopic": "<post topic>", "minedAt": "YYYY-MM-DD" }`.

Rules:

- **Do NOT enable any enrichment flags** (`findEmail`, `verifyEmail`, `linkedinEnrichment`, `findPhone`) — they cost credits.
- **Do NOT pre-check for duplicates** — lemlist dedups server-side; `outcome: "skippedAlreadyInCampaign"` in the response is normal and fine.
- If the lemlist tool errors, surface the exact error and STOP. Never fall back to writing tracker cards.

## Step 5 — Report

No git push. Finish with a short run summary: candidates ≥10 reactions vs skipped, modals opened, reactors captured, kept vs filtered (Toby himself / company pages / off-ICP / Influencer-tier), leads added vs skipped-as-duplicate in lemlist, any accidental-Like incidents, any post skipped as unreachable.
