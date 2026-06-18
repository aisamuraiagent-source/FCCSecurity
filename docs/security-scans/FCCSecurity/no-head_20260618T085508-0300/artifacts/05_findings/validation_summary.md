# Validation Summary

Scan: `no-head_20260618T085508-0300`

Candidates entering validation: 2.

Candidates surviving validation: 2.

## Results

| Candidate ID | Severity | Disposition | Confidence | Survives | Validation Method |
|---|---|---|---:|---|---|
| `FCS-DOC-PATH-001` | LOW | reportable | 0.86 | yes | full-file line verification plus targeted `rg` on affected documentation files |
| `FCCSEC-DOC-001` | MEDIUM | reportable | 0.86 | yes | full-file line-numbered static review, targeted `rg`, and repo-state checks |

## Notes

- No dynamic PoC was needed because both candidates are documentation/evidence-boundary issues.
- No network access, package installation, or source-code modifications were performed.
- Both findings require remediation or explicit risk acceptance before public release.
