# Oeconomia Weekly Dev Report Agent

## Task: Weekly Development Report Generation

You are an automated reporting agent for the Oeconomia DeFi ecosystem. Every week, you generate two artifacts:
1. A **detailed internal devlog** (full technical summary)
2. A **short public update** (3-5 bullets for community/Twitter)

Then you update the GitHub Pages site index so the new report is discoverable.

---

## Step 1 — Gather Data

Run the following to collect raw data. The repos to scan are defined in `scripts/config.json`.

```bash
# Load config
cat scripts/config.json

# Git log for each repo (past 7 days)
git -C <REPO_PATH> log --since="7 days ago" --oneline --no-merges --all

# Files changed (for context)
git -C <REPO_PATH> diff --stat HEAD~20 HEAD 2>/dev/null || true

# Any manual notes dropped in scripts/notes.md this week
cat scripts/notes.md 2>/dev/null || echo "(no manual notes)"
```

---

## Step 2 — Generate Detailed Devlog

Write a file to: `docs/devlogs/DEVLOG_<YEAR>-W<WEEK>.md`

Use this template exactly:

```markdown
---
week: <YEAR>-W<WEEK>
date_range: <MON DD> – <MON DD, YYYY>
generated: <ISO timestamp>
---

# 🛠 Oeconomia Devlog — Week <WEEK>, <YEAR>

## Summary
<2-3 sentence overview of the week's theme/momentum>

## ✅ Completed

### Smart Contracts
- <item>

### Frontend / DApp
- <item>

### Infrastructure / Tooling
- <item>

### Documentation
- <item>

## 🔄 In Progress
- <item with % or status>

## 🐛 Issues Encountered & Resolved
- <item>

## 📐 Decisions Made
- <item — include rationale>

## 📅 Next Week Goals
- <item>

## 📊 Metrics (if applicable)
- Testnet transactions: 
- Contracts deployed: 
- GitHub commits: 
```

---

## Step 3 — Generate Public Update

Write a file to: `docs/updates/UPDATE_<YEAR>-W<WEEK>.md`

Use this template:

```markdown
---
week: <YEAR>-W<WEEK>
date_range: <MON DD> – <MON DD, YYYY>
---

# Oeconomia Update — Week <WEEK>

<One punchy sentence about the week>

**This week:**
- ✅ <accomplishment 1>
- ✅ <accomplishment 2>
- ✅ <accomplishment 3>
- 🔄 <in progress item>
- 🎯 <next big milestone>

[→ Full devlog](<link to DEVLOG md on GitHub Pages>)

---
*Building Oeconomia — a multi-protocol DeFi ecosystem. Follow along.*
```

---

## Step 4 — Update Site Index

Read `docs/index.json` and prepend a new entry:

```json
{
  "week": "<YEAR>-W<WEEK>",
  "date_range": "<MON DD> – <MON DD, YYYY>",
  "devlog": "devlogs/DEVLOG_<YEAR>-W<WEEK>.md",
  "update": "updates/UPDATE_<YEAR>-W<WEEK>.md",
  "summary": "<one sentence from the public update>"
}
```

Then regenerate `docs/index.html` by running:
```bash
node scripts/build-index.js
```

---

## Step 5 — Commit & Push

```bash
cd /path/to/oeconomia-devlog
git add docs/
git commit -m "chore: weekly report <YEAR>-W<WEEK>"
git push origin main
```

GitHub Actions will then deploy to GitHub Pages automatically.

---

## Notes
- Keep the public update Twitter-friendly (short, punchy, no jargon walls)
- If a section has no activity, write "None this week" — don't skip it
- Decisions Made is the most important section — always fill it out
- Clear `scripts/notes.md` after each run by writing an empty file
