# LinkedIn Watchlist Scan

Automated run. Toby is not present — execute autonomously, make reasonable choices, note anything unusual in the run notes.
Do NOT post comments on LinkedIn; Toby reviews and posts manually.

## Objective

Scan a named list of individuals Toby is actively building relationships with. Surface **every original post in the last 7 days** from anyone on the list, regardless of engagement, and draft a comment + connection note for each. Goal is consistent presence in these people's threads, not a candidate count — so there is no cap on total cards (only a per-person cap, below). Writes to `watchlist.html`.

This is a relationship-nurture scan, distinct from the discovery/liker/active-buyer/new-in-role jobs which chase fresh signals. Those write to their own pages; this one owns `watchlist.html` only.

## Setup

Read the shared playbook first — it holds infra, comment voice (§4), connection-note rules (§5), slug rules (§8) and push mechanics (§2). This spec carries the named list, the scan method, and the watchlist-specific card variant.

1. Clone the repo (playbook §1; bootstrap supplies `$PAT` and `$WORK`).
2. Read `${WORK}/playbook.md` in full.
3. This job's page = **`watchlist.html`**. Touch only this page — never `index.html`, `new-roles.html`, `active-buyer.html`.
4. **If `watchlist.html` is missing from the clone**, STOP and surface: `watchlist.html missing — bootstrap it from index.html (duplicate, change H1/title, keep toolbar + style + script + NEWEST-DAY-INSERT-BELOW marker) and re-run`. Do NOT scaffold it inside this run.
5. Read the last 7 days of `data-id` values in `watchlist.html`; do not duplicate posters or posts. Match the tone of any drafts Toby edited in place.
6. Navigate to https://www.linkedin.com/feed/ to confirm login. Login wall → stop and surface a clear error.

## The watchlist

Scan each profile in order. When Toby asks to add a name, append it with the next number; to remove, delete the row and renumber.

| # | Name | LinkedIn |
|---|------|----------|
| 1 | Adrianna Fabijanska | https://www.linkedin.com/in/adrianna-fabijanska-57444679 |
| 2 | Aisling Twomey | https://www.linkedin.com/in/aislingtwomey |
| 3 | Chantelle Obatolu | https://www.linkedin.com/in/chantelleobatolu |
| 4 | Emma Williams | https://www.linkedin.com/in/emma-williams-2305b8175 |
| 5 | Alasdair Fraser | https://www.linkedin.com/in/alasdairfraser8 |
| 6 | Ben Westwood | https://www.linkedin.com/in/bn-wstwd |
| 7 | Dane Pedro | https://www.linkedin.com/in/dane-pedro-jp |
| 8 | Kostyantyn Mukhlygin | https://www.linkedin.com/in/kostyantyn-mukhlygin-cams-prof-pddip-grc-ica-10941715 |
| 9 | Samuel Aidoo | https://www.linkedin.com/in/samuel-aidoo-int-dip-aml-fica-b9008974 |
| 10 | Scott Mitchell | https://www.linkedin.com/in/scott-mitchell-mica-int-dip-aml-dip-fin-crime-73428171 |
| 11 | Alan Campbell | https://www.linkedin.com/in/alan-campbell-a8baa1103 |
| 12 | Bibi Pearce Johnson | https://www.linkedin.com/in/bibi-pearce-johnson-ba27922 |
| 13 | Miloš Bogdanović | https://www.linkedin.com/in/miloš-bogdanović-89405190 |
| 14 | Sam Bleazard | https://www.linkedin.com/in/sambleazard/ |
| 15 | Kevin Green | https://www.linkedin.com/in/kevin-green-221a7522/ |
| 16 | Carly Stanley | https://uk.linkedin.com/in/carly-stanley-48b01282 |
| 17 | Shane Ashby-Roche | https://uk.linkedin.com/in/shane-ashbyroche |
| 18 | Simon Fanshawe | https://www.linkedin.com/in/simon-fanshawe-0549a031/ |
| 19 | Joel Turner | https://www.linkedin.com/in/joel-turner-122b7026/ |
| 20 | Paul Jones-Nolan | https://uk.linkedin.com/in/paul-jones-nolan-6803a914 |
| 21 | Stella Gavinho | https://www.linkedin.com/in/stellagavinho/ |
| 22 | Siobhan Heffron | https://www.linkedin.com/in/siobhanrandell/ |
| 23 | Katy McIntyre | https://uk.linkedin.com/in/mcintyrekaty |
| 24 | Miriam Warren | https://www.linkedin.com/in/miriamwarren |
| 25 | Lea Hawkins-Gaboc | https://uk.linkedin.com/in/leahawkinsgaboc |
| 26 | Nick Holmes | https://www.linkedin.com/in/nickholmeshr/ |
| 27 | Megan Yawor | https://www.linkedin.com/in/megan-yawor-13900244/ |
| 28 | Katy Busby | https://www.linkedin.com/in/katybusby/ |
| 29 | Stuart Martin | https://www.linkedin.com/in/stuartmartin-hr-ai/ |
| 30 | Mathew James Dutton | https://uk.linkedin.com/in/mathewdutton |
| 31 | Joyce Idoniboye | https://www.linkedin.com/in/joyce-idoniboye-a6068219/ |
| 32 | Emma Woodford | https://www.linkedin.com/in/emma-woodford-nee-giddy-541b6826/ |
| 33 | Ian Tomney-Bell | https://uk.linkedin.com/in/iantomney-bell |
| 34 | Jade Archibald | https://uk.linkedin.com/in/jade-archibald-mcipd-b4766621 |
| 35 | Sanjay Mistry | https://www.linkedin.com/in/sanjaymistry77/ |
| 36 | Lowri Williams | https://uk.linkedin.com/in/lowri-williams-fcipd-64ba3314 |
| 37 | Jennifer Sproul | https://uk.linkedin.com/in/jennifersproul31 |
| 38 | Kaylee Darkins | https://www.linkedin.com/in/kaylee-darkins-43830785/ |
| 39 | Natasha Rudy | https://uk.linkedin.com/in/natasharudy |
| 40 | Ellie McCluskey | https://uk.linkedin.com/in/ellie-mccluskey |
| 41 | Judy Roberts | https://uk.linkedin.com/in/judy-roberts-56637a19 |
| 42 | Tor Goldfield | https://www.linkedin.com/in/torgoldfield/ |
| 43 | Nicola Marshall | https://uk.linkedin.com/in/nicmarshall |
| 44 | Janina Norton | https://www.linkedin.com/in/janina-norton-a9478b55/ |
| 45 | Jane van Zyl | https://www.linkedin.com/in/jane-van-zyl/ |
| 46 | Larissa Schneider-Kim | https://www.linkedin.com/in/larissa-schneider-kim/ |
| 47 | Rebecca Eaton | https://www.linkedin.com/in/rebecca-eaton-9598941a/ |
| 48 | Nazia Nathu | https://www.linkedin.com/in/nazianathu/ |
| 49 | Ori Chandler | https://uk.linkedin.com/in/ori-chandler-she-her-16005324 |
| 50 | Claire Maydew | https://www.linkedin.com/in/claire-maydew-34473ba/ |

## How to scan

For each profile, in order:

1. Navigate to `<profile-url>/recent-activity/all/` (append `/recent-activity/all/`). Wait for posts to render.
2. Scan posts from the **last 7 days only**. Older posts are skipped — this is a fresh-content scan, not a backfill.
3. For each post in window:
   - **Any original post qualifies — no engagement threshold.** Original posts, articles, newsletters, polls, image and video posts all count.
   - **Skip** pure reposts with no commentary and shared links with no original take. **Include** reposts WITH a meaningful comment (the comment is the post).
   - Dedup against the last 7 days of `data-id` in `watchlist.html`; if already logged, skip.
   - Draft a comment and connection note (voice rules below).
4. **Cap: max 2 posts per person per run.** If someone posted more, pick the two most substantive — skip housekeeping / "we're hiring" / "happy Friday" in favour of opinion or analysis.

**Time budget:** ~25–40 min for 50 people (roughly 30–60s per profile). Scale proportionally if the list grows.

**When dry:** if nobody has posted in 7 days, write a one-line `Watchlist — no new posts this run` at the top of the run-notes, push an essentially empty day section (header + run notes), and stop. Do NOT invent posts or stretch the window. The empty section is the audit trail that the job ran.

## Voice

Use playbook §4 (comment voice) and §5 (connection notes) — the same three-part comment structure and hard rules. **Two watchlist deltas:**

1. **Openers can be a touch warmer** than the discovery job, because these are warm relationships: "Good post, this." / "Yeah, this is sharp." / "Really enjoyed this." are fine alongside the standard openers. Still no "great post!" or pure compliment.
2. **Connection note defaults to the literal string `Already connected — skip`** — Toby is usually already connected to watchlist people. The slot must still be present in the card markup (the UI expects it), but the body is that literal string. Only write a real connection note (playbook §5) if the profile clearly shows 2nd or 3rd degree next to the name.

## Watchlist card template

Same as the playbook §7 candidate card but with `data-audience="watchlist"`, a `Source` row, and the connection slot defaulting to "Already connected — skip":

```html
<div class="card" data-id="<STABLE-SLUG>" data-audience="watchlist" data-status="todo">
  <div class="card-head">
    <div class="who">
      <h3><N>. <Name></h3>
      <div class="topic"><Topic></div>
    </div>
    <div class="badges">
      <span class="badge watchlist">Watchlist</span>
      <span class="status todo">TODO</span>
    </div>
  </div>
  <dl class="meta">
    <dt>Role</dt><dd><Role + company, or "(see profile)" if not visible></dd>
    <dt>Source</dt><dd>Watchlist scan</dd>
    <dt>Post topic</dt><dd><1-2 sentence summary></dd>
    <dt>Engagement</dt><dd><N> reactions · <N> comments · <N> reposts</dd>
    <dt>Post age</dt><dd><e.g. 2d, 1w></dd>
    <dt>Link</dt><dd><a href="<profile URL from the table>" target="_blank" rel="noopener">Open profile</a></dd>
  </dl>
  <div class="comment">
    <div class="comment-label">Draft comment</div>
    <Draft comment per playbook §4 (watchlist-warm opener allowed)>
  </div>
  <div class="comment connection">
    <div class="comment-label">Connection request</div>
    <Connection note per playbook §5, OR the literal string "Already connected — skip">
  </div>
  <div class="actions">
    <button class="btn" data-action="comment-only">Comment only</button>
    <button class="btn" data-action="comment-and-connect">Comment + connect</button>
    <button class="btn" data-action="skip">Skip</button>
    <button class="btn" data-action="reset">Reset</button>
  </div>
</div>
```

**Watchlist slug format:** `YYYY-MM-DD-watchlist-firstname-lastname-short-topic` (lowercase, hyphen-separated, ASCII-only). The `-watchlist-` segment is MANDATORY — it keeps this page's slug namespace from colliding with `index.html` cards in Cloudflare D1. (This is the one job that uses the `-watchlist-` marker; all other jobs must NOT.)

## Day section wrapper

```html
<section class="day" data-date="YYYY-MM-DD">
  <h2>YYYY-MM-DD — Watchlist</h2>
  <!-- watchlist cards, numbered 1..N -->
  <div class="run-notes">
    <h3>Run notes — YYYY-MM-DD</h3>
    <ul><li>…</li></ul>
  </div>
</section>
```

## Write & push

1. Build today's day section, cards numbered 1..N, insert after `<!-- NEWEST-DAY-INSERT-BELOW -->` in `watchlist.html`. Don't modify prior days, the head/style/script/toolbar, or any other page.
2. Run notes: profiles scanned, qualifying posts found, profiles that failed to load, any near-threshold flags. If dry, first line is `Watchlist — no new posts this run`.
3. Commit + push per playbook §2 (`git config user.name "linkedin-watchlist"`, `git add watchlist.html`).
4. If push fails, surface stderr and STOP. No local fallback. Always push so the run is logged.
