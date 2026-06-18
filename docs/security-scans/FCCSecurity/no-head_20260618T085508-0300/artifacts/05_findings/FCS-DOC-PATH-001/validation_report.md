# Validation Report: FCS-DOC-PATH-001

Finding title: Public evidence docs expose workstation-specific absolute paths.

Instance key: `doc-path-disclosure:docs/evidence+docs/validation`

Disposition: `reportable`

Survives validation: yes

Confidence: 0.86

## Rubric

- [x] Claimed files and affected lines exist.
- [x] Claimed lines contained absolute local workstation paths or local `file:///...` URLs before sanitization.
- [x] Paths reveal local username/workstation directory layout rather than project-relative evidence.
- [x] Content sits in evidence/validation documentation likely to be shared as audit material.
- [x] No secret/token was observed in the reviewed lines, so impact is bounded to local path disclosure.

## Evidence Observed

- `docs/evidence/implementation_evidence.md:5` contains an unredacted local repository path under `<user_profile>\...`.
- `docs/evidence/implementation_evidence.md:35` contained an unredacted local Codex generated-image cache path.
- `docs/validation/local_validation.md:12-14` contain Chrome commands with `file:///<user_profile>/.../FCCSecurity/index.html`.

Validation command evidence:

- Targeted `rg` over `docs/evidence/implementation_evidence.md` and `docs/validation/local_validation.md` confirmed the same locations.

## Assessment

The candidate is valid as a LOW information disclosure / sanitization issue in public-facing evidence documentation. The effect is local environment disclosure and audit hygiene degradation, not runtime compromise.

No credentials, API keys, tokens, private keys, or reachable URLs were observed in the affected lines.

Remaining uncertainty: remote/public publication state was not checked because network access was not used in this scan.

## Closure Table

| Ledger Row ID | Instance Key | Root-Control File:Line | Entrypoint/Source | Sink/Control | Disposition | Counterevidence or Proof Gap | Survives |
|---|---|---|---|---|---|---|---|
| `DOC-PATH-001` | `doc-path-disclosure:docs/evidence+docs/validation` | `docs/evidence/implementation_evidence.md:5`, `docs/evidence/implementation_evidence.md:35`, `docs/validation/local_validation.md:12-14` | public/security evidence reader | absolute local paths in docs | reportable | no secrets observed; public publication state not checked | yes |
