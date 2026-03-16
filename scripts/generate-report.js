// scripts/generate-report.js
// Calls Claude API to generate weekly devlog + public update

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ── Helpers ──────────────────────────────────────────────────────────────────

function getWeekInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);

  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dateRange = `${fmt(weekAgo)} – ${fmt(now)}, ${year}`;

  return { year, week: String(week).padStart(2, '0'), dateRange, iso: now.toISOString() };
}

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch { return ''; }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { year, week, dateRange, iso } = getWeekInfo();
  const weekKey = `${year}-W${week}`;

  console.log(`Generating report for ${weekKey} (${dateRange})`);

  // Gather inputs
  const gitActivity = readFile(process.env.GIT_ACTIVITY_FILE || '/tmp/git_activity.txt');
  const manualNotes = readFile(path.join(ROOT, 'scripts/notes.md'));
  const config = JSON.parse(readFile(path.join(ROOT, 'scripts/config.json')) || '{}');

  const systemPrompt = `You are a technical writer for Oeconomia, a self-funded multi-protocol DeFi ecosystem.
The founder is a solo developer building: OEC token (500M supply presale/staking), Eloqura DEX,
Alluria lending protocol (Liquity-style CDP with ALUD stablecoin), and staking infrastructure.
Write with clarity and technical precision. Be specific about what changed, never vague.
IMPORTANT: Never use em dashes or long hyphens. Use colons, commas, or separate sentences instead. Regular hyphens for hyphenated words are fine.`;

  const userPrompt = `Generate a weekly development report for week ${weekKey} (${dateRange}).

## Git Activity This Week
${gitActivity || '(no git activity data available)'}

## Manual Notes
${manualNotes || '(none)'}

## Project Context
${JSON.stringify(config.context || {}, null, 2)}

---

Return ONLY a JSON object with exactly these two keys, no markdown fences, no preamble:

{
  "devlog": "<full markdown content for detailed devlog>",
  "update": "<full markdown content for short public update>",
  "summary": "<one sentence summary of the week, under 120 chars>"
}

For the devlog, use this structure:
---
week: ${weekKey}
date_range: ${dateRange}
generated: ${iso}
---

# Oeconomia Devlog: Week ${week}, ${year}

## Summary
[2-3 sentences on the week's theme]

## ✅ Completed
### Smart Contracts
[bullets]
### Frontend / DApp
[bullets]
### Infrastructure / Tooling
[bullets]
### Documentation
[bullets]

## 🔄 In Progress
[bullets with status]

## 🐛 Issues Encountered & Resolved
[bullets]

## 📐 Decisions Made
[bullets with rationale]

## 📅 Next Week Goals
[bullets]

## 📊 Metrics
- GitHub commits this week: [count from git log]
- Contracts touched: [list]
- Repos active: [list]

---

For the public update use this structure:
---
week: ${weekKey}
date_range: ${dateRange}
---

# Oeconomia Update: Week ${week}

[One punchy sentence]

**This week:**
- ✅ [accomplishment]
- ✅ [accomplishment]
- ✅ [accomplishment]
- 🔄 [in progress]
- 🎯 [next milestone]

[→ Full devlog](https://oeconomia.github.io/oeconomia-devlog/devlogs/DEVLOG_${weekKey}.html)

---
*Building Oeconomia, a multi-protocol DeFi ecosystem. Follow the journey.*`;

  // Call Claude API
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.content.find(b => b.type === 'text')?.text || '';

  let parsed;
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(clean);
  } catch (e) {
    console.error('Failed to parse Claude response:', raw);
    throw new Error('Claude did not return valid JSON');
  }

  // Write devlog
  ensureDir(path.join(ROOT, 'docs/devlogs'));
  const devlogPath = path.join(ROOT, `docs/devlogs/DEVLOG_${weekKey}.md`);
  fs.writeFileSync(devlogPath, parsed.devlog);
  console.log(`✅ Devlog written: ${devlogPath}`);

  // Write public update
  ensureDir(path.join(ROOT, 'docs/updates'));
  const updatePath = path.join(ROOT, `docs/updates/UPDATE_${weekKey}.md`);
  fs.writeFileSync(updatePath, parsed.update);
  console.log(`✅ Update written: ${updatePath}`);

  // Update index.json
  const indexPath = path.join(ROOT, 'docs/index.json');
  const existing = JSON.parse(readFile(indexPath) || '[]');
  const newEntry = {
    week: weekKey,
    date_range: dateRange,
    devlog: `devlogs/DEVLOG_${weekKey}.md`,
    update: `updates/UPDATE_${weekKey}.md`,
    summary: parsed.summary
  };
  // Prevent duplicate entries
  const filtered = existing.filter(e => e.week !== weekKey);
  fs.writeFileSync(indexPath, JSON.stringify([newEntry, ...filtered], null, 2));
  console.log(`✅ index.json updated`);
}

main().catch(err => {
  console.error('Report generation failed:', err);
  process.exit(1);
});
