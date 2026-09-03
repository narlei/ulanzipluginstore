## v1.6.0 — 2026-09-03

### Added

- **A "What's new" page**, grouped by author, at `/updates/`. Browse any date window (`?from=&to=`) to see new plugins and recent releases pulled live from the catalog; a shared link keeps showing what it showed the day it was posted. Each window also gets its own 1200×630 share card built from the icons of what actually landed, instead of the site's generic cover.
- **Google Analytics 4** on the marketing site.
- **The desktop app is now a universal macOS binary.** Releases ship a single `.dmg`/`.zip` that runs natively on both Apple Silicon and Intel Macs, supporting macOS 12 (Monterey) and up — Intel users were previously left out entirely, since the CI runner only ever produced an Apple Silicon build.

### Fixed

- **The updates share card no longer shows stale numbers right after a deploy.** A crawler hitting the page seconds after a catalog update could pin a "0 new plugins" card built from the old catalog for hours; the page now forces one cache-bypassing refresh when that happens.
- **Registry PR validation no longer silently skips checks.** `/revalidate` used to come back with an empty file list on some PRs (a missing git merge-base) and validation was skipped without saying so; it now lists the PR's files through the GitHub API instead.
- **The PR security scan checks the repo that was actually submitted**, not the whole registry — it now also blocks the merge when it finds leaked secrets or a CRITICAL vulnerability.

### Internal

- Registry PR validation and the Trivy security scan now run from the trusted base branch, scoped to only the entries a PR touches, instead of checking out the PR branch wholesale.
- `security-scan.mjs` accepts an `ONLY_FILES` allow-list and reports secret/critical counts as job outputs for the PR comment.
- CI workflow text translated to English.
- The macOS release build: ad-hoc code signing now runs only on the final universal app bundle (signing each architecture slice separately broke the merge step), and `@resvg/resvg-js` — used only by the catalog's build scripts — moved out of the packaged app's dependency tree.
