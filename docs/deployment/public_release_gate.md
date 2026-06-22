# Public Release Gate

Date: 2026-06-21
Status: repository-publication gate passed for the sanitized PR state after merge. Static deploy remains out of scope until a fresh public ZIP and SHA-256 are generated.

No OpenAI approval, endorsement, partnership, certification, or release authorization has been received. Public wording must remain independent, factual, defensive, and limited to evidence observed in this repository.

## Publication Decision

GitHub repository visibility may be changed to public only after the sanitized PR is merged into `main`.

Reason:

- `main` is the public default branch;
- the PR contains the evidence-integrity and publication-sanitization updates;
- publishing before merge would expose the older default-branch state;
- no technical branch-protection enforcement is claimed.

Static deploy, GitHub Pages, Netlify, package release, external scan, CI/CD, and status checks remain out of scope for this gate.

## Public Scope

Allowed for public GitHub visibility:

- static local-first runtime: `index.html`, `styles.css`, `app.js`;
- defensive documentation and threat model;
- dated historical scan receipts under `docs/security-scans/**`;
- local validation script and evidence manifest;
- local plugin bundle used as documentation/workflow reference.

Not included:

- backend;
- login;
- analytics or telemetry;
- API key;
- remote ingestion;
- automated scanning;
- hidden background jobs;
- production monitoring;
- external deployment.

## Public Disclaimer

Use this exact disclaimer in public surfaces:

```text
FCC Security is an independent local-first defensive security prototype by Renan Raad. It is not affiliated with, endorsed by, or sponsored by OpenAI. References to Codex or Codex Security describe tools/workflows used during local development and review. The project does not perform external scanning, exploitation, credential collection, malware activity, telemetry, or production monitoring.
FCC Security é um protótipo independente de segurança defensiva local-first de Renan Raad. Não é afiliado, endossado ou patrocinado pela OpenAI. Referências a Codex ou Codex Security descrevem ferramentas e fluxos usados durante desenvolvimento e revisão locais. O projeto não realiza varredura externa, exploração, coleta de credenciais, atividade de malware, telemetria ou monitoramento de produção.
```

## Evidence Bundle

Historical local scan receipts are preserved as dated artifacts, not as a fresh release gate:

```text
docs/security-scans/FCCSecurity/no-head_20260618T085508-0300/report.md
docs/security-scans/FCCSecurity/no-head_20260618T085508-0300/report.html
```

Current validation for publication must use:

```powershell
node --check app.js
node scripts\validate-local.js
git diff --check
```

## Release Checklist

- [x] Sanitize actual absolute local paths from public docs and helper scripts.
- [x] Add public non-affiliation disclaimer to README.
- [x] Keep scan result factual, dated, and historical instead of using broad secure/zero-risk wording.
- [x] Keep OpenAI/Codex references secondary and factual.
- [x] Remove or rewrite any phrase that implies OpenAI approval, certification, partnership, or endorsement.
- [x] Review `docs/security-scans/**` as historical defensive artifacts.
- [x] Decide that PR #3 should enter `main` before public visibility because `main` is the public default branch.
- [x] Re-run `node --check app.js`.
- [x] Re-run local evidence/publication validator.
- [x] Re-run `git diff --check`.
- [ ] Regenerate ZIP and SHA-256 only if a separate public static package/deploy is requested.
- [ ] Enable technical branch protection/ruleset enforcement only after a separate GitHub governance step.

## Name And Description Decision

Repository name `FCCSecurity` is acceptable for public GitHub visibility because it does not imply official affiliation, certification, or OpenAI approval.

Recommended public description:

```text
Local-first defensive security prototype for threat modeling, validation, and audit-ready evidence. No external scanning, telemetry, or OpenAI affiliation.
```

## Branch Protection Status

Branch protection policy is documented as `main-protection-documentation-only`.
Ruleset enforcement remains disabled until explicitly enabled in GitHub after publication/governance review.
No technical branch protection is claimed. Current control is manual branch/PR discipline plus evidence logging.