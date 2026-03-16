---
week: 2026-W10
date_range: Mar 02 - Mar 08, 2026
generated: 2026-03-16T00:00:00Z
---

# Oeconomia Devlog: Week 10, 2026

## Summary
This week was all about Alluria integration across the ecosystem. Smart contracts, hooks, and on-chain actions landed in the Alluria workspace, the Explorer gained Alluria contract and token support, and Eloqura's DEX expanded with new token listings and performance improvements for liquidity and pricing.

## Completed

### Smart Contracts
- Added Alluria smart contracts with hooks and integrated on-chain actions across all Alluria DApp pages
- Registered Alluria deployed contracts and ALUR token in the Explorer's contract registry

### Frontend / DApp
- **Eloqura:** Added ELOQ to the liquidity token list, fixed a bug where existing positions were not loading correctly, and parallelized pair fetching for faster page loads
- **Eloqura:** Added ALUR, ALUD, and ELOQ tokens to the swap interface with a quick-select row and parallel price loading for snappier UX
- **Alluria:** Integrated on-chain actions (contract calls, transaction flows) across all pages in the Alluria DApp

### Infrastructure / Tooling
- **Explorer:** Added INDEXER_START_BLOCK override so the indexer can target a specific deployment block instead of scanning from genesis
- **Explorer:** Switched backfill strategy to getLogs-based approach for more reliable historical event ingestion
- **Explorer:** Made contract rows clickable for easier navigation

### Documentation
- None this week

## In Progress
- Continued expansion of Alluria DApp functionality beyond initial contract integration
- Ongoing Explorer indexer tuning and backfill testing with the new getLogs strategy

## Issues Encountered & Resolved
- Liquidity positions were not loading in Eloqura due to a data-fetching bug. Fixed alongside the ELOQ token addition by correcting how positions are queried.
- Explorer backfill was unreliable with the previous approach. Resolved by switching to a getLogs-based backfill with configurable start block.

## Decisions Made
- Adopted parallel fetching for both pair data and token prices in Eloqura. Sequential calls were creating noticeable latency as the token list grew, so parallelizing keeps the UI responsive.
- Added an INDEXER_START_BLOCK environment variable to the Explorer indexer. This avoids scanning thousands of irrelevant blocks on chains where contracts were deployed late, saving time and RPC calls.
- Introduced a quick-select token row in Eloqura's swap UI. With ALUR, ALUD, and ELOQ joining the token list, users needed a faster way to pick frequently traded tokens.

## Next Week Goals
- Continue building out Alluria DApp pages with deeper on-chain integration
- Stress-test the Explorer's getLogs backfill on larger block ranges
- Add pricing support for ALUR and ALUD in Eloqura's multi-hop quote logic

## Metrics (if applicable)
- GitHub commits: 5 across 3 repositories
