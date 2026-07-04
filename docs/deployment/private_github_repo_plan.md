# Private GitHub Repository Plan

Date: 2026-06-16

Purpose: define the controlled path from local evidence to repository review, then optional public release.

## Decision

Do not create a public repository first. Use controlled repository review only after the review packet is ready and the public wording has been sanitized.

Current user decision/status:

```text
Controlled repository review was used for the historical workflow.
Repository URL, visibility state, branch tracking state, and pushed commit identifiers are intentionally omitted.
```

The Developer Community account is temporarily on hold pending staff review. This is not approval, endorsement, partnership, or release authorization.

## Repository Name

Recommended controlled repository name:

```text
FCCSecurity
```

Safer public-facing name if "cyber intelligence" is considered too broad:

```text
fccsecurity-defensive-evidence-dashboard
```

## Visibility

Start as private.

Only switch to public after:

- OpenAI/community feedback is reviewed, or a deliberate decision is made to publish without formal feedback;
- local paths are removed from public docs;
- non-affiliation disclaimer is present;
- final ZIP/hash is regenerated from the public-safe copy;
- security scan summary remains factual and does not say "secure" or "approved";
- no OpenAI logo, app title branding, or model-name branding is used.

## Initial Controlled Review Contents

Include:

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
- `docs/openai/openai_deploy_review_request.md`
- `docs/openai/openai_developer_forum_post.md`

Do not include:

- local browser profile data;
- screenshots unless sanitized and intentionally public;
- raw scan work directories with machine paths;
- secrets, credentials, `.env`, cache folders, or generated private artifacts;
- unsanitized absolute local user paths in public-facing docs.

## Manual GitHub Steps

1. Prepare a controlled review repository after final sanitation.
2. Do not enable GitHub Pages yet.
3. Commit the local project after final sanitation.
4. Publish only to the approved controlled remote.
5. Attach the sanitized review packet only if needed for reviewers.
6. Open an issue titled `Release gate: OpenAI wording and static deploy review`.
7. Paste the checklist from `docs/deployment/public_release_gate.md`.
8. Keep the repository private until the release gate is closed.

## Deploy Decision

After private review:

- GitHub Pages is simplest if the repo becomes public.
- Netlify is better if a private preview link is needed.
- Keep local ZIP only if feedback says wording or positioning is not ready.
