---
name: fccsecurity-docs-only
description: Activate the complete FCCSecurity docs-only defensive workflow, including safety test plan, findings, remediation backlog, and patch validation report.
---

# FCCSecurity Docs-Only Activation

Use this skill when the user says `continuar FCCSecurity docs-only`, asks to activate the FCCSecurity docs-only workflow, or wants the four defensive Markdown artifacts treated as one local plugin workflow.

## Source Documents

Read these files completely before acting:

```text
../../references/SAFETY_TEST_PLAN.md
../../references/SECURITY_FINDINGS.md
../../references/REMEDIATION_BACKLOG.md
../../references/PATCH_VALIDATION_REPORT.md
```

## Activation Contract

1. Confirm the working target is `C:\tmp\FCCSecurity-clean-20260618T202007` when touching the FCCSecurity repo.
2. Keep scope docs-only and local-only unless the user explicitly authorizes runtime changes, network, install, deploy, GitHub, commit, or push.
3. Use the four references as the operating bundle:
   - `SAFETY_TEST_PLAN.md` defines review passes and validation checks.
   - `SECURITY_FINDINGS.md` defines classified risks and residual controls.
   - `REMEDIATION_BACKLOG.md` defines gates, owners, and acceptance criteria.
   - `PATCH_VALIDATION_REPORT.md` defines validation evidence and preserved runtime guarantees.
4. Do not claim certification, endorsement, official approval, or zero-risk status.
5. Treat no-match `rg` exit code 1 as expected only for negative searches with empty output.
6. Return one audit-ready summary with scope, actions, evidence, residual risk, and next control.

## Default Validation Set

When execution is approved, prefer:

```powershell
node --check app.js
node scripts\validate-local.js
rg -n "innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function|setTimeout\s*\(|setInterval\s*\(|fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|javascript:" index.html app.js styles.css -S
$sentinelPatterns = @(('<local-user-' + 'path>'),('<unsupported-affiliation-' + 'claim>'),('<zero-risk-' + 'claim>'),('<stale-scan-' + 'path>'))
$docPaths = @('README.md','VERSION.md','SECURITY_SCOPE.md','SAFETY_TEST_PLAN.md','SECURITY_FINDINGS.md','REMEDIATION_BACKLOG.md','PATCH_VALIDATION_REPORT.md') + (Get-ChildItem -LiteralPath 'docs' -Recurse -File | ForEach-Object { $_.FullName })
Select-String -Path $docPaths -Pattern $sentinelPatterns -SimpleMatch
git diff --check
```
