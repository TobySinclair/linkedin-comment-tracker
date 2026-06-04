# LinkedIn Discovery Scan (140-keyword corpus → candidate cards)

Automated run. Toby is not present — execute autonomously, make reasonable choices, note anything unusual in the run notes. Do NOT post comments on LinkedIn; Toby reviews and posts manually.

**What this job is (simplified):** run the full keyword corpus below — **every query, every run** — and sort each post you surface into one of four ICP groups **by the poster's role**. Draft a comment and a connection note for the strongest candidates, capture a re-reachable post reference, and write candidate cards. That's the whole job. There are **no named-account watchlists and no Track-2 comment-mining** — both were removed to keep the job simple and fast.

**Cadence:** a few times a week. This is stage 1 of a two-stage pipeline: this job DISCOVERS candidates (keyword searches) and drafts their comments; the paired `liker-job.md` runs straight after and appends liker cards. Buyer-intent and new-in-role moves are separate faster jobs — this job is the topic-engagement signal only.

## Objective

Run all ~140 keyword searches and produce candidate cards across **four audiences**, written to `index.html`. Sort every result by the POSTER'S ROLE (full definitions live in **playbook §3** — read it; don't re-derive them here):

- **CHRO / HR buyer** (highest priority) — HR / L&D / Talent / OD / People Risk / ER / People Director / CPO / CHRO / Head of HR at 500+ UK firms. Tier-1: FS, Social Housing, Healthcare, Contact Centres / BPO.
- **Compliance** — Head of Compliance, CCO, Director of Compliance, Head of Risk & Compliance, + Customer Outcomes, General Counsel, Internal Audit, NED with risk oversight. UK-regulated, FCA primary.
- **Law Firm** — UK employment-law partners, senior associates, PSLs, knowledge counsel at recognisable firms. **25+ reactions.**
- **Influencer** — vendors, consultants, recruiters, Big 4, publications, non-lawyer thought leaders. **30+ reactions.** Stages, not leads.

**Route by who wrote the post, not by the topic of the keyword.** The same keyword feeds different groups: a "non-financial misconduct" search might surface a Head of ER (→ CHRO), a compliance officer (→ Compliance), an employment partner (→ Law Firm) and a vendor (→ Influencer) — each routes to its own group. Law Firm and Influencer are populated entirely by routing posts the keyword corpus surfaces; they have no separate search list of their own beyond the Influencer modifiers (122–129).

Aim for the strongest **8–12 candidates** across the four groups (roughly 3 per group, but take what the week actually gives — quality over quantity). If a run yields little, still write a short day section and push so the run is logged.

## Setup

1. Clone the repo (playbook §1; bootstrap supplies `$PAT` and `$WORK`).
2. Read `${WORK}/playbook.md` in full.
3. This job's page = **`index.html`**. Touch only this page. (Other jobs own their own pages — never touch those.)
4. Read the last 7 days of `data-id` values in `index.html`; do not duplicate posters or posts. Match the tone of any draft comments Toby edited in place.
5. Navigate to https://www.linkedin.com/feed/ to confirm login. Login wall → stop and surface a clear error.

## Run budget — run the FULL corpus every run

**Run every query in the corpus below on each run. No sampling, no rotation.** The `·`-separated lines each hold 2–3 distinct queries; run every one. That's roughly 140 queries total.

- Use the **past-week filter** and **relevance sort**. Relevance surfaces far better ICP yield; latest-sort returns near-zero-engagement brand-new posts and should be avoided.
- **Pace the searches to avoid rate limiting.** Batch navigation (≈3 searches per call) but do NOT fire hundreds of requests back-to-back. If LinkedIn starts returning empty results across queries that normally hit, or shows a security checkpoint, STOP, note it in the run notes, and push what you have — a soft block is a loud failure, not something to push through.
- **Read every result page but be ruthless about candidates.** 140 queries surface far more posts than you need; pick the 8–12 strongest, not one per query. More searches means a better shortlist, not more cards.
- **Geography:** keep only UK (regulated for Compliance). Discard high-engagement foreign posts.

## Search syntax (IMPORTANT — read before searching)

The corpus is written away from boolean `OR` chains (LinkedIn content search handles them poorly) and ampersands (`L&D` breaks matching). Every query is either a single specific quoted phrase or **two quoted phrases where the second anchors the domain**. Tested rules:

- Two short quoted phrases works: `"Acas" "grievance"` returns real UK ER practitioners.
- The second phrase MUST anchor the domain for polysemous terms. `"reasonable steps" "evidence"` drifts into trucking-safety / ESG; `"reasonable steps" "harassment"` stays on-topic.
- Never use bare `OR` between unquoted words, and never use `&` (write `"learning and development"`, not `L&D`).
- Where a single phrase is specific enough on its own (`"dignity at work"`, `"three lines of defence"`, `"training fatigue"`), use it alone.
- If a query returns junk, flag it in the run notes so the corpus can be tuned.

---

## The keyword corpus (run all)

### Path 1 — HR compliance & risk

*Regulation & enforcement:*
1. `"Worker Protection Act" "all reasonable steps"`
2. `"non-financial misconduct"`  ·  `"COCON"`
3. `"Employment Rights Act" "employer"`
4. `"EHRC" "employer"`  ·  `"EHRC" "harassment"`
5. `"tribunal" "harassment"`  ·  `"tribunal" "bullying"`

*Investigation & casework:*
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

*Dissatisfaction / intent signals:*
17. `"despite the training"`  ·  `"despite training" "still happening"`
18. `"on paper" "in practice"`
19. `"reasonable steps" "harassment"`  ·  `"reasonable steps" "employer"`
20. `"preventative duty" "harassment"`

*Cross-sector (Social Housing, Healthcare, Contact Centres):*
21. `"psychosocial risk"`  ·  `"ISO 45003"`
22. `"third-party harassment"`
23. `"safeguarding" "manager"`
24. `"vulnerable customer" "manager"`  ·  `"vulnerable tenant"`

### Path 2 — Leadership & manager development

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

*L&D jargon:*
38. `"learning transfer"`  ·  `"training transfer"`
39. `"behaviour change" "manager"`
40. `"manager as coach"`
41. `"70-20-10"`
42. `"capability framework"`  ·  `"competency framework"`
43. `"Kirkpatrick" "level 3"`
44. `"learning in the flow of work"`
45. `"CIPD" "research"`
46. `"Learning Technologies" "learning"`  ·  `"World of Learning"`

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

### Path 3 — Category-defining / solution-aware

**This is Real Talk Studio's exact category.** These return a MIX — route by poster role: a vendor marketing their own AI roleplay/sim product → Influencer; a practitioner (Head of L&D / HR / Compliance) exploring the category → CHRO or Compliance; a partner → Law Firm. Triage hard — the leads are the practitioners, not the vendors. Pair bare `"AI"` with a conversation type or skill; category names like `"AI roleplay"` are specific enough alone.

*Core category names:*
55. `"AI roleplay"`  ·  `"AI role-play"`  ·  `"AI role play"`
56. `"AI simulation"`  ·  `"AI simulations"`  ·  `"roleplay simulation"`
57. `"conversation simulation"`  ·  `"conversational simulation"`
58. `"immersive roleplay"`  ·  `"virtual roleplay"`  ·  `"digital roleplay"`

*AI + conversation type:*
59. `"AI" "difficult conversations"`  ·  `"AI" "hard conversations"`
60. `"AI" "manager conversations"`  ·  `"AI" "crucial conversations"`
61. `"AI" "feedback conversations"`  ·  `"AI" "performance conversations"`  ·  `"AI" "coaching conversations"`

*AI + practice / skills:*
62. `"practice with AI"`  ·  `"rehearse with AI"`
63. `"AI" "communication skills"`  ·  `"AI" "soft skills"`  ·  `"AI" "leadership practice"`
64. `"AI coaching"`  ·  `"AI coach"`  ·  `"AI tutor"`  ·  `"AI mentor"`

*Simulation / scenario / practice platform:*
65. `"learning simulation"`  ·  `"behavioural simulation"`  ·  `"scenario-based learning"`
66. `"deliberate practice" "conversation"`  ·  `"rehearse" "difficult conversation"`
67. `"practice platform" "training"`  ·  `"safe to practise"`  ·  `"safe to practice"`
68. `"generative AI" "learning"`  ·  `"immersive learning"`  ·  `"coaching at scale"`  ·  `"roleplay" "learning"`

*Roleplay & conversation practice — non-tech versions (run all):*
- `"manager roleplay"`  ·  `"manager role play"`  ·  `"manager role-play"`
- `"leadership roleplay"`  ·  `"roleplay exercise"`  ·  `"roleplay scenarios"`
- `"difficult conversations roleplay"`  ·  `"difficult conversation role play"`
- `"practice conversations"`  ·  `"practise conversations"`  ·  `"conversation practice"`
- `"practice difficult conversations"`  ·  `"practise difficult conversations"`
- `"rehearse conversations"`  ·  `"rehearsing difficult conversations"`
- `"handling difficult conversations"`  ·  `"having difficult conversations"`  ·  `"navigating difficult conversations"`
- `"difficult conversations training"`  ·  `"difficult conversations workshop"`
- `"crucial conversations training"`  ·  `"courageous conversations"`
- `"communication skills practice"`  ·  `"soft skills practice"`  ·  `"skills rehearsal"`

### Path 4 — Status-quo challenge

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

### Compliance — regulatory corpus

*Regulatory vocabulary:*
81. `"three lines of defence"`  ·  `"three lines of defense"`
82. `"second line" "assurance"`
83. `"SMCR"`  ·  `"Senior Managers Certification Regime"`
84. `"fit and proper" "certification"`
85. `"SYSC"`
86. `"regulatory change" "horizon scanning"`
87. `"control testing"`  ·  `"controls effectiveness"`
88. `"risk appetite" "conduct"`

*FCA enforcement & thematic:*
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

*Evidence, assurance & monitoring:*
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

*Dissatisfaction / intent signals:*
116. `"compliance theatre"`  ·  `"tick box" "compliance"`
117. `"paper compliance"`
118. `"compliance fatigue"`  ·  `"compliance burden"`
119. `"beyond training" "compliance"`
120. `"compliance training" "not enough"`
121. `"completion rate" "compliance"`

### Influencer modifiers (run all)

These tend to surface vendors / consultants / Big 4 / publications / thought leaders. Route them to Influencer if they clear 30+ reactions; if a practitioner posts one, route by their role as normal.
122. `"our research" "HR"`  ·  `"new report" "compliance"`
123. `"survey findings" "HR"`
124. `"2026 trends" "HR"`  ·  `"predictions" "compliance"`
125. `"benchmark report" "HR"`
126. `"data shows" "managers"`
127. `"five things" "HR"`  ·  `"what every CHRO"`
128. `"what we're seeing" "HR"`
129. `"case study" "harassment"`

---

## Handoff requirement — capture a re-reachable post reference for every candidate

The paired liker job has to navigate back to each candidate's post to open its reactions modal, so each candidate card MUST carry enough to re-find the post:

1. **Confirm the real profile slug wherever it appears in the search-result HTML** and put a `https://www.linkedin.com/in/<real-slug>/recent-activity/all/` URL in the card's Link field (playbook §9 allows this as an upgrade over the people-search URL). Prioritise capturing it.
2. If no real slug is available, leave the people-search Link as normal but make the **Post topic** field specific enough that the liker job can identify the exact post on the person's activity feed.
3. Record the reaction count in the **Engagement** field so the liker job can apply its 10+ threshold without re-judging.

## Audience tailoring (drafting the comment)

- **CHRO:** lead with business / people / regulatory-risk consequence; patterns across HR leaders.
- **Compliance:** evidence / stress-test / activity-vs-outcomes; the most credible voice.
- **Law Firm:** legal precision; reference the case / regulator frame; push the employer-side question.
- **Influencer:** practitioner angle that complements, not competes with, the poster's point.

Prioritise posts where Toby has a genuine perspective to add. Comment + connection-note voice lives in **playbook §4 and §5** — follow them exactly.

## Liker extraction is NOT part of this job

Liker extraction is a **separate paired job** — `liker-job.md`, run right after this one. It reads the candidate cards this job writes and appends liker cards to the same day section. Do NOT do liker extraction here; this job stops at candidate cards + drafts.

## Write & push

1. Build today's `<section class="day" data-date="YYYY-MM-DD">` (playbook §7 wrapper). **Candidate cards only**, ordered **CHRO → Compliance → Law Firm → Influencer**, numbered 1..N. No liker cards.
2. Insert after the day-insert marker in `index.html`. Don't modify prior days, the head/style/script/toolbar, or any other page. (Note: the marker comment in the file reads `<!-- NEWEST-DAY-INSERT: ... -->`, not `<!-- NEWEST-DAY-INSERT-BELOW -->`.)
3. End with `<div class="run-notes">`: which queries ran, dry/junk queries, strongest picks, near-threshold flags, and — for the liker job's benefit — note how many candidates cleared 10+ reactions and whether each got a confirmed profile slug or only a people-search link.
4. Commit + push per playbook §2 (`git config user.name "linkedin-discovery"`, `git add index.html`).
5. If push fails, surface stderr and STOP. No local fallback. If the run yields little, still write a short day section and push so the run is logged.
6. **Then run the paired stage-2 jobs** against today's section: `liker-job.md` (appends liker cards from reactors) and `comment-mining-job.md` (appends comment-miner cards from commenters).
