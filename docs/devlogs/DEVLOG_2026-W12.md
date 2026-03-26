---
week: 2026-W12
date_range: Mar 16 - Mar 22, 2026
generated: 2026-03-23T00:00:00Z
---

![Oeconomia Weekly Update](../weekly-update-banner.png)

# Oeconomia Devlog: Week 12, 2026

## Summary
Performance and infrastructure week. All five dApps were migrated from public Sepolia RPCs to Alchemy for faster, more reliable blockchain calls. Route-level code splitting with React.lazy was added across four projects for faster initial page loads. Eloqura DEX received a full visual retheme and its limit orders contract was wired up with real on-chain pool data. The DAO Hub roadmap was updated to reflect recent milestones and a new Ecosystem GitBook space was added. 15 commits across 5 repositories.

## Completed

### Smart Contracts
- None this week

### Frontend / DApp
- **Eloqura DEX:** Full retheme to dark gray palette with #5c69c2 accent buttons (bcb086a)
- **Eloqura DEX:** Wired up limit orders contract, fixed price display, replaced mock pools with real on-chain data (bc47117)
- **Eloqura DEX:** Fixed button hover text color, card shadows, and removed accent flash artifact (dc616dd)
- **DAO Hub:** Updated roadmap with limit orders, real pool data, devlog system, GitBook docs, and ecosystem space milestones (63a470b)

### Infrastructure / Tooling
- **All dApps:** Switched Sepolia RPC to Alchemy across all 5 projects for faster blockchain calls (3adfa2f, 1b03f47, 4e14998, d5768b6, 2f91f51 -- one commit per repo)
- **4 dApps:** Added route-level code splitting with React.lazy for faster initial page loads (cf423d0, 5b09026, 3b42b45, 2f91f51 -- Alluria, Staking, DAO Hub, Explorer)

### Documentation
- **DAO Hub:** Added standalone Ecosystem GitBook space with protocol links, logos, and contract addresses (dbdcfc7, 607ef70)

## In Progress
- Presale contract development (pre-mainnet phase)
- Eloqura visual polish and theme refinement

## Issues Encountered & Resolved
- Public Sepolia RPCs were causing slow and unreliable blockchain calls across all dApps. Migrated all five projects to Alchemy's free tier for consistent sub-second responses.
- Eloqura's retheme introduced a brief accent color flash on page load. Fixed by removing the transition artifact (dc616dd).

## Decisions Made
- **Alchemy for all RPC calls:** Standardized on Alchemy across the entire ecosystem instead of relying on public Sepolia endpoints. Free tier is sufficient for current testnet usage and provides much faster response times.
- **React.lazy code splitting:** Added lazy loading for route-level components across four dApps. This reduces initial bundle size and improves time-to-interactive, especially on mobile.
- **Eloqura dark gray retheme:** Moved away from the previous color scheme to a dark gray palette (#393a4e base) with #5c69c2 accent buttons. Gives Eloqura a more distinctive, professional identity within the ecosystem.
- **Real on-chain pool data:** Replaced mock/placeholder pool data in Eloqura with live on-chain reads. Limit orders contract is now fully wired up with real price feeds.
- **Ecosystem GitBook space:** Created a dedicated Ecosystem documentation space in the DAO Hub with protocol links, logos, and all contract addresses in one place.

## Next Week Goals
- Continue presale contract development
- Monitor Alchemy usage across all dApps
- Further Eloqura UX polish
- Address any performance regressions from code splitting

## Metrics (if applicable)
- Testnet transactions: ongoing
- Contracts deployed: 0 this week
- GitHub commits: 15 across 5 repositories
