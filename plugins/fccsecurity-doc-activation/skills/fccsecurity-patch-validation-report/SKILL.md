---
name: fccsecurity-patch-validation-report
description: Activate FCCSecurity PATCH_VALIDATION_REPORT.md for docs-only validation evidence, preserved runtime guarantees, command results, and residual risk handoff.
---

# FCCSecurity Patch Validation Report Activation

Use this skill when the user asks to continue, verify, summarize, hand off, or update `PATCH_VALIDATION_REPORT.md` for FCCSecurity.

## Source Document

Read this file completely before acting:

```text
../../references/PATCH_VALIDATION_REPORT.md
```

## Activation Contract

1. Confirm the active workspace is the approved local FCCSecurity working copy before editing.
2. Preserve the distinction between docs-only changes and runtime changes.
3. Re-run or propose the report's validation commands depending on current approval.
4. Treat no-match `rg` exit code 1 as expected only when the output is empty and the command is a negative search.
5. Record command results, runtime files preserved, residual risk, and limitations.
6. Do not claim certification, endorsement, or external approval.

## Output

Return validation status with:

- changed files;
- preserved files;
- commands run;
- results;
- residual risk;
- next operational step.
