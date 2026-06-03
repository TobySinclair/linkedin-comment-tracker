# LinkedIn Engagement Scan (keyword + comment-mining + likers)

Automated run. Toby is not present — execute autonomously, make reasonable choices, note anything unusual in the run notes.
Do NOT post comments on LinkedIn; Toby reviews and posts manually.

**Cadence:** a few times a week. This is the heavy scan (~50–75 min). Buyer-intent (Path 5) and new-in-role moves are now separate faster jobs — this job is the topic-engagement signal only.

## Objective

Scan LinkedIn and produce ~8–12 candidates across **four audiences**, written to `index.html`:

- **CHRO / HR buyer** (highest priority) — champions beneath the CHRO. Path 1 (Compliance / Risk): Head of Employee Relations, HR Policy & Compliance, People Risk. Path 2 (Leadership & Manager Dev): Head of L&D, Leadership Development, Manager Development, Talent, OD. Plus CHRO / CPO / HR Director sign-off level. 500+ UK. Tier-1: FS, Social Housing, Healthcare, Contact Centres / BPO.
- **Compliance** — Head of Compliance, CCO, Director of Compliance, Head of Risk & Compliance, + Customer Outcomes, General Counsel, Internal Audit, NED with risk oversight. UK-regulated, FCA primary.
- **Law Firm** — UK employment-law partners, senior associates, PSLs, knowledge counsel. Stages for comments AND the richest Track-2 comment-mining ground. **25+ reactions.**
- **Influencer** — vendors, consultants, recruiters, Big 4, publications, non-lawyer thought leaders. Stages, not leads. **30+ reactions.**

Roughly 3 per audience. Quality over quantity. Full audience definitions, thresholds and routing live in **playbook §3** — read it; don't re-derive them here.

All shared mechanics (infra/clone/push, voice for comments + connection notes + liker DMs, HTML card templates, slug formats, link format) live in the **playbook**. This spec carries only what's specific to the engagement scan: the search corpus, the sampling rules, the Law Firm / Influencer routing, Track-2 comment-mining, and the Step 2.5 liker extraction.

## Setup

1. Clone the repo (playbook §1; bootstrap supplies `$PAT` and `$WORK`).
2. Read `${WORK}/playbook.md` in full.
3. This job's page = **`index.html`**. Touch only this page. (The Watchlist job owns `watchlist.html`; the new-in-role and active-buyer jobs own their own pages — never touch those.)
4. Read the last 7 days of `data-id` values in `index.html`; do not duplicate posters or posts. Note the tone of any draft comments Toby edited in place and match it.
5. Navigate to https://www.linkedin.com/feed/ to confirm login. Login wall → stop and surface a clear error.

## Run budget

- **~45 keyword searches** — ~30 across Audience A (CHRO), ~12 across Audience B Track 1 (Compliance), 4–6 Influencer modifiers. (Law Firm needs no own searches — it inherits.)
- **Named-account watchlists** — quick scroll of last 48h posts across the Audience C and Audience D seed accounts at the start, before keyword discovery.
- **Comment-mining (Track 2)** — on any post clearing 50+ reactions, scan comments for ICP practitioners (3–8 posts per run).
- **Output** — 8–12 candidates, ~3 per audience.
- Time split: ~40% Audience A · ~30% Audience B · ~15% Law Firm · ~15% Influencer. Move on fast from dry searches.

## Search syntax (IMPORTANT — read before searching)

The corpus below was rewritten away from boolean `OR` chains because LinkedIn content search handles them poorly (they return junk) and ampersands (`L&D`) break matching entirely. Every query is now either a single specific quoted phrase or **two quoted phrases where the second anchors the domain**. Tested rules:

- Two short quoted phrases works: `"Acas" "grievance"` returns real UK ER practitioners.
- The second phrase MUST anchor the domain for polysemous terms. `"reasonable steps" "evidence"` drifts into trucking-safety / ESG; `"reasonable steps" "harassment"` stays on-topic.
- Never use bare `OR` between unquoted words, and never use `&` (write `"learning and development"`, not `L&D`).
- Where a single phrase is specific enough on its own (`"dignity at work"`, `"three lines of defence"`, `"training fatigue"`), use it alone.

Use the past-week filter, latest sort. Geography is not filtered by search — keep only UK 500+ (regulated for Compliance); discard high-engagement foreign posts. If a query still returns junk, flag it in the run notes so the corpus can be tuned.

## Audience A — CHRO / HR buyer

Target the champions directly (they post far more than the CHRO). Buying triggers (2026): Worker Protection Act (Oct), FCA NFM rules (Sept), whistleblowing extension (Apr), EHRC enforcement, Employment Rights Act 2025, new CHRO / new leadership programme.

**Sampling: pick TWO searches from each lettered cluster per run. Paths 3 and 4 are single clusters — pick 4–6 from each. ~30 searches total. Path priority when quality is equal: Path 3/4 (intent) before Path 1/2.**

### Path 1 — HR Compliance & Risk

*Regulation & enforcement (vendor/law-firm-heavy — use sparingly for direct leads, great for Track-2 mining):*
1. `"Worker Protection Act" "all reasonable steps"`
2. `"non-financial misconduct"`  ·  `"COCON"`
3. `"Employment Rights Act" "employer"`
4. `"EHRC" "employer"`  ·  `"EHRC" "harassment"`
5. `"tribunal" "harassment"`  ·  `"tribunal" "bullying"`

*Investigation & casework (practitioner-language, high yield):*
6. `"grievance investigation"`  ·  `"harassment investigation"`
7. `"workplace investigation" "lessons"`
8. `"disciplinary hearing"`
9. `"employee relations" "casework"`
10. `"Acas" "grievance"`  ·  `"Acas" "harassment"`  ·  `"early conciliation"`
11. `"dignity at work"`
12. `"HR casework"`  ·  `"ER casework"`

*Disclosure, whistleblowing, bystander:*
13. `"whistleblowing" "disclosure"`
14. `"speak-up culture"`
15. `"bystander intervention"`
16. `"protected disclosure"`

*Dissatisfaction / intent signals (rich buying moment):*
17. `"despite the training"`  ·  `"despite training" "still happening"`
18. `"on paper" "in practice"`
19. `"reasonable steps" "harassment"`  ·  `"reasonable steps" "employer"` (anchor the domain — `"reasonable steps" "evidence"` drifts off-topic)
20. `"preventative duty" "harassment"`

*Cross-sector (Social Housing, Healthcare, Contact Centres):*
21. `"psychosocial risk"`  ·  `"ISO 45003"`
22. `"third-party harassment"`
23. `"safeguarding" "manager"`
24. `"vulnerable customer" "manager"`  ·  `"vulnerable tenant"`

### Path 2 — Leadership & Manager Development

*Knowing-doing & readiness:*
25. `"knowing-doing gap"`
26. `"froze" "conversation"`
27. `"first-time manager"`  ·  `"thrown in at the deep end"`
28. `"accidental manager"`  ·  `"reluctant manager"`
29. `"new manager" "first 90 days"`

*Manager scenarios:*
30. `"difficult conversations" "manager"`
31. `"crucial conversations"`
32. `"tough feedback"`
33. `"performance conversation"`
34. `"underperformance" "manager"`
35. `"performance improvement plan"`
36. `"return to work conversation"`
37. `"stay interview"`  ·  `"retention conversation"`

*L&D jargon (highest practitioner density):*
38. `"learning transfer"`  ·  `"training transfer"`
39. `"behaviour change" "manager"`
40. `"manager as coach"`
41. `"70-20-10"`
42. `"capability framework"`  ·  `"competency framework"`
43. `"Kirkpatrick" "level 3"`
44. `"learning in the flow of work"`
45. `"CIPD" "research"`
46. `"Learning Technologies" "L&D"` → use `"Learning Technologies" "learning"`  ·  `"World of Learning"`

*Programme & workshop frustration:*
47. `"leadership programme" "didn't stick"`
48. `"back to old habits" "training"`
49. `"peer role play"`  ·  `"role play" "awkward"`
50. `"management training" "doesn't work"`

*Frontline & manager-population:*
51. `"line manager" "capability"`
52. `"frontline manager" "development"`
53. `"people manager" "development"`
54. `"manager effectiveness"`

### Path 3 — Solution-aware (pick 4–6)

Route by poster role: HR/L&D → CHRO; Compliance → Compliance; partners → Law Firm; vendors → Influencer.
55. `"AI roleplay"`  ·  `"AI role-play"`
56. `"roleplay" "learning"`
57. `"conversation simulation"`
58. `"learning simulation"`  ·  `"behavioural simulation"`
59. `"scenario-based learning"`
60. `"AI coaching"`
61. `"AI tutor"`  ·  `"AI mentor"`
62. `"generative AI" "learning"`
63. `"immersive learning"`
64. `"deliberate practice" "conversation"`
65. `"rehearse" "difficult conversation"`
66. `"practice platform" "training"`
67. `"safe to practise"`  ·  `"safe to practice"`
68. `"coaching at scale"`

### Path 4 — Status-quo challenge (pick 4–6)

Same routing by poster role.
69. `"tick box" "training"`  ·  `"tick-box training"`
70. `"mandatory training" "doesn't work"`
71. `"compliance training" "broken"`
72. `"e-learning" "doesn't work"`
73. `"sheep dip" "training"`
74. `"one and done" "training"`
75. `"training fatigue"`
76. `"completion rates" "meaningless"`
77. `"doesn't prove competence"`
78. `"rethinking compliance"`  ·  `"rethinking learning"`
79. `"future of compliance"`  ·  `"future of learning"`
80. `"is training enough"`  ·  `"is e-learning enough"`

**(Path 5 active-buyer searches have moved to the separate active-buyer job.)**

## Audience B — Compliance (Track 1 keyword + Track 2 mining)

Time inside B: ~40% Track 1, ~60% Track 2. **Track 1 sampling: TWO from each of the six clusters = 12 searches. Prioritise Dissatisfaction and Evidence/Assurance clusters.**

*Regulatory vocabulary:*
81. `"three lines of defence"`  ·  `"three lines of defense"`
82. `"second line" "assurance"`
83. `"SMCR"`  ·  `"Senior Managers Certification Regime"`
84. `"fit and proper" "certification"`
85. `"SYSC"`
86. `"regulatory change" "horizon scanning"`
87. `"control testing"`  ·  `"controls effectiveness"`
88. `"risk appetite" "conduct"`

*FCA enforcement & thematic (buying triggers):*
89. `"FCA enforcement"`  ·  `"FCA fine"`
90. `"Dear CEO letter"`
91. `"thematic review" "FCA"`
92. `"section 166"`  ·  `"skilled person review"`
93. `"warning notice" "FCA"`
94. `"final notice" "FCA"`
95. `"regulatory breach"`

*Conduct, culture & people-risk:*
96. `"conduct risk" "culture"`
97. `"compliance culture"`  ·  `"culture of compliance"`
98. `"people risk" "compliance"`  ·  `"behavioural risk"`
99. `"non-financial misconduct"`  ·  `"PS25/23"`
100. `"harassment" "SMCR"`
101. `"conduct rules" "breach"`

*Evidence, assurance & monitoring (direct pitch territory — prioritise):*
102. `"evidence of competence"`
103. `"compliance monitoring"`  ·  `"monitoring plan"`
104. `"compliance testing"`  ·  `"assurance testing"`
105. `"audit readiness"`  ·  `"FCA visit"`
106. `"board reporting" "compliance"`
107. `"compliance MI"`
108. `"assurance framework"`  ·  `"assurance mapping"`

*Specific risk areas (deadline-driven):*
109. `"Consumer Duty" "vulnerable customers"`
110. `"Consumer Duty" "year 2"`  ·  `"Consumer Duty" "year 3"`
111. `"Worker Protection Act" "compliance"`
112. `"financial promotions" "compliance"`
113. `"conflicts of interest" "training"`
114. `"market abuse" "training"`
115. `"operational resilience" "testing"`

*Dissatisfaction / intent signals (prioritise):*
116. `"compliance theatre"`  ·  `"tick box" "compliance"`
117. `"paper compliance"`
118. `"compliance fatigue"`  ·  `"compliance burden"`
119. `"beyond training" "compliance"`
120. `"compliance training" "not enough"`
121. `"completion rate" "compliance"`

**Track 2 — Engagement mining:** find high-engagement (20+ reactions) vendor/law-firm posts on these topics, open them, scan comments for ICP practitioners. Record the COMMENTER as the lead; their comment → Post topic; the draft reply references their comment (playbook §4 Track-2 shape). Note "Found via comment on [firm]'s post."

## Audience D — Law Firm (inherits searches + named watchlist + Track-2)

**No own searches** — every Path 1–4 and Track-1 search throws off law-firm content. Anything authored by a Partner / Senior Associate / Knowledge Counsel / PSL / Employment Lawyer / Barrister at a recognisable firm routes here. **25+ reactions.** Skip ads, firm-promo, boilerplate legal updates.

**Named-account watchlist (scan last 48h at run start):** Top tier — Lewis Silkin, Pinsent Masons, Eversheds Sutherland, Hogan Lovells, DLA Piper UK, Clyde & Co, Bates Wells, Mishcon de Reya, Fox Williams, Dentons UK. Second tier — Linklaters, Slaughter and May, A&O Shearman, Freshfields, Norton Rose Fulbright, CMS UK, Travers Smith, Macfarlanes, Withers, Stevens & Bolton. Append named individual lawyers as they surface (25+ reactions on ICP posts).

**Track 2 on Law Firm — the single highest-yield move the scan can make.** For ANY law-firm post with 50+ reactions, scan comments for CHRO-side / Compliance-side practitioners and route them to CHRO or Compliance. One strong Lewis Silkin / Pinsent Masons Worker-Protection post can surface 5+ qualified Heads of ER or Compliance in one pass — better than any keyword search.

Comment tailoring: legal precision. Reference the specific case / regulator phrase / tribunal finding the lawyer used; ask a question that probes the practical employer-side implication, not the legal mechanic.

## Audience C — Influencer (inherits searches + modifiers + named watchlist + Track-2)

Vendors / consultants / Big 4 / publications / non-lawyer thought leaders, **30+ reactions** (50+ gold, 100+ great). Stages, not leads. Skip anything 25–29 (floor moved). Inherited A+B vendor results auto-route here if they clear 30+.

**Influencer modifiers (pick 4–6):**
122. `"our research" "HR"`  ·  `"new report" "compliance"`
123. `"survey findings" "HR"`
124. `"2026 trends" "HR"`  ·  `"predictions" "compliance"`
125. `"benchmark report" "HR"`
126. `"data shows" "managers"`
127. `"five things" "HR"`  ·  `"what every CHRO"`
128. `"what we're seeing" "HR"`
129. `"case study" "harassment"`

**Named-account watchlist (scan last 48h at run start):** Big 4 — Deloitte People Advisory, PwC People & Organisation, KPMG People, EY People, Mercer UK, Korn Ferry, BearingPoint. Compliance/publications — UK Finance, Compliance Week, Thomson Reuters Regulatory Intelligence, City A.M. regulation, Financial News. HR/L&D bodies — CIPD, People Management, Personnel Today, HR Grapevine, HR Magazine, Training Journal, LPI, Learning Technologies. Named thought leaders — Sarah Jackman, Jo Morgan, Sue Saunders, Jessie Jones (append new 30+ faces).

**Track 2 on Influencer — do aggressively.** For ANY Influencer post with 50+ reactions, scan comments for CHRO / Compliance / Law Firm practitioners and route them. One strong Big 4 post can surface 5+ qualified practitioners.

## Step 2.5 — Liker extraction (MANDATORY, ICP-only)

This is the single most commonly forgotten step and the most efficient lead source — likers have pre-qualified themselves by reacting to an ICP post. **Run it on every candidate post with 10+ reactions.** Legitimate skips: post has <10 reactions, post unreachable, or every reactor is non-ICP — each must be noted in run notes. Any other skip is a failure.

After the day's candidates are locked but BEFORE writing HTML:

1. **Navigate to each candidate post.** Preferred: `https://www.linkedin.com/in/<real-slug>/recent-activity/all/` if a real slug was confirmed. Fallback: re-run the keyword search that surfaced it. If neither works, skip that one and note "liker extraction skipped — post not directly reachable."
2. **Open the reactions modal by clicking the reaction COUNT number, never the Like button** (the Like button registers Toby as a reactor). If the modal won't open, try the three-dots overflow; do NOT click Like. If an accidental Like registers, capture the other reactors anyway and flag prominently: "needs manual unlike before public comment."
3. **Capture each reactor:** name, full headline, degree, company. Scroll within the modal until no new entries load.
4. **Exclude:** Toby himself; company pages (logo + "X followers", no person); obviously off-ICP roles; **Influencer-tier reactors** (vendors, consultants, recruiters, Big 4, journalists, generic thought leaders) — they are stages, not leads. Keep law-firm partners (Audience D).
5. **Route kept reactors to one of three audiences only — CHRO / Compliance / Law Firm** (see playbook §3). Gold-standard examples: Verdun Moar (Speak Up Lead, Lloyds) and Kate Hinchy (Head of Audit — Conduct & Regulatory Compliance, Santander) → Compliance. Drop everything else. If every reactor is non-ICP, note "Liker extraction on [Poster]'s post: 0 ICP reactors out of N."
6. **Draft one DM-style message per kept reactor** (playbook §6 liker-DM shape) and render a liker card (playbook §7 liker template). Insert liker cards after the candidate cards, numbered continuously.

## Audience tailoring (Step 3)

- **CHRO:** lead with business / people / regulatory-risk consequence; patterns across HR leaders.
- **Compliance:** evidence / stress-test / activity-vs-outcomes; the most credible voice.
- **Law Firm:** legal precision; reference the case / regulator frame; push the employer-side question.
- **Influencer:** practitioner angle that complements, not competes with, the poster's point.

Prioritise posts where Toby has a genuine perspective to add.

## Write & push

1. Build today's `<section class="day" data-date="YYYY-MM-DD">` (playbook §7 wrapper). Candidate cards ordered **CHRO → Compliance → Law Firm → Influencer**, then **liker cards (CHRO / Compliance / Law Firm only)**. Number 1..N across the whole day; first liker is N+1.
2. Insert after `<!-- NEWEST-DAY-INSERT-BELOW -->` in `index.html`. Don't modify prior days, the head/style/script/toolbar, or any other page. If the toolbar lacks a Law Firm chip, still emit `data-audience="law-firm"` cards (they show under All) and flag in run notes.
3. End with `<div class="run-notes">`: dry searches, automation issues, strongest picks, near-threshold flags, AND the mandatory liker-pass addendum (candidates ≥10 reactions vs skipped, modals opened, liker cards created vs reactors skipped and why — including Influencer-tier filtered out — any accidental-Like incidents).
4. Commit + push per playbook §2 (`git config user.name "linkedin-engagement"`, `git add index.html`).
5. If push fails, surface stderr and STOP. No local fallback. If the run yields little, still write a short day section and push so the run is logged.
