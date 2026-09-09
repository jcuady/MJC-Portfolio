# PROJECT_STATUS — MJC Portfolio (mjcuady.dev)

Updated: 2026-09-09

## Overall

**Production-ready** for the Vite/React portfolio. Critical inventory, build, and browser seams verified; live domain redeployed after EMS restore.

## Architecture

- Frontend only: Vite + React 18 + GSAP + Framer Motion
- Data: `src/data/profile.jsx`
- Hosting: Vercel project `mjc-portfolio` → **https://mjcuady.dev**
- No backend / DB / auth in this repo

## Feature status

| Area | Status | Notes |
|------|--------|-------|
| Hero / scroll story | COMPLETE | QA pin/entry seams pass |
| Experience (12 roles) | COMPLETE | EMS restored; counter `01 / 12` |
| Certifications (18) | COMPLETE | Includes AI Product Manager PDF |
| Client logo wall | COMPLETE | Company logos in `public/logos/companies` |
| Projects / Beepa | COMPLETE | Live preview + beepabpo.com |
| SEO | COMPLETE | Lighthouse SEO 100 (local preview) |
| NDA naming | COMPLETE | Inventory bans product codenames |

## Verification (this session)

```text
PASS verify-inventory (12 roles, 18 certs, assets, NDA banlist)
PASS npm run build
PASS verify-experience
PASS verify-xp-ui (375 / 768 / 1440 — no overflow, no rail overlap, tech chips on snapshots)
PASS verify-certs (18)
PASS verify-qa
PASS verify-overlap
PASS verify-seo (Lighthouse SEO 100)
```

Experience UI (2026-09-09): timeline foot no longer overlaps steps 10–12; Project Snapshot shows tech-stack chips with logos for development roles.

## Known debt

- Untracked local-only scripts (resume tailor/backfill) and duplicate cert PDFs — not part of deploy
- Hover cert peek may soft-warn in headless Chrome (modal click path required)
- Full `npm run verify` suite is longer; critical gates above are the ship bar

## Highest-value next action

Wire CI to run `verify-inventory` + `build` + preview-gated `verify-qa` / `verify-certs` / `verify-experience` on every push to `main`.
