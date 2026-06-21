# FCCSecurity Doc Activation Plugin

Local Codex plugin for activating the complete FCCSecurity docs-only defensive workflow.

## Primary Skill

- `fccsecurity-docs-only`: activates the full `continuar FCCSecurity docs-only` workflow.

## Artifact Skills

- `fccsecurity-safety-test-plan`: loads `SAFETY_TEST_PLAN.md`.
- `fccsecurity-security-findings`: loads `SECURITY_FINDINGS.md`.
- `fccsecurity-remediation-backlog`: loads `REMEDIATION_BACKLOG.md`.
- `fccsecurity-patch-validation-report`: loads `PATCH_VALIDATION_REPORT.md`.

## Bundled References

The four Markdown artifacts are copied into `references/` so the installed plugin is self-contained and does not depend on repo-relative paths.

## Operating Limits

- Local-only.
- No network.
- No package install.
- No deploy.
- No commit or push.
- No runtime edits unless explicitly authorized in a later turn.
