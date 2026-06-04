# LinkedIn Comment Mining (stage 2 — pairs with discovery-job.md)

Automated run. Toby is not present — execute autonomously, note anything unusual in the run notes.
Do NOT post comments or send connection requests on LinkedIn; Toby reviews and sends manually.

**Run this straight after the discovery job (alongside or after the liker job), same session ideally.** It reads the candidate cards the discovery job just wrote to `index.html` and appends comment-miner cards to that same day section. Run it soon — if posts age, comment threads grow stale and re-reaching gets harder.

## Why this is its own job

Comment mining (the old "Track-2") is one of the richest lead sources: anyone who took the time to write a substantive comment on an ICP post has pre-qualified themselves far more strongly than a passive reactor. But it was the step most often dropped at the end of a long discovery run. As a standalone job it cannot be skipped — appending comment-miner cards is the only thing it does.

It is the comment-thread sibling of the liker job:
- **Liker job** mines people who *reacted* to a candidate post (the reactions modal). Lead = reactor, follow-up = DM.
- **This job** mines people who *commented* on a candidate post (the comment thread). Lead = commenter, follow-up = a public reply to their comment, plus an optional connection note.

## Setup

1. Clone the repo (playbook §1; bootstrap supplies `$PAT` and `$WORK`).
2. Read `${WORK}/playbook.md` in full (Track-2 reply voice is §4, connection-note voice is §5, comment-miner card template is §7, routing is §3).
3. This job's page = **`index.html`**. You will EDIT today's day section (the one discovery just wrote) — this is the one allowed exception to "don't modify existing day sections": you may only touch **today's** section, only to add comment-miner cards and a comment-mining-pass note. Never touch prior days or any other page.
4. Navigate to https://www.linkedin.com/feed/ to confirm login. Login wall → stop and surface a clear error.

## Step 1 — Read today's candidate cards

In `index.html`, find today's `<section class="day" data-date="YYYY-MM-DD">` (the newest, just below the insert marker). For each candidate card in it, read:

- `data-id` slug, name, `data-audience`.
- The **Engagement** field — note the comment count. Apply a **3+ comments** floor (threads with 0–2 comments aren't worth opening; note them as skipped).
- The **Link** field — a confirmed `/in/<slug>/recent-activity/all/` URL is the cheap re-reach path; a people-search URL means you'll need to find the post from search.
- The **Post topic** — used to identify the exact post on the person's activity feed.

**Process candidates of ALL audiences, including Influencer and Law Firm.** This is the opposite of the liker job: Influencer and Law-Firm posts are big public stages, so they collect the most practitioner comments and are the best mining ground. (We mine the post for whoever commented; the poster's own audience is irrelevant — we route the COMMENTER by their role.) If today's section has zero candidates with 3+ comments, write a one-line run note and stop — that's a legitimate empty run.

## Step 2 — Re-reach each post and read the comment thread

For each eligible candidate post:

1. **Navigate to the post.** Preferred: the `/in/<real-slug>/recent-activity/all/` URL from the card, then find the post matching the Post topic. Fallback: re-run the keyword search the discovery run used (the topic usually makes it findable). If neither works, skip and note "comment mining skipped — post not reachable."
2. **Open the full comment thread.** Click into the post so comments load. Expand "Load more comments" / "See more replies" until no new comments load. Sort by most relevant or most recent — whichever surfaces the substantive practitioner comments. **Read comments only — NEVER click Like, Reply-submit, or any control that posts.** If a composer opens, leave it empty and move on.
3. **Capture each commenter:** name, full headline, degree, company, and a **1–2 sentence gist of what they actually wrote** (you need their specific point to draft the Track-2 reply). Skip pure tags/emojis/"great post" with no substance.

## Step 3 — Filter and route (ICP only)

**Exclude:** Toby himself; the original poster; company pages; obviously off-ICP roles; low-substance comments (tags, emojis, "great share"); and **Influencer-tier commenters** (vendors, consultants, recruiters, Big 4, journalists, generic thought leaders) — they are stages, not leads. Keep law-firm partners.

**Route kept commenters to one of three audiences only — CHRO / Compliance / Law Firm** (playbook §3), by the commenter's own role. A Head of ER commenting on a Lewis Silkin post → CHRO; a compliance officer commenting on a Big-4 post → Compliance; an employment partner → Law Firm. Drop everything else. If every commenter on a post is non-ICP, note "Comment mining on [Poster]'s post: 0 ICP commenters out of N."

## Step 4 — Draft and append comment-miner cards

1. Draft one **Track-2 reply** per kept commenter (playbook §4 Track-2 shape — acknowledge their specific point, one build picking up their thread, short open question). Plus a **connection note** (playbook §5).
2. Render each as a comment-miner card (playbook §7 comment-miner template), `data-audience` = chro / compliance / law-firm.
3. **Insert the comment-miner cards into today's day section**, after the last existing card (candidate or liker) and BEFORE the `<div class="run-notes">`. Number them continuously from the current last card number (if the section already has 12 cards, the first comment-miner is 13). If the liker job also runs, order is by whichever runs first — both just append at the end.
4. **Append a comment-mining-pass note** inside today's existing `<div class="run-notes">` (add `<li>` items, don't rewrite the section): which posts had 3+ comments vs skipped, threads opened, comment-miner cards created vs commenters skipped and why (Toby / poster / company pages / off-ICP / low-substance / Influencer-tier filtered out), and any post skipped as unreachable.

## Step 5 — Push

Commit + push per playbook §2 (`git config user.name "linkedin-comment-mining"`, `git add index.html`). If push fails, surface stderr and STOP. No local fallback.

## Slugs

Comment-miner slug format (playbook §8): `YYYY-MM-DD-<run-suffix>-commenter-<commenter-firstname>-<commenter-lastname>-<poster-firstname>`. Deterministic, ASCII-only, no `-watchlist-` marker. The `-commenter-` token keeps this namespace distinct from the liker job's `-liker-` cards so the same person can legitimately appear as both a reactor and a commenter without slug collision.
