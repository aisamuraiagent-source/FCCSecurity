# Public Release Gate

Date: 2026-06-16

This gate defines how to move from local evidence to a public GitHub or static deployment without overclaiming OpenAI affiliation, Codex Security results, or operational capability.

## Decision

Recommended path: request wording/release review first, then publish a sanitized GitHub repository, then optionally deploy a static preview.

Do not publish the current local package unchanged. It contains local artifact paths and internal evidence references that are useful for audit but should be sanitized before public release.

Current gate status on 2026-06-16:

```text
OpenAI Developer Community submission created.
Account temporarily on hold by automated moderation pending staff review.
No OpenAI approval, endorsement, or release authorization has been received.
Private GitHub, public GitHub, GitHub Pages, and Netlify remain blocked by user decision until review.
```

## Release Options

### Option A: Private GitHub Repository First

Best first step.

- Preserve evidence and history privately.
- Share the repo link with reviewers.
- Avoid public indexing while wording is reviewed.
- Attach `report.md`, `report.html`, ZIP hash, and screenshot as release artifacts or issue attachments.

### Option B: Public GitHub Repository

Use only after the public wording is sanitized.

Required changes before public release:

- replace absolute local paths with relative artifact descriptions;
- add a non-affiliation disclaimer;
- keep OpenAI/Codex references factual and secondary;
- avoid OpenAI logos, marks, or model names in the project title;
- keep "cyber intelligence" framed as defensive evidence organization, not national-security or surveillance work;
- include a clear "no offensive capability" statement;
- include the final scan summary without exposing private machine paths.

### Option C: Static Deploy Preview

Use after GitHub sanitation.

Acceptable targets:

- GitHub Pages;
- Netlify;
- Cloudflare Pages;
- local downloadable ZIP only.

Static deploy must not add:

- backend;
- login;
- analytics/telemetry;
- API key;
- remote ingestion;
- automated scanning;
- hidden background jobs.

## Public Disclaimer

Use this exact disclaimer in the public README before deploy:

```text
FCC Security is an independent local-first defensive security prototype by Renan Raad. It is not affiliated with, endorsed by, or sponsored by OpenAI. References to Codex or Codex Security describe tools/workflows used during local development and review. The project does not perform external scanning, exploitation, credential collection, malware activity, telemetry, or production monitoring.
```

## Evidence Bundle

Current local evidence:

```text
C:\tmp\codex-security-scans\FCCSecurity\no-head_20260616T102807-0300\report.md
C:\tmp\codex-security-scans\FCCSecurity\no-head_20260616T102807-0300\report.html
C:\tmp\fccsecurity-frontier-cyber-intelligence.zip
C:\tmp\fccsecurity-frontier-cyber-intelligence.zip.sha256
C:\tmp\fccsecurity-final-desktop.png
```

SHA-256 receipt:

```text
C:\tmp\fccsecurity-frontier-cyber-intelligence.zip.sha256
```

## Release Checklist

- [ ] Sanitize absolute local paths from public docs.
- [ ] Add public disclaimer to README.
- [ ] Keep scan result factual: "zero reportable findings survived" instead of "secure".
- [ ] Keep OpenAI references secondary and factual.
- [ ] Remove or rewrite any phrase that implies OpenAI approval before approval exists.
- [ ] Wait for review before creating private GitHub under the current user decision.
- [ ] Deploy static preview only after review/sanitation.
- [ ] Re-run `node --check app.js`.
- [ ] Re-run runtime sink grep.
- [ ] Regenerate ZIP and SHA-256 after public copy is sanitized.
