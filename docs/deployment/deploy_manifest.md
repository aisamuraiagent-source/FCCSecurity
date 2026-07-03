# Deploy Manifest

Date: 2026-07-03
Mode: current public repository manifest and historical package boundary

## Current Status

This repository is public and the current default branch state is source-only for the static FCC Security prototype.

No fresh public ZIP, SHA-256 receipt, GitHub Pages deployment, Netlify deployment, package release, CI/CD workflow, external scan, backend, API, telemetry, authentication, or background automation is included in this manifest state.

The package paths below are reserved output targets for a future explicit static-package step. They are not evidence that a fresh public package exists for the current commit.

Package target:

```text
local-evidence/fccsecurity-frontier-cyber-intelligence.zip
```

Package hash receipt:

```text
local-evidence/fccsecurity-frontier-cyber-intelligence.zip.sha256
```

Before any package or deploy use, regenerate the ZIP from the current commit, write a new SHA-256 receipt outside the ZIP, and re-run the local validation commands listed in `README.md`.

## Included Runtime Files

- `index.html`
- `styles.css`
- `app.js`

## Included Governance And Evidence Files

- `AGENTS.md`
- `README.md`
- `VERSION.md`
- `docs/threat-model/threat_model.md`
- `docs/evidence/implementation_evidence.md`
- `docs/validation/local_validation.md`
- `docs/deployment/local_deploy.md`
- `docs/deployment/deploy_manifest.md`
- `docs/deployment/public_release_gate.md`
- `docs/deployment/private_github_repo_plan.md`
- `docs/deployment/github_private_seed_manifest.md`
- `docs/openai/openai_deploy_review_request.md`
- `docs/openai/openai_developer_forum_post.md`
- `docs/openai/developer_community_submission_steps.md`

## Excluded

- `.git`
- local browser screenshots under `local-evidence/`
- generated image source under `<local_codex_image_cache>\generated_images`
- any external credentials, keys, caches, or machine-local browser profile data

## Deployment Boundary

Any package produced from this manifest must remain a static local artifact. It must not perform external hosting, network ingestion, telemetry, authentication, or background automation.

The SHA-256 hash is recorded outside the ZIP to avoid a self-referential package hash.

## Historical Scan Receipts

Historical Codex Security scan receipts are preserved in the repository as dated local review artifacts. They are not a fresh release gate for the current commit and must not be presented as current deployment approval.

Historical local reports:

```text
docs/security-scans/FCCSecurity/no-head_20260618T085508-0300/report.md
docs/security-scans/FCCSecurity/no-head_20260618T085508-0300/report.html
```

## Branch Governance Decision

The remote branch `codex/docs-only-validation-workflow` is treated as a historical governance branch with separate/orphaned history, not as a current release source for `main`.

Decision:

- do not merge `codex/docs-only-validation-workflow` wholesale into `main`;
- use it only as reference material for governance controls that may still be useful;
- if any files from that branch are needed, reintroduce them through a clean branch based on current `main`;
- do not cite that branch as current validation, package, deploy, branch-protection, or release evidence;
- archive or delete the branch only after a separate explicit GitHub governance action.

No external deployment was performed by this manifest refresh.
