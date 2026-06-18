# Security Review: FCCSecurity

## Scope

- Scan mode: Codex Security repository-wide scan.
- Repository root: `<repo_root>`.
- Scan id: `no-head_20260618T085508-0300`.
- Context source: existing repository threat model copied without alteration to `artifacts/01_context/threat_model.md`.
- In-scope surfaces: static runtime files, local PDF tooling, repository governance, threat model, validation/evidence docs, deployment docs, and OpenAI/public-prep docs.
- Explicit exclusions: no external target scanning, no network verification, no package installation, no deploy, no commits, and no source remediation.
- Runtime/test status: `node --check app.js` passed; Python syntax parse for `scripts/generate_profile_pdfs.py` passed through in-memory `compile(...)`; dangerous runtime sink grep returned no unsafe DOM/dynamic execution/network sink matches; refined token/private-key grep returned no secret matches.
- Artifact bundle: `docs/security-scans/FCCSecurity/no-head_20260618T085508-0300`.

### Scan Summary

| Field | Value |
|---|---|
| Reportable findings | 1 |
| Severity mix | 1 MEDIUM |
| Confidence mix | 1 medium-high |
| Worklist coverage | 18/18 rows completed |
| Raw candidates | 2 |
| Final suppressed candidates | 1 |
| Validation mode | Static line verification, targeted `rg`, repo-state checks, subagent file review |
| Network used | No |
| Source files modified | No |

## Threat Model

# FCC Security Threat Model

## Overview

FCC Security is a local-first defensive cyber intelligence dashboard. The first runtime surface is a static HTML, CSS, and JavaScript application that helps an operator organize security signals, threat model notes, validation state, Codex Security receipts, and next actions.

The repository supports Codex-assisted defensive workflows and repeatable Codex Security scans. It currently has no backend, authentication layer, package manager, database, external API, telemetry path, or deployment automation.

Primary assets:

- credibility of public security evidence and portfolio wording;
- integrity of local validation and scan receipts;
- operator notes stored in browser localStorage;
- threat model and validation docs used to guide future review;
- static runtime code that renders defensive intelligence data.

## Threat Model, Trust Boundaries, and Assumptions

Trust boundaries:

- Browser UI boundary: local JavaScript renders static seed data and operator notes into the DOM.
- Local storage boundary: notes persist in the operator browser and must not be treated as a secret vault.
- Documentation boundary: public or shareable Markdown can create reputational risk if it overclaims validation, OpenAI affiliation, DayBreak status, or Codex Security usage.
- Scan workflow boundary: future Codex Security artifacts must distinguish discovery, validation, attack-path analysis, and final report evidence.
- Deployment boundary: static files may be hosted later, but no external deploy is part of the current repository state.

Attacker-controlled inputs in the current prototype are limited to local operator notes and any future imported signal text. Developer-controlled inputs include seed data in `app.js`, docs, and static assets. Operator-controlled inputs include UI filter choices, selected signal state, notes, and exported snapshots.

Assumptions:

- The app is operated locally by an authorized user.
- No secrets, credentials, private incident data, or third-party target data should be entered into local notes.
- Future ingestion of real logs, advisories, or scan outputs must treat imported text as untrusted.
- Any public wording must remain factual and evidence-backed.

## Attack Surface, Mitigations, and Attacker Stories

Current attack surface:

- static DOM rendering in `app.js`;
- localStorage note persistence;
- JSON snapshot export through browser APIs;
- Markdown documentation that may later be published or used as portfolio evidence.

Existing mitigations:

- no backend, database, login, token, or remote API;
- no dependency install or build chain;
- rendering code uses DOM creation and `textContent` instead of string HTML injection;
- docs explicitly state the completed Codex Security repo-wide scan result and local report paths;
- repository rules forbid external scanning, malware, credential theft, and unsupported public claims.

Relevant attacker stories:

- A future imported signal contains HTML or script and attempts DOM injection.
- A public README or evidence file implies validation that was not performed.
- Operator notes accidentally store sensitive information and a local user exports the snapshot.
- A later deploy configuration exposes files that were intended to stay local.

Out-of-scope stories for the current state:

- server-side request forgery, auth bypass, tenant isolation failure, SQL injection, and backend privilege escalation, because no server or database exists.
- supply-chain compromise through package dependencies, because no package manager is present.
- exploitation of third-party systems, because this repository is defensive and local-only.

## Severity Calibration (Critical, High, Medium, Low)

Critical:

- A future backend or connector exposes credentials, private scan data, or remote execution paths.
- A public deploy introduces automatic ingestion from untrusted remote sources and renders attacker content unsafely.

High:

- Imported signal content reaches unsafe DOM sinks such as `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, or `new Function`.
- Documentation falsely claims official affiliation, privileged access, or completed validation that did not occur.

Medium:

- Evidence or inventory docs drift from repository reality and weaken auditability.
- Snapshot export includes sensitive operator notes because the operator used localStorage as a secret store.

Low:

- UI-only defects that misclassify local sample data without changing public claims or security decisions.
- Static deployment misconfiguration with no secrets, no private data, and no sensitive runtime path exposed.

## Findings

| Severity | Confidence | Finding | Category | Affected Lines |
|---|---|---|---|---|
| MEDIUM | medium-high | [OpenAI-facing wording overstates no dependency install/static-only posture while repo contains optional Python PDF tooling with third-party imports](#1-openai-facing-wording-overstates-no-dependency-installstatic-only-posture-while-repo-contains-optional-python-pdf-tooling-with-third-party-imports) | Documentation/evidence drift | `docs/openai/openai_deploy_review_request.md:29-30`; `docs/openai/openai_developer_forum_post.md:28,30`; `docs/threat-model/threat_model.md:48`; `scripts/generate_profile_pdfs.py:8-17,31` |

### Confidence Scale

| Label | Meaning |
|---|---|
| high | direct source, configuration, or runtime evidence supports the finding, with no material unresolved reachability or exploitability blocker. |
| medium | source evidence supports a plausible issue, but runtime behavior, deployment configuration, role reachability, type constraints, or exploit reliability still need proof. |
| low | weak or incomplete evidence; include only when the user explicitly wants follow-up candidates in the final report. |

### [1] OpenAI-facing wording overstates no dependency install/static-only posture while repo contains optional Python PDF tooling with third-party imports

| Field | Value |
|---|---|
| Severity | medium |
| Confidence | medium-high |
| Confidence rationale | Direct line evidence shows unqualified static/no-dependency wording and direct source evidence shows optional Python tooling imports third-party libraries; publication state and local package state were not checked. |
| Category | Documentation/evidence drift |
| CWE | none |
| Affected lines | `docs/openai/openai_deploy_review_request.md:29-30`; `docs/openai/openai_developer_forum_post.md:28,30`; `docs/threat-model/threat_model.md:48`; `scripts/generate_profile_pdfs.py:8-17,31` |

#### Summary

The OpenAI-facing and threat-model wording describes the project as static HTML/CSS/JavaScript only and says there is no dependency install. That is accurate for the deployable dashboard runtime, but the repository also contains optional local PDF tooling in `scripts/generate_profile_pdfs.py` that imports `PIL`, `pypdf`, `reportlab`, and optionally `pypdfium2`. Without scoping the claim to the runtime, a reviewer can reasonably read the whole repository as dependency-free/static-only.

#### Validation

Validation used full-file line-numbered static review, targeted `rg`, and repo-state checks.

Checklist:

- [x] Affected docs contain unqualified static-only/no-dependency wording.
- [x] Repository contains non-runtime Python tooling with third-party imports.
- [x] Affected docs are public/OpenAI-facing or threat-model evidence.
- [x] Counterevidence was checked: no package-manager manifest found; static runtime remains true for the deployable dashboard.
- [x] Scope remains documentation drift only, not runtime exploitability or external affiliation.

Evidence:

- `docs/openai/openai_deploy_review_request.md:29-30` says `static HTML/CSS/JavaScript only` and no `dependency install`.
- `docs/openai/openai_developer_forum_post.md:28,30` says the runtime is static HTML/CSS/JavaScript and no dependency install.
- `docs/threat-model/threat_model.md:48` says no dependency install or build chain.
- `scripts/generate_profile_pdfs.py:8-17` imports `PIL`, `pypdf`, and `reportlab`.
- `scripts/generate_profile_pdfs.py:31` optionally imports `pypdfium2`.

Remaining uncertainty: external publication state and local Python package installation state were not checked; no network or package installation was performed.

#### Dataflow

Repository evidence -> OpenAI/public-prep Markdown wording -> reviewer consumes the documentation as evidence -> reviewer may infer that the entire repository is dependency-free/static-only -> optional local Python tooling contradicts that broad interpretation.

This is a documentation/evidence trust-boundary path, not runtime dataflow.

#### Reachability

The affected files are explicitly OpenAI-facing or public-prep documents. The path is reachable when the docs are shared with a reviewer or published. There is no runtime attacker input, identity boundary, auth path, backend, service account, secret reference, or network exploit path.

Counterevidence limits severity: there is no OpenAI approval/affiliation claim, no external deployment, no secret exposure, no package-manager manifest, and no unsafe runtime DOM sink. The static deployable dashboard posture remains intact if the claim is scoped to runtime only.

#### Severity

Final severity: medium.

Impact is medium inside the documentation/evidence boundary because public or OpenAI-facing claims become broader than the repository evidence supports. Likelihood is high within that boundary because these files are prepared for review/publication. This maps to MEDIUM and P2 under the scan severity policy.

Evidence that would lower severity: wording changed to clearly scope no-dependency/static-only claims to the deployable runtime and separately document optional local Python tooling. Evidence that would raise severity: public release or review submission using the current wording after a reviewer relies on it as a release/security assertion.

#### Remediation

- Change OpenAI-facing wording to state: the deployable dashboard runtime is static HTML/CSS/JavaScript and has no backend/build dependency.
- Add a separate sentence that optional local PDF/profile tooling exists and may require Python libraries if used.
- Update the threat model line that says no dependency install or build chain to scope that statement to the runtime/deployable dashboard.
- Re-run targeted checks for `static HTML`, `dependency install`, and Python imports after the wording patch.

## Reviewed Surfaces

| Surface | Risk Area | Outcome | Notes |
|---|---|---|---|
| Browser UI runtime (`app.js`, `index.html`, `styles.css`) | DOM injection / dynamic execution | No issue found | Full-file review and grep found `createElement`/`textContent` rendering and no unsafe DOM, dynamic code, network, or external resource sinks. |
| Browser UI runtime | SSRF / network fetch / callback abuse | Not applicable | No browser network clients or external resource references found. |
| Local storage and snapshot export | Sensitive localStorage / export leakage | No issue found | Notes remain browser-local; export is local user-triggered Blob download; threat model says notes are not a secret vault. |
| Runtime auth/session/backend | Auth/authz/session bypass | Not applicable | No backend, database, login, token, API, session, or remote service exists. |
| Local PDF tooling | File/path write impact | No issue found | Writes fixed local artifacts under configured output root; no untrusted remote input, archive extraction, deletion, shell execution, or network call found. |
| Local PDF tooling plus OpenAI docs | Dependency/claim drift | Reported | Became finding `FCCSEC-DOC-001`. |
| Public evidence docs | Path metadata disclosure | Rejected | Validated as real metadata exposure, then suppressed by attack-path policy because impact is low, publication likelihood is unknown, no secret/runtime sink exists, and no attacker input path exists. |
| Public/OpenAI wording | Approval/affiliation overclaim | No issue found | Docs explicitly state no OpenAI approval, endorsement, sponsorship, affiliation, or external deployment. |
| Deployment docs | Unsafe deploy/release-gate bypass | No issue found | Release gate blocks publishing current local package unchanged and forbids adding backend/login/API keys/telemetry/remote ingestion/automated scanning. |
| Repository text | Secret exposure | No issue found | Refined token/key grep returned no secret matches. |
| Runtime package surface | Package dependency risk | Not applicable | No package manager manifest or lockfile found for the deployable runtime. |

## Open Questions And Follow Up

- Patch the wording in `docs/openai/openai_deploy_review_request.md`, `docs/openai/openai_developer_forum_post.md`, and `docs/threat-model/threat_model.md` to scope no-dependency/static-only claims to the deployable runtime.
- Optionally sanitize absolute local paths in `docs/evidence/implementation_evidence.md` and `docs/validation/local_validation.md` as a hygiene backlog item before public release.
- After remediation, re-run targeted grep for `<user_profile>`, `file:///C:/Users`, `.codex`, `static HTML`, and `dependency install`.
