---
name: fccsecurity-security-findings
description: Activate FCCSecurity SECURITY_FINDINGS.md for classified findings, residual risk review, evidence-backed severity decisions, and no-overclaim defensive reporting.
---

# FCCSecurity Security Findings Activation

Use this skill when the user asks to continue, review, update, triage, or explain `SECURITY_FINDINGS.md` for FCCSecurity.

## Source Document

Read this file completely before acting:

```text
../../references/SECURITY_FINDINGS.md
```

## Activation Contract

1. Confirm the active workspace is `C:\tmp\FCCSecurity-clean-20260618T202007`.
2. Treat listed findings as defensive controls and residual risks, not public certification.
3. Preserve severity, evidence, recommended correction, validation, residual risk, and status fields.
4. Do not invent vulnerabilities when evidence supports only a process or documentation risk.
5. Keep public wording factual, scoped, and free of unsupported affiliation or approval claims.
6. Escalate any future backend, connector, agent, deploy, package, or network change to a new review cycle.

## Output

Return prioritized findings with:

- ID;
- severity;
- status;
- evidence;
- recommended correction;
- validation;
- residual risk.
