# Attack-Path Analysis: FCS-DOC-PATH-001

Finding title: Public evidence docs expose workstation-specific absolute paths.

Final policy decision: `ignore`

Final severity: `ignore`

Priority: none

## Attack Path

1. Evidence/validation Markdown contains local workstation paths under `C:\Users\vtcom\...` and `file:///C:/Users/...`.
2. If these documents are published or shared externally, a reader can observe the workstation username and local path conventions.
3. The exposed values are metadata only; no credential, token, private incident data, runtime sink, backend, or deploy path is present in the affected lines.

## Attack Path Facts

- Assumptions: documentation/public evidence is in scope; no backend/deploy currently; public wording must be factual and sanitized.
- Context: documentation boundary only; no runtime, auth, identity, or data boundary crossing is verified.
- In-scope status: in scope as public/security evidence hygiene under the threat model.
- Exposure: unknown; public only if docs are published or shared.
- Identity: none.
- Cross-boundary behavior: not verified beyond documentation exposure.
- Vector: unknown.
- Preconditions: docs must be published/shared; reader observes local absolute paths.
- Attacker input control: no.
- Category: documentation path metadata disclosure.
- Mitigations: no backend, database, login, external API, token, credential, or private incident data in affected lines.
- Auth scope: public-reader only if shared; otherwise local repository documentation.
- Impact surface: documentation privacy, reputation, auditability.
- Counterevidence: paths are documentation evidence, not runtime sinks; no deploy/backend currently evidenced; no attacker-controlled input path.
- Blindspots: actual publication state not checked; no network used.
- Controls: replace public paths with `<repo_root>`, `<tmp_dir>`, and private generated-image placeholders.
- Confidence: medium-high.

## Severity Calibration

- Impact: low.
- Likelihood: unknown.
- Policy matrix result: `impact=low`, `likelihood=unknown` => `ignore`.

The candidate remains useful as a hygiene backlog item, but it is not a final reportable security finding under the attack-path severity policy.
