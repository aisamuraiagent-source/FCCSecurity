# Remediation Backlog

Date: 2026-06-20
Mode: docs-only defensive continuation.
Workspace: `C:\tmp\FCCSecurity-clean-20260618T202007`

## Backlog Summary

The current review does not require a runtime patch. The backlog is focused on preserving controls, preventing future drift, and defining gates for any later expansion beyond the static local-first model.

## Items

| ID | Severity | Owner | Status | Action | Validation |
| --- | --- | --- | --- | --- | --- |
| RB-001 | MEDIUM | Operator / maintainer | Open | Keep note/export warnings visible and sanitize snapshots before sharing. | Review `README.md`, threat model, `exportPolicy`, and any exported JSON before publication. |
| RB-002 | HIGH if future import exists | Maintainer | Open gate | Require sink checks and text-safe rendering for any future imported signal path. | `node scripts\validate-local.js` and runtime sink grep must pass. |
| RB-003 | MEDIUM | Maintainer | Open | Review public wording before README, report, issue, portfolio, or release reuse. | Docs grep plus manual evidence review. |
| RB-004 | HIGH if future integration exists | Maintainer / approver | Deferred gate | Update threat model before adding backend, API, AI agent, connector, package dependency, CI/CD, deploy, GitHub action, or network path. | New review cycle with updated scope, findings, tests, and approval gates. |
| RB-005 | LOW | Maintainer | Open | Keep `C:\tmp\FCCSecurity-clean-20260618T202007` as active operational workspace. | Check `ACTIVE_WORKSPACE.md`, `SECURITY_SCOPE.md`, and working directory before action. |

## Acceptance Criteria

- Runtime validation remains green.
- No unsafe runtime sinks or network client APIs are introduced.
- Docs do not include unsupported affiliation, certification, approval, or zero-risk claims.
- Any future non-static capability has an updated threat model before implementation.
- Any public evidence is sanitized before publication.

## No-Change Decision

No runtime code remediation is recommended in this docs-only pass because current evidence supports that the existing hardening controls are present and passing. The next approved work should either remain docs/evidence-only or explicitly authorize a new technical change.
