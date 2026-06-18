# GitHub Private Seed Manifest

Date: 2026-06-16

Purpose: describe the sanitized local seed prepared for a future private GitHub repository.

## Seed Location

```text
C:\tmp\fccsecurity-private-github-seed
```

ZIP:

```text
C:\tmp\fccsecurity-private-github-seed.zip
```

SHA-256 receipt:

```text
C:\tmp\fccsecurity-private-github-seed.zip.sha256
```

## Intended Use

This seed is for a private GitHub repository only. It is not proof of OpenAI approval and it is not a static deployment package.

## Sanitization Rules

The seed must not contain:

- private local user paths;
- raw Codex scan work directories;
- local browser profiles;
- credentials or `.env` files;
- cache folders;
- public wording that implies OpenAI endorsement, sponsorship, approval, or affiliation.

## Required Files

- `index.html`
- `styles.css`
- `app.js`
- `README.md`
- `VERSION.md`
- `AGENTS.md`
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

## Gate

Before using this seed, run checks equivalent to:

```powershell
rg -n "<private-local-path-patterns>" <seed-directory>
rg -n "<positive-approval-or-endorsement-claims>" <seed-directory>
node --check <seed-directory>\app.js
```

Expected result:

- no private path matches;
- no positive approval/endorsement overclaim matches;
- JavaScript syntax passes.
