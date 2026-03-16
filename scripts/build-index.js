// scripts/build-index.js
// Reads docs/index.json and generates the full GitHub Pages site (index.html)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

function readFile(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

function mdToHtml(md) {
  // Minimal markdown → HTML for the detail pages
  return md
    .replace(/^---[\s\S]*?---\n/m, '') // strip frontmatter
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '')
    .trim();
}

const entries = JSON.parse(readFile(path.join(DOCS, 'index.json')) || '[]');

// ── Generate individual devlog HTML pages ─────────────────────────────────────

for (const entry of entries) {
  const mdPath = path.join(DOCS, entry.devlog);
  const md = readFile(mdPath);
  if (!md) continue;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Oeconomia Devlog: ${entry.week}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --border: #1e1e2e;
    --accent: #00ff88;
    --accent2: #7b6cff;
    --text: #e2e2f0;
    --muted: #6e6e8a;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; padding: 2rem; line-height: 1.7; }
  .back { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--accent); text-decoration: none; display: inline-block; margin-bottom: 2rem; letter-spacing: 0.05em; }
  .back:hover { opacity: 0.7; }
  article { max-width: 760px; margin: 0 auto; }
  h1 { font-size: 2rem; font-weight: 800; color: var(--accent); margin-bottom: 0.5rem; }
  h2 { font-size: 1.2rem; font-weight: 700; color: var(--accent2); margin: 2rem 0 0.75rem; border-bottom: 1px solid var(--border); padding-bottom: 0.4rem; }
  h3 { font-size: 1rem; font-weight: 700; color: var(--text); margin: 1.25rem 0 0.5rem; }
  ul { padding-left: 1.5rem; margin: 0.5rem 0; }
  li { margin: 0.25rem 0; color: var(--text); }
  p { margin: 0.75rem 0; color: var(--muted); }
  strong { color: var(--text); }
  a { color: var(--accent); }
  pre, code { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; background: var(--surface); padding: 0.2em 0.4em; border-radius: 3px; }
  .meta { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--muted); margin-bottom: 2rem; }
</style>
</head>
<body>
<article>
  <a class="back" href="../../index.html">← all updates</a>
  <p class="meta">${entry.date_range} · ${entry.week}</p>
  ${mdToHtml(md)}
</article>
</body>
</html>`;

  const outPath = mdPath.replace('.md', '.html');
  fs.writeFileSync(outPath, html);
}

// ── Generate main index.html ──────────────────────────────────────────────────

const cards = entries.map((e, i) => `
  <article class="card ${i === 0 ? 'latest' : ''}">
    <div class="card-meta">
      <span class="week-tag">${e.week}</span>
      <span class="date-range">${e.date_range}</span>
    </div>
    <p class="summary">${e.summary || ''}</p>
    <div class="card-links">
      <a class="btn-primary" href="${e.devlog.replace('.md', '.html')}">Full Devlog →</a>
      <a class="btn-secondary" href="${e.update}">Public Update</a>
    </div>
  </article>`).join('\n');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Oeconomia: Dev Updates</title>
<meta name="description" content="Weekly development logs for the Oeconomia DeFi ecosystem: OEC token, Eloqura DEX, Alluria lending protocol.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #06060d;
    --surface: #0d0d18;
    --surface2: #12121f;
    --border: #1a1a2e;
    --accent: #00ff88;
    --accent2: #7b6cff;
    --accent3: #ff6b6b;
    --text: #e8e8f8;
    --muted: #5a5a7a;
    --muted2: #3a3a5a;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Grid background */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
  }

  .glow-orb {
    position: fixed;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%);
    top: -200px;
    left: -200px;
    pointer-events: none;
    z-index: 0;
  }
  .glow-orb-2 {
    position: fixed;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(123,108,255,0.05) 0%, transparent 70%);
    bottom: -150px;
    right: -100px;
    pointer-events: none;
    z-index: 0;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }

  /* Header */
  header {
    padding: 4rem 0 3rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 3rem;
  }

  .logo-line {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: var(--accent);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-line::before {
    content: '';
    display: block;
    width: 24px;
    height: 2px;
    background: var(--accent);
  }

  h1.site-title {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
  }

  .title-eco { color: var(--text); }
  .title-nomia { color: var(--accent); }

  .site-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    color: var(--muted);
    max-width: 480px;
    line-height: 1.6;
  }

  .tag-row {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }

  .tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    padding: 0.25rem 0.6rem;
    border: 1px solid var(--border);
    border-radius: 2px;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  .tag.active { border-color: var(--accent); color: var(--accent); }

  /* Cards */
  .updates-grid {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 4rem;
  }

  .card {
    background: var(--surface);
    padding: 1.75rem 2rem;
    transition: background 0.2s;
    position: relative;
  }

  .card:hover { background: var(--surface2); }

  .card.latest {
    background: var(--surface2);
    border-left: 3px solid var(--accent);
  }

  .card.latest::before {
    content: 'LATEST';
    position: absolute;
    top: 1.75rem;
    right: 2rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    color: var(--accent);
    letter-spacing: 0.15em;
    border: 1px solid var(--accent);
    padding: 0.15rem 0.4rem;
    border-radius: 2px;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .week-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--accent2);
  }

  .date-range {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    color: var(--muted);
  }

  .summary {
    color: var(--text);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1.25rem;
    max-width: 600px;
  }

  .card-links {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .btn-primary {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--bg);
    background: var(--accent);
    padding: 0.4rem 0.85rem;
    border-radius: 2px;
    text-decoration: none;
    letter-spacing: 0.03em;
    transition: opacity 0.15s;
  }

  .btn-primary:hover { opacity: 0.85; }

  .btn-secondary {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: var(--muted);
    text-decoration: none;
    letter-spacing: 0.03em;
    transition: color 0.15s;
  }

  .btn-secondary:hover { color: var(--text); }

  /* Empty state */
  .empty {
    text-align: center;
    padding: 4rem 2rem;
    font-family: 'JetBrains Mono', monospace;
    color: var(--muted);
    font-size: 0.85rem;
  }

  /* Footer */
  footer {
    border-top: 1px solid var(--border);
    padding: 2rem 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    color: var(--muted2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  footer a { color: var(--muted); text-decoration: none; }
  footer a:hover { color: var(--accent); }

  @media (max-width: 600px) {
    header { padding: 2rem 0; }
    .card { padding: 1.25rem; }
    .card.latest::before { display: none; }
    footer { flex-direction: column; }
  }
</style>
</head>
<body>
<div class="glow-orb"></div>
<div class="glow-orb-2"></div>

<div class="container">
  <header>
    <div class="logo-line">dev updates</div>
    <h1 class="site-title">
      <span class="title-eco">Oeco</span><span class="title-nomia">nomia</span>
    </h1>
    <p class="site-sub">Weekly build logs from a solo developer building a multi-protocol DeFi ecosystem from scratch.</p>
    <div class="tag-row">
      <span class="tag active">OEC Token</span>
      <span class="tag">Eloqura DEX</span>
      <span class="tag">Alluria Lending</span>
      <span class="tag">Staking</span>
    </div>
  </header>

  <main>
    ${entries.length === 0
      ? '<div class="empty">// no reports yet. First one generates Sunday night</div>'
      : `<div class="updates-grid">${cards}</div>`
    }
  </main>

  <footer>
    <span>© ${new Date().getFullYear()} Oeconomia · auto-generated weekly</span>
    <span>
      <a href="https://oeconomia.io">oeconomia.io</a>
      &nbsp;·&nbsp;
      <a href="https://github.com/Oeconomia2025">github</a>
    </span>
  </footer>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(DOCS, 'index.html'), indexHtml);
console.log(`✅ index.html built with ${entries.length} entries`);
