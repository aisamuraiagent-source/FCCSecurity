# Safety Test Plan

Date: 2026-06-21
Mode: docs-only defensive continuation on an `origin/main`-based branch.
Workspace: `C:\tmp\FCCSecurity-clean-20260618T202007`

## Scope

This plan covers the current local-first FCC Security workspace only.

In scope:

- static runtime: `index.html`, `styles.css`, `app.js`;
- existing validation evidence: `docs/validation/local_validation.md`;
- docs-only governance artifacts added in this branch;
- local plugin bundle under `plugins/fccsecurity-doc-activation`;
- local-only review of current files.

Out of scope:

- merge to `main`;
- deploy;
- package installation;
- CI/CD changes;
- runtime code changes in this docs-only continuation;
- external scanning, exploitation, credential collection, or third-party targets.

## Defensive Passes

### Pass A - Defensive Reviewer

Goal: confirm the project shape, trust boundaries, and realistic risk surfaces.

Checks:

- confirm active workspace path and branch state;
- confirm static runtime shape;
- confirm no package manifest or dependency install path is required for runtime;
- inspect docs for local-only scope, no unsupported public claims, and no stale active workspace references;
- identify residual risks around local notes, JSON export, public wording, and future integrations.

### Pass B - Safe Adversarial Critic

Goal: challenge the analysis without producing exploit payloads or offensive steps.

Checks:

- look for evidence that documented controls are broader than the code proves;
- look for mismatch between threat model, README, validation evidence, and runtime;
- check whether future imported signal text could bypass rendering controls if coding patterns change;
- check whether local notes/export can accidentally carry sensitive content;
- check whether any future network, backend, connector, agent, or deploy path would invalidate the current threat model.

### Pass C - Verifier

Goal: prove current controls are still true after docs-only changes.

Commands:

```powershell
node --check app.js
rg -n "innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function|setTimeout\s*\(|setInterval\s*\(|fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|javascript:" index.html app.js styles.css -S
$sentinelPatterns = @(('<local-user-' + 'path>'),('<unsupported-affiliation-' + 'claim>'),('<zero-risk-' + 'claim>'),('<stale-scan-' + 'path>'))
$docPaths = @('README.md','VERSION.md','SAFETY_TEST_PLAN.md','SECURITY_FINDINGS.md','REMEDIATION_BACKLOG.md','PATCH_VALIDATION_REPORT.md') + (Get-ChildItem -LiteralPath 'docs','plugins' -Recurse -File | ForEach-Object { $_.FullName })
Select-String -Path $docPaths -Pattern $sentinelPatterns -SimpleMatch
git diff --check
```

## Test Matrix

| Area | Risk | Current check | Expected result | Gate |
| --- | --- | --- | --- | --- |
| Workspace selection | Work happens in deprecated OneDrive checkout | Current path plus `git status` | Active path is `C:\tmp\FCCSecurity-clean-20260618T202007` | Block work if wrong path |
| Runtime syntax | Static JS has syntax regression | `node --check app.js` | Exit 0 | Block release if failing |
| Unsafe runtime sinks | Future UI renders untrusted data unsafely | sink grep against runtime files | No matches | HIGH if introduced |
| Network/client APIs | Local-only claim becomes false | sink/network grep | No matches | HIGH if introduced |
| Docs sanitization | Local usernames or unsupported claims leak | docs check using local sanitized policy terms | No output | MEDIUM/HIGH depending claim |
| Local notes | Operator stores sensitive text | threat model and UI policy | Warn, bound, and treat export as local evidence | MEDIUM residual |
| Future integrations | Backend/agent/deploy changes threat model | docs gate | Require new review before change | HIGH gate |

## Evidence Handling

- Do not print secrets, tokens, cookies, private keys, or private incident data.
- Prefer file names and control status over raw sensitive line output.
- Keep public claims factual, scoped, dated, and tied to local validation evidence.
- Treat local paths as operational evidence for private repo work; sanitize before public use.
