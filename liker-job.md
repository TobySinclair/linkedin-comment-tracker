# LinkedIn Liker Mining (stage 2 — pairs with discovery-job.md)

Automated run. Toby is not present — execute autonomously, note anything unusual in the run notes.
Do NOT post comments or send DMs on LinkedIn; Toby reviews and sends manually.

**Run this straight after the discovery job, same session ideally.** It reads the candidate cards the discovery job just wrote to `index.html` and appends liker cards to that same day section. Run it soon — if posts age, reaction lists shift and re-reaching gets harder.

## Why this is its own job

Liker extraction is the most efficient lead source (reactors have pre-qualified themselves by reacting to an ICP post) AND the step most often skipped when it sits at the end of a long discovery run. As a standalone job it cannot be skipped — appending liker cards is the only thing it does.

## Setup

1. Clone the repo (playbook §1; bootstrap supplies `$PAT` and `$WORK`).
2. Read `${WORK}/playbook.md` in full (voice for liker DMs is §6, liker card template is §7, routing is §3).
3. This job's page = **`index.html`**. You will EDIT today's day section (the one discovery just wrote) — this is the one allowed exception to "don't modify existing day sections": you may only touch **today's** section, only to add liker cards and a liker-pass note. Never touch prior days or any other page.
4. Navigate to https://www.linkedin.com/feed/ to confirm login. Login wall → stop and surface a clear error.

## Step 1 — Read today's candidate cards

In `index.html`, find today's `<section class="day" data-date="YYYY-MM-DD">` (the newest, just below the insert marker). For each candidate card in it, read:

- `data-id` slug, name, `data-audience`.
- The **Engagement** field (reaction count) — apply the 10+ threshold.
- The **Link** field — a confirmed `/in/<slug>/recent-activity/all/` URL is the cheap re-reach path; a people-search URL means you'll need to find the post from search.
- The **Post topic** — used to identify the exact post on the person's activity feed.

**Only process CHRO / Compliance / Law Firm candidates.** Skip Influencer candidates entirely — their reactors are stages, not leads. Skip any candidate with fewer than 10 reactions (note it). If today's section has zero eligible candidates, write a one-line run note and stop — that's a legitimate empty run.

## Step 2 — Re-reach each post and extract reactors

For each eligible candidate:

1. **Navigate to the post.** Preferred: the `/in/<real-slug>/recent-activity/all/` URL from the card, then find the post matching the Post topic. Fallback: re-run the keyword search the discovery run used (the topic usually makes it findable). If neither works, skip and note "liker extraction skipped — post not reachable."
2. **Open the reactions modal by clicking the reaction COUNT number, NEVER the Like button** (the Like button registers Toby as a reactor). If the modal won't open, try the three-dots overflow; do NOT click Like. If an accidental Like registers, capture the other reactors anyway and flag prominently: "needs manual unlike before public comment."
3. **Capture each reactor:** name, full headline, degree, company. Scroll within the modal until no new entries load.

## Step 3 — Filter and route (ICP only)

**Exclude:** Toby himself; company pages (logo + "X followers", no person); obviously off-ICP roles; **Influencer-tier reactors** (vendors, consultants, recruiters, Big 4, journalists, generic thought leaders) — stages, not leads. Keep law-firm partners.

**Route kept reactors to one of three audiences only — CHRO / Compliance / Law Firm** (playbook §3). Gold-standard examples: Verdun Moar (Speak Up Lead, Lloyds) and Kate Hinchy (Head of Audit — Conduct & Regulatory Compliance, Santander) → Compliance. Drop everything else. If every reactor on a post is non-ICP, note "Liker extraction on [Poster]'s post: 0 ICP reactors out of N."

## Step 4 — Draft and append liker cards

1. Draft one DM-style message per kept reactor (playbook §6 liker-DM shape).
2. Render each as a liker card (playbook §7 liker template), `data-audience` = chro / compliance / law-firm.
3. **Insert the liker cards into today's day section**, after the last candidate card and BEFORE the `<div class="run-notes">`. Number them continuously from the candidate count (if discovery wrote 9 candidates, the first liker is 10).
4. **Append a liker-pass note** inside today's existing `<div class="run-notes">` (add `<li>` items, don't rewrite the section): candidates ≥10 reactions vs skipped, modals opened, liker cards created vs reactors skipped and why (Toby himself / company pages / off-ICP / Influencer-tier filtered out), any accidental-Like incidents, any post skipped as unreachable.

## Step 5 — Push

Commit + push per playbook §2 (`git config user.name "linkedin-liker-mining"`, `git add index.html`). If push fails, surface stderr and STOP. No local fallback.

## Slugs

Liker slug format (playbook §8): `YYYY-MM-DD-<run-suffix>-liker-<reactor-firstname>-<reactor-lastname>-<poster-firstname>`. Deterministic, ASCII-only, no `-watchlist-` marker.
