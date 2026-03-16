# Oeconomia Dev Log

Automated weekly development reports for the [Oeconomia](https://oeconomia.io) DeFi ecosystem.  
Published to GitHub Pages every Monday morning.

**Live site:** `https://oeconomia.github.io/oeconomia-devlog`

---

## How It Works

Every Sunday night at 11 PM Pacific, GitHub Actions:

1. Clones all Oeconomia repos and extracts the past 7 days of git commits
2. Sends that data to Claude API to generate two reports:
   - **Detailed devlog** — full technical breakdown (contracts, frontend, decisions made)
   - **Public update** — 3-5 bullet summary for community/Twitter
3. Rebuilds the GitHub Pages site with the new entry
4. Deploys automatically

---

## Setup (One Time)

### 1. Create the GitHub repo

```bash
gh repo create Oeconomia2025/oeconomia-devlog --public
cd oeconomia-devlog
git init && git add . && git commit -m "init"
git push -u origin main
```

### 2. Add GitHub Secrets

Go to **Settings → Secrets → Actions** in the repo and add:

| Secret | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `DEVLOG_TOKEN` | GitHub PAT with `repo` scope (to clone private repos) |
| `GH_ORG` | `Oeconomia2025` (or your org name) |

### 3. Enable GitHub Pages

Go to **Settings → Pages**:
- Source: **GitHub Actions**

### 4. Update repo names

Edit `scripts/config.json` with your actual repo names.

### 5. Trigger a test run

Go to **Actions → Weekly Dev Report → Run workflow** to test it immediately.

---

## Add Notes Before a Report

Drop anything you want captured into `scripts/notes.md` before Sunday:

```
- Made decision to use X approach for Y
- Had a call about Z
- Discovered issue with ABC and resolved by doing XYZ
```

The file is automatically cleared after each run.

---

## Manual Run

```bash
# Generate report locally (needs ANTHROPIC_API_KEY env var)
npm run report

# Preview the site
npm run preview
```

---

## File Structure

```
docs/
  index.html          ← GitHub Pages entry point (auto-generated)
  index.json          ← machine-readable list of all reports
  devlogs/
    DEVLOG_2025-W11.md  ← detailed internal logs
    DEVLOG_2025-W11.html
  updates/
    UPDATE_2025-W11.md  ← short public updates

scripts/
  generate-report.js  ← calls Claude API, writes reports
  build-index.js      ← regenerates index.html from index.json
  config.json         ← repo list + project context
  notes.md            ← manual notes (cleared weekly)

CLAUDE.md             ← task spec for Claude Code agent
.github/workflows/
  weekly-report.yml   ← GitHub Actions schedule
```
