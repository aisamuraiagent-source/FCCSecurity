# Attack-Path Analysis Report

Scan: `no-head_20260618T085508-0300`

Candidates entering attack-path analysis: 2.

## Final Decisions

| Candidate ID | Validation Disposition | Final Policy Decision | Final Severity | Priority | Reason |
|---|---|---|---|---|---|
| `FCS-DOC-PATH-001` | reportable | ignore | ignore | none | Real metadata exposure, but low impact, unknown publication likelihood, no secret/runtime sink, and no attacker-controlled path. |
| `FCCSEC-DOC-001` | reportable | reportable | MEDIUM | P2 | Public/OpenAI-facing documentation overstates static/no-dependency posture relative to optional Python PDF tooling. |

## Notes

- No HIGH or CRITICAL findings survived.
- No runtime exploit path was identified.
- No backend, auth, external API, package manifest, telemetry, or deployment automation was found in the deployable app surface.
- No network access was used during attack-path analysis.
