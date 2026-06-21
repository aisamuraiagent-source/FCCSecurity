# Deploy Manifest

Date: 2026-06-16

Package target:

```text
local-evidence/fccsecurity-frontier-cyber-intelligence.zip
```

Package hash receipt:

```text
local-evidence/fccsecurity-frontier-cyber-intelligence.zip.sha256
```

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

This package is a static local artifact. It does not perform external hosting, network ingestion, telemetry, authentication, or background automation.

The SHA-256 hash is recorded outside the ZIP to avoid a self-referential package hash.

Codex Security repo-wide scan was completed before external deployment. Final reports are stored outside the ZIP:

```text
local-evidence/report.md
local-evidence/report.html
```

No external deployment was performed in this step.
