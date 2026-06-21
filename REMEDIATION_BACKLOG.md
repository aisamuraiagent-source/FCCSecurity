# Remediation Backlog

Date: 2026-06-21
Mode: evidence-integrity defensive patch on an `origin/main`-based branch.
Workspace: `C:\tmp\FCCSecurity-clean-20260618T202007`

## Backlog Summary

The current review applied a narrow runtime/docs validation patch to close evidence-integrity drift. The backlog is focused on preserving controls, preventing future drift, and defining gates for any later expansion beyond the static local-first model.

## Items

| ID | Severity | Owner | Status | Action | Validation |
| --- | --- | --- | --- | --- | --- |
| RB-001 | MEDIUM | Operator / maintainer | Controlled / monitor | Keep note/export warnings visible and sanitize snapshots before sharing. | `node scripts\validate-local.js`; review `README.md`, threat model, localStorage/export code paths, and any exported JSON before publication. |
| RB-002 | HIGH if future import exists | Maintainer | Open gate | Require sink checks and text-safe rendering for any future imported signal path. | Runtime sink grep must pass over `index.html`, `app.js`, and `styles.css`. |
| RB-003 | MEDIUM | Maintainer | Controlled / monitor | Review public wording before README, report, issue, portfolio, or release reuse. | `node scripts\validate-local.js` plus manual evidence review. |
| RB-004 | HIGH if future integration exists | Maintainer / approver | Deferred gate | Update threat model before adding backend, API, AI agent, connector, package dependency, CI/CD, deploy, GitHub Action, or network path. | New review cycle with updated scope, findings, tests, and approval gates. |
| RB-005 | LOW | Maintainer | Open | Keep `C:\tmp\FCCSecurity-clean-20260618T202007` as active local workspace for this branch work. | Check current path, branch, and `git status` before action. |
| RB-006 | MEDIUM | Maintainer | Controlled / regenerate after commit | Keep `docs/evidence/evidence_manifest.json` tied to current commit/worktree state before any public package. | Update manifest after commit, then run `node scripts\validate-local.js`. |
| RB-007 | MEDIUM | Maintainer / approver | Deferred gate | Add CI/ruleset checks only after explicit approval for CI/CD changes. | Require PR/status-check policy and update this backlog before merge/publication. |

## Acceptance Criteria

- Runtime syntax validation remains green.
- Local evidence validator remains green.
- No unsafe runtime sinks or network client APIs are introduced.
- Live docs do not include unsupported affiliation, certification, approval, fresh-scan, release-gate, or zero-risk claims.
- UI/export state remains clearly `session-only` unless durable approval history is implemented.
- Any future non-static capability has an updated threat model before implementation.
- Any public evidence is sanitized before publication.
