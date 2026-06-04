# RTS LinkedIn Outreach — Shared Playbook

Single source of truth for every signal-scan job (engagement, new-in-role, active-buyer, watchlist).
Each job: clone this repo → read this playbook → run its own searches → write to its own page → push.
Jobs hold ONLY their searches, comment-shape overrides, budget and cadence. Everything else lives here.

Change a voice rule or template once here and every job inherits it. Do not duplicate this content into job prompts.

---

## 1. Repo & infra config

- `github_repo` = `TobySinclair/linkedin-comment-tracker`
- `default_branch` = `main`
- **PAT:** provided by the calling job's Cowork task bootstrap as `$PAT`. It is NOT stored in this repo — GitHub secret-scanning blocks committing it, and it must not be readable by anyone with repo access. Each scheduled-task instruction holds its own copy.

**Pages (one per job — keeps slug namespaces and git writes from colliding):**

| Job | `html_path` | URL |
|---|---|---|
| Engagement scan | `index.html` | https://linkedin-comment-tracker.pages.dev/ |
| New-in-role scan | `new-roles.html` | https://linkedin-comment-tracker.pages.dev/new-roles.html |
| Active-buyer scan | `active-buyer.html` | https://linkedin-comment-tracker.pages.dev/active-buyer.html |
| Watchlist scan | `watchlist.html` | https://linkedin-comment-tracker.pages.dev/watchlist.html |

A job touches ONLY its own page. Never edit another job's page.

**Clone:** the calling job's bootstrap (the Cowork task instruction) already clones the repo using its `$PAT` and sets `$WORK` to the timestamped working dir before reading this playbook. The bootstrap snippet it uses:

```bash
PAT='<held in the Cowork task instruction, never committed>'
WORK="/tmp/tracker-$(date +%s)"
git clone --depth 50 "https://x-access-token:${PAT}@github.com/TobySinclair/linkedin-comment-tracker.git" "$WORK"
```

**Pre-flight:** if the clone fails (network, PAT, repo unreachable), STOP and surface the exact error. Never fall back to a local file or to mounting a folder. Infra failures must be loud.

**PAT rotation:** the PAT lives in each Cowork task's bootstrap instruction (one per scheduled job), not in the repo. Rotate it in every scheduled-task instruction at once.

---

## 2. Output mechanics

1. Working file = `${WORK}/<your job's html_path>`.
2. Each page has a sticky toolbar and a `<!-- NEWEST-DAY-INSERT-BELOW -->` marker. Insert today's new `<section class="day">` **immediately after that marker**. Newest day on top.
3. Do NOT modify existing day sections, the `<head>`, the inline `<script>`, the `<style>` block, or the `.toolbar` — Cloudflare/Cursor owns those.
4. **Status (done/skip) lives in Cloudflare D1, not in HTML.** Jobs never read or write status. The page overlays it client-side via `/api/statuses` using the card's `data-id` slug — so slug determinism is critical (same post on a re-run must reuse the same slug).
5. Before writing, read the last 7–14 days of `data-id` values **on your own page** and skip anything already logged. (Cross-job dedup is best-effort; pages are separate so a person can legitimately appear once per signal type.)

**Push (from the sandbox, after writing):**

```bash
cd "$WORK"
git config user.email "scheduled-task@tobysinclair.com"
git config user.name "<your-job-name>"
git add <your job's html_path>
git commit -m "<job> scan YYYY-MM-DD"
git push origin main
```

If `git push` fails, surface the exact stderr and STOP. No local-file fallback. Cloudflare Pages auto-deploys on push.

---

## 3. Audience / ICP routing (shared definitions)

Route every candidate by the POSTER'S role, never by topic.

- **CHRO** (`chro`) — HR / L&D / Talent / OD / People Risk / ER / People Director / CPO / CHRO / Head of HR at 500+ employee UK firms. Two champion paths: **P1 Compliance/Risk** (Head of Employee Relations, HR Policy & Compliance, People Risk) and **P2 Leadership/Manager Development** (Head of L&D, Leadership Development, Manager Development, Talent, OD). Tier-1 industries: FS, Social Housing, Healthcare, Contact Centres/BPO.
- **Compliance** (`compliance`) — Head of Compliance, CCO, Director of Compliance, Head of Risk & Compliance; plus Head of Customer Outcomes, General Counsel, Head of Internal Audit, NED with risk oversight. UK-regulated firms, FCA primary.
- **Law Firm** (`law-firm`) — UK employment-law partners, senior associates, PSLs, knowledge counsel at recognisable firms. **Threshold: 25+ reactions.**
- **Influencer** (`influencer`) — vendors, consultants, recruiters, Big 4, publications, non-lawyer thought leaders. Stages, not leads. **Threshold: 30+ reactions.**

Vendors/consultants/recruiters belong ONLY in Influencer. Law-firm partners belong ONLY in Law Firm. CHRO/Compliance buckets stay practitioners-only.

The broader "ICP" = CHRO + Compliance + Law Firm. Influencer is a stage.

---

## 4. Voice — comments (standard 3-part)

Toby is a British founder typing on his phone between meetings. Human, slightly rushed, not corporate.

**Structure — every comment:**
1. **Short acknowledge.** A few words, varied: Spot on. / Really useful, this. / Yeah, this is good. / Brilliant teardown. / Sharp read. / Really useful framing.
2. **One build — a single sentence.** Sharpen one point; reference a specific phrase/number/frame from the post; address them with "you/your".
3. **Short open question, 5–10 words, max ~12.** Starts with What/How, uses you/your. "How are you testing whether it lands?" / "What have you found shifts it?"

**Hard rules:** three sentences total · no double or single quote marks around phrases · no em dashes (use commas/full stops) · contractions fine · no "great post!" · no "I wonder how many…" · reference something specific · address them directly · never mention Real Talk Studio or Pressure Test · confident peer, slightly challenging · no hashtags or emojis · British spelling.

**Examples:**
- Really useful, this. The Blueprint gives you the language but the wobble shows up the first time a manager runs one of those behaviours under real pressure. How are you testing whether it lands?
- Yeah, this is good. The MI rarely fails, the board conversation around it does. What have you found shifts it?
- Sharp read. The good and poor practice format does the supervisory work without firms getting to litigate it. How are you seeing firms prep for it?

**Track-2 (comment-mined) leads:** same structure, replying to THEIR comment. "Really interesting point about [specific thing]. [One-line build picking up their thread.] What/How [open question addressing them]?"

---

## 5. Voice — connection notes (every candidate card)

The note Toby pastes into the LinkedIn connect dialog. Goal = start a conversation, not pitch.

**Structure:** 1) "Hi <FirstName>," 2) one specific line referencing their post 3) soft invitation: "Would love to swap notes on… / hear more about…" + a specific topic.

**Hard rules:** under 300 chars · no quotes, no em dashes · no compliments to the person, refer to the post · no CTA stronger than "would love to" · second person throughout · never mention RTS/Pressure Test · British spelling · 3–4 sentences max.

**Examples:**
- Hi Martin, your Consumer Duty as a governance test post struck a chord. Would love to swap notes on how boards are actually shifting from review into proper challenge.
- Hi Megan, really useful framing on the three types of hard conversations. Would love to swap notes on rehearsal vs frameworks for managers stepping in for the first time.

Comment (public, ends in open question) and connection note (private, first-name, ends in soft invitation) should share a frame but not be identical — rewrite the build and close.

---

## 6. Voice — liker DMs (Step 2.5 follow-up cards)

One short DM-style message per ICP reactor:

> Hi `<FirstName>`, saw you reacted to `<Poster>`'s `<short topic>` post. `<One-line build referencing a specific frame.>` Would love to swap notes on `<one specific thing>`.

Same hard rules as §4. 1–3 short sentences.

---

## 7. HTML templates

**Candidate card:**

```html
<div class="card" data-id="<STABLE-SLUG>" data-audience="<chro|compliance|law-firm|influencer>" data-status="todo">
  <div class="card-head">
    <div class="who">
      <h3><N>. <Name></h3>
      <div class="topic"><Topic path></div>
    </div>
    <div class="badges">
      <span class="badge <chro|compliance|law-firm|influencer>"><CHRO|Compliance|Law Firm|Influencer></span>
      <span class="status todo">TODO</span>
    </div>
  </div>
  <dl class="meta">
    <dt>Role</dt><dd><Role + company></dd>
    <dt>Post topic</dt><dd><1-2 sentence summary></dd>
    <dt>Engagement</dt><dd><N> reactions · <N> comments · <N> reposts</dd>
    <dt>Post age</dt><dd><e.g. 2d, 1w></dd>
    <dt>Link</dt><dd><a href="<post or profile URL>" target="_blank" rel="noopener"><label></a></dd>
  </dl>
  <div class="comment">
    <div class="comment-label">Draft comment</div>
    <Draft comment per §4>
  </div>
  <div class="comment connection">
    <div class="comment-label">Connection request</div>
    <Connection note per §5>
  </div>
  <div class="actions">
    <button class="btn" data-action="comment-only">Comment only</button>
    <button class="btn" data-action="comment-and-connect">Comment + connect</button>
    <button class="btn" data-action="skip">Skip</button>
    <button class="btn" data-action="reset">Reset</button>
  </div>
</div>
```

**Liker card** (DM block instead of connection note; ICP-only — CHRO/Compliance/Law Firm):

```html
<div class="card" data-id="<STABLE-LIKER-SLUG>" data-audience="<chro|compliance|law-firm>" data-status="todo">
  <div class="card-head">
    <div class="who">
      <h3><N>. <Reactor name></h3>
      <div class="topic">Liker follow-up &middot; Liked <Poster>&apos;s <short topic></div>
    </div>
    <div class="badges">
      <span class="badge <chro|compliance|law-firm>"><CHRO|Compliance|Law Firm></span>
      <span class="status todo">TODO</span>
    </div>
  </div>
  <dl class="meta">
    <dt>Role</dt><dd><Reactor headline + degree></dd>
    <dt>Commented on</dt><dd>Liked <Poster>&apos;s <short topic> &mdash; <a href="<url>" target="_blank" rel="noopener">link to original post</a></dd>
    <dt>Link</dt><dd><a href="<reactor search URL>" target="_blank" rel="noopener">Find on LinkedIn</a></dd>
  </dl>
  <div class="comment">
    <div class="comment-label">Draft message</div>
    <DM per §6>
  </div>
  <div class="actions">
    <button class="btn" data-action="comment-only">Comment only</button>
    <button class="btn" data-action="comment-and-connect">Comment + connect</button>
    <button class="btn" data-action="skip">Skip</button>
    <button class="btn" data-action="reset">Reset</button>
  </div>
</div>
```

**Comment-miner card** (reply block + connection note; ICP-only — CHRO/Compliance/Law Firm. The lead is the COMMENTER, not the poster):

```html
<div class="card" data-id="<STABLE-COMMENTER-SLUG>" data-audience="<chro|compliance|law-firm>" data-status="todo">
  <div class="card-head">
    <div class="who">
      <h3><N>. <Commenter name></h3>
      <div class="topic">Comment-mined &middot; Commented on <Poster>&apos;s <short topic></div>
    </div>
    <div class="badges">
      <span class="badge <chro|compliance|law-firm>"><CHRO|Compliance|Law Firm></span>
      <span class="status todo">TODO</span>
    </div>
  </div>
  <dl class="meta">
    <dt>Role</dt><dd><Commenter headline + degree></dd>
    <dt>Their comment</dt><dd><1-2 sentence gist of what they wrote></dd>
    <dt>Commented on</dt><dd><Poster>&apos;s <short topic> &mdash; <a href="<url>" target="_blank" rel="noopener">link to original post</a></dd>
    <dt>Link</dt><dd><a href="<commenter profile or search URL>" target="_blank" rel="noopener">Find on LinkedIn</a></dd>
  </dl>
  <div class="comment">
    <div class="comment-label">Draft reply</div>
    <Track-2 reply per §4>
  </div>
  <div class="comment connection">
    <div class="comment-label">Connection request</div>
    <Connection note per §5>
  </div>
  <div class="actions">
    <button class="btn" data-action="comment-only">Comment only</button>
    <button class="btn" data-action="comment-and-connect">Comment + connect</button>
    <button class="btn" data-action="skip">Skip</button>
    <button class="btn" data-action="reset">Reset</button>
  </div>
</div>
```

**Day section wrapper:**

```html
<section class="day" data-date="YYYY-MM-DD">
  <h2>YYYY-MM-DD</h2>
  <!-- candidate cards, then liker cards, numbered 1..N across the whole day -->
  <div class="run-notes">
    <h3>Run notes — YYYY-MM-DD</h3>
    <ul><li>…</li></ul>
  </div>
</section>
```

---

## 8. Slug formats

- **Candidate:** `YYYY-MM-DD-firstname-lastname-short-topic`
- **Liker:** `YYYY-MM-DD-<run-suffix>-liker-<reactor-firstname>-<reactor-lastname>-<poster-firstname>`
- **Comment-miner:** `YYYY-MM-DD-<run-suffix>-commenter-<commenter-firstname>-<commenter-lastname>-<poster-firstname>`

Lowercase, hyphen-separated, ASCII-only, deterministic. Never include the `-watchlist-` marker (reserved for the watchlist job's namespace).

---

## 9. Getting the post / profile link

Default = a people-search URL built from name + company; Toby finds the profile manually:

```
https://www.linkedin.com/search/results/people/?keywords=<Name>%20<Company-or-role-keyword>
```

Do NOT guess `/in/<slug>/` URLs (they 404). A confirmed real slug from the search result HTML is fine as an upgrade.

---

## 10. Global rules

- Login wall → stop, surface a clear error in run notes.
- NEVER post comments. Toby reviews and posts manually.
- Never write to a local file. Output is exclusively `git push`.
- If a run yields little, still write a short day section and push so the run is logged.
