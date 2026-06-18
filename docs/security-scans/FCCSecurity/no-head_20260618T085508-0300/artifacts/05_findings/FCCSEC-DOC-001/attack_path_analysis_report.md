# Attack-Path Analysis: FCCSEC-DOC-001

Finding title: OpenAI-facing wording overstates no dependency install/static-only posture while repo contains optional Python PDF tooling with third-party imports.

Final policy decision: `reportable`

Final severity: `MEDIUM`

Priority: `P2`

## Attack Path

1. Public/OpenAI-facing Markdown says the project is static HTML/CSS/JavaScript only and has no dependency install.
2. The repository also contains optional local PDF tooling in `scripts/generate_profile_pdfs.py`.
3. That tooling imports third-party Python libraries: `PIL`, `pypdf`, `reportlab`, and optionally `pypdfium2`.
4. A reviewer consuming the docs as evidence can reasonably infer that the entire repository is dependency-free/static-only, not only the deployable dashboard runtime.
5. The resulting harm is documentation/evidence drift across the public/OpenAI review boundary, not runtime exploitation.

## Attack Path Facts

- Assumptions: OpenAI/public documentation wording is in scope; claims must be factual and evidence-backed; no backend or external deploy currently exists; optional Python PDF tooling exists.
- Context: public claims and audit evidence integrity are the affected surface.
- In-scope status: in scope under the threat model's documentation/public evidence boundary.
- Exposure: OpenAI-facing/public-prep Markdown; external publication not verified.
- Identity: none; no service account or managed identity.
- Cross-boundary behavior: documentation/evidence trust boundary only.
- Vector: remote if published or shared as intended; no runtime vector.
- Preconditions: reader/reviewer consumes the affected docs as evidence.
- Attacker input control: no runtime attacker control; this is author-controlled wording drift.
- Category: documentation/evidence drift.
- Mitigations already present: no package-manager manifest found; Python tooling appears optional/local; static deployable dashboard remains HTML/CSS/JavaScript; no OpenAI approval/affiliation claim observed; no external deployment observed; no secret exposure observed; no runtime unsafe DOM sink observed.
- Auth scope: public-reader if shared; otherwise local repo documentation.
- Impact surface: public claims and audit evidence integrity.
- Target reach: repository documentation only.
- Secrets references: none.
- Counterevidence: static runtime claim is true for the deployable dashboard; optional tooling is not part of the runtime; no package manifest exists.
- Blindspots: publication state and local Python package installation state were not checked because the scan did not use network or install checks.
- Controls: scope static/no-dependency claim to deployable runtime and document optional local Python PDF tooling separately.
- Confidence: 0.82.

## Severity Calibration

- Impact: medium.
- Likelihood: high inside the public/OpenAI documentation boundary because the affected files are explicitly public-prep/OpenAI-facing artifacts.
- Policy matrix result: `impact=medium`, `likelihood=high` => `MEDIUM`.
- Priority: `P2`.

The finding is reportable because the repository threat model explicitly treats public/shareable Markdown and evidence drift as security-relevant, and the wording is currently broader than the repository evidence supports.
