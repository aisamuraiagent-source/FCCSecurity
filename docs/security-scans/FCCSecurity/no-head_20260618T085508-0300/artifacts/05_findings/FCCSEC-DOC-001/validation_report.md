# Validation Report: FCCSEC-DOC-001

Finding title: OpenAI-facing wording overstates no dependency install/static-only posture while repo contains optional Python PDF tooling with third-party imports.

Instance key: `doc-claim-drift:openai-facing-static-only-dependencies`

Disposition: `reportable`

Survives validation: yes

Confidence: 0.86

## Rubric

- [x] Affected docs contain unqualified static-only/no-dependency wording.
- [x] Repository contains non-runtime Python tooling with third-party imports.
- [x] Affected docs are public/OpenAI-facing or threat-model evidence.
- [x] Counterevidence was checked: no package-manager manifest found; static runtime remains true for the deployable dashboard.
- [x] Scope remains documentation drift only, not runtime exploitability or external affiliation.

## Evidence Observed

- `docs/openai/openai_deploy_review_request.md:29-30` says `static HTML/CSS/JavaScript only` and no `dependency install`.
- `docs/openai/openai_developer_forum_post.md:28,30` says the runtime is static HTML/CSS/JavaScript and no dependency install.
- `docs/threat-model/threat_model.md:48` says no dependency install or build chain.
- `scripts/generate_profile_pdfs.py:8-17` imports `PIL`, `pypdf`, and `reportlab`.
- `scripts/generate_profile_pdfs.py:31` optionally imports `pypdfium2`.

Counterevidence:

- No package-manager manifest or lockfile was found.
- The Python PDF tooling appears optional/local and separate from the deployable static dashboard runtime.
- No approval, affiliation, external deployment, secret exposure, or runtime unsafe DOM sink was observed.

## Assessment

The candidate is valid as a MEDIUM documentation/evidence drift issue. The deployable dashboard can still be accurately described as static HTML/CSS/JavaScript with no backend/build dependency, but the current OpenAI-facing and threat-model wording does not clearly scope that claim to the runtime while the repository also contains optional local Python PDF tooling.

Remaining uncertainty: local Python package installation state and external OpenAI docs were not checked because no install/network validation was performed.

## Closure Table

| Ledger Row ID | Instance Key | Root-Control File:Line | Entrypoint/Source | Sink/Control | Disposition | Counterevidence or Proof Gap | Survives |
|---|---|---|---|---|---|---|---|
| `TOOLING-DEPS-001` | `doc-claim-drift:openai-facing-static-only-dependencies` | `docs/openai/openai_deploy_review_request.md:29-30`, `docs/openai/openai_developer_forum_post.md:28,30`, `docs/threat-model/threat_model.md:48` | public/OpenAI-facing wording boundary | unqualified static-only/no-dependency claims | reportable | runtime appears static; optional tooling dependency provenance remains undocumented | yes |
