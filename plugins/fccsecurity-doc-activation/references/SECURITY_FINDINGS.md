# Security Findings

Date: 2026-06-20
Mode: docs-only defensive continuation.
Workspace: `C:\tmp\FCCSecurity-clean-20260618T202007`

## Summary

No confirmed active runtime vulnerability was found in the current docs-only review. The current project is a local-first static HTML/CSS/JavaScript dashboard with no backend, package manager, dependency install path, remote API, telemetry, deploy automation, CI/CD workflow, or configured Git remote in this reviewed workflow.

The findings below are tracked as defensive risk controls and residual risks. They are intentionally scoped to the current local workspace and should not be presented as public certification, official approval, or external security assurance.

## Findings

### FCCSEC-2026-06-20-001 - Operator notes can carry sensitive content into local export

- Severity: MEDIUM
- Priority: P2
- Status: monitored / accepted with controls
- Affected surface: `app.js`, `docs/threat-model/threat_model.md`, `README.md`
- Description: Operator notes are stored in browser `localStorage` and included in JSON snapshot export. The app bounds notes to 4000 characters and documents that notes are not a secret vault, but a user can still manually enter sensitive content.
- Impact: Sensitive local notes could be preserved or exported by the operator if the workspace is later shared without review.
- Evidence: Threat model documents local storage and export boundaries; runtime uses `MAX_NOTE_LENGTH`, safe storage wrappers, and `exportPolicy` metadata; validation confirms the contract.
- Recommended correction: Keep warning language visible in docs and UI. Before any public share, sanitize exported snapshots and avoid entering secrets, tokens, credentials, personal data, or private incident details into notes.
- Validation: `node scripts\validate-local.js`; review `exportPolicy`, `notesTruncated`, and threat model note handling.
- Residual risk: Human-entered sensitive text cannot be fully prevented without changing product behavior; current control is warning, bounding, and local-only handling.

### FCCSEC-2026-06-20-002 - Future imported signal content would require strict DOM-sink controls

- Severity: HIGH if a future import path is added; LOW in current static state
- Priority: P2
- Status: controlled / future gate required
- Affected surface: `app.js`, `index.html`, `docs/threat-model/threat_model.md`, `scripts/validate-local.js`
- Description: Current signal data is local seed data and renders through DOM creation plus `textContent`. If future work adds imported signal data, unsafe rendering sinks would become a high-impact path.
- Impact: Introducing `innerHTML`, `outerHTML`, `insertAdjacentHTML`, dynamic execution, or unsafe URL handling for untrusted content could create client-side injection risk.
- Evidence: Current validation forbids unsafe runtime sinks and network APIs; current runtime uses text-safe rendering patterns.
- Recommended correction: Keep `scripts/validate-local.js` sink checks mandatory. Any future import, connector, parser, or agent-generated content path must preserve `textContent`/DOM node construction and add regression tests before release.
- Validation: sink grep over `index.html`, `app.js`, `styles.css`; `node scripts\validate-local.js`.
- Residual risk: Future code changes can bypass current controls unless validation remains a release gate.

### FCCSEC-2026-06-20-003 - Public evidence and affiliation wording must stay narrow

- Severity: MEDIUM
- Priority: P2
- Status: monitored
- Affected surface: `README.md`, `VERSION.md`, `SECURITY_SCOPE.md`, `docs/**`, public-facing summaries
- Description: The project contains local validation and defensive evidence, but public-facing wording must not imply official affiliation, endorsement, employment, certification, or broader validation than actually performed.
- Impact: Unsupported claims can weaken audit credibility and create reputational or governance risk.
- Evidence: Existing validation checks for unsupported affiliation language and stale scan/deploy references. Current docs state local-only scope and no active cloud workflow.
- Recommended correction: Keep all public summaries scoped to local defensive review and evidence-backed validation. Do not use claims such as official approval, certification, or guaranteed security.
- Validation: docs grep for unsupported affiliation and overclaim language; manual review before publication.
- Residual risk: Any new public copy, report, README update, or GitHub issue/comment can reintroduce claim drift.

### FCCSEC-2026-06-20-004 - Future backend, network, agent, or deploy path changes the threat model

- Severity: HIGH if introduced without review
- Priority: P1
- Status: deferred gate / not present in current runtime
- Affected surface: future architecture, `SECURITY_SCOPE.md`, `docs/threat-model/threat_model.md`, validation scripts
- Description: The current security posture depends on the project staying local-first and static. Adding backend services, API calls, package dependencies, GitHub automation, AI agents, external connectors, or deployment would create new trust boundaries.
- Impact: New trust boundaries could introduce credential exposure, unsafe tool use, remote ingestion, supply-chain risk, CI/CD risk, or unsupported public release assumptions.
- Evidence: Current scope explicitly excludes network, package install, deploy, CI/CD changes, commits, pushes, and GitHub writes. Current runtime has no package manager or network client.
- Recommended correction: Treat any future integration as a new review cycle requiring updated threat model, approval gates, validation checks, and docs.
- Validation: inspect scope docs, runtime files, package manifests, workflow files, and network/API sinks before any future release.
- Residual risk: Controlled by process; no runtime vulnerability is confirmed in the current static state.

## Non-Findings In Current State

- No confirmed backend, auth, database, telemetry, API client, or CI/CD workflow in the active local runtime.
- No configured Git remote in the current reviewed workflow.
- No unsafe runtime DOM, dynamic execution, timer-string, or network sink found by the current validation commands.
- No code patch is required for the current docs-only continuation.
