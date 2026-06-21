---
name: fccsecurity-safety-test-plan
description: Activate FCCSecurity SAFETY_TEST_PLAN.md for local-only defensive test planning, safety review passes, validation command selection, and evidence handling.
---

# FCCSecurity Safety Test Plan Activation

Use this skill when the user asks to continue, apply, review, validate, or operationalize `SAFETY_TEST_PLAN.md` for FCCSecurity.

## Source Document

Read this file completely before acting:

```text
../../references/SAFETY_TEST_PLAN.md
```

## Activation Contract

1. Confirm the active workspace is `C:\tmp\FCCSecurity-clean-20260618T202007`.
2. Preserve docs-only/local-only scope unless the user explicitly authorizes a broader action.
3. Use the plan's three passes:
   - Defensive Reviewer
   - Safe Adversarial Critic
   - Verifier
4. Prefer the validation commands listed in the source document.
5. Do not run network, install, deploy, GitHub write, commit, push, hook, or destructive commands.
6. Report what was checked, what passed, what failed, and residual risk.

## Output

Return a concise audit-ready summary with:

- scope;
- commands used or proposed;
- observed results;
- limitations;
- next control.
