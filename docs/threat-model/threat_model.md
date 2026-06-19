# FCC Security Threat Model

## Overview

FCC Security is a local-first defensive cyber intelligence dashboard. The active clean project runs as static HTML, CSS, and JavaScript from `C:\tmp\FCCSecurity-clean-20260618T202007`.

The project helps an operator organize defensive signals, threat model notes, validation state, local evidence, and next actions. It currently has no backend, authentication layer, package manager, database, external API, telemetry path, deployment automation, or active cloud workflow.

Primary assets:

- integrity of local validation and evidence receipts;
- accuracy of local-only project documentation;
- operator notes stored in browser `localStorage`;
- static runtime code that renders defensive intelligence data;
- backup integrity for the previous project copy under `C:\tmp`.

## Trust Boundaries And Assumptions

Trust boundaries:

- Browser UI boundary: JavaScript renders seed data and operator notes into the DOM.
- Local storage boundary: notes persist in the operator browser and must not be treated as a secret vault.
- Export boundary: JSON snapshots can include operator notes and must be handled as local evidence.
- Documentation boundary: docs must not imply public deployment, official affiliation, approval, or broader validation than performed.
- Backup boundary: the old OneDrive project is preserved as local backup, not the active write target.

Assumptions:

- The app is operated locally by an authorized user.
- No secrets, credentials, private incident data, third-party target data, or personal data should be entered into local notes.
- Future imported signal text must be treated as untrusted.
- Any public wording must remain factual, dated, scoped, and evidence-backed.

## Attack Surface And Mitigations

Current attack surface:

- static DOM rendering in `app.js`;
- `localStorage` note persistence;
- JSON snapshot export through browser APIs;
- local documentation that may later be reused as public evidence.

Existing mitigations:

- no backend, database, login, token, remote API, telemetry, service worker, or network client;
- deployable runtime has no package manager, dependency install, or build chain;
- rendering code uses DOM creation and `textContent` instead of string HTML injection;
- `localStorage` access is wrapped with safe fallback functions;
- operator notes are bounded to 4000 characters before persistence or export;
- exported JSON includes `exportPolicy` metadata for note inclusion, truncation, and storage availability;
- repository rules forbid external scanning, malware, credential theft, unsupported public claims, and cloud writes without explicit approval.

Relevant attacker stories:

- A future imported signal contains HTML or script and attempts DOM injection.
- Operator notes accidentally include sensitive content and are exported to JSON.
- Local evidence is later published without sanitization or with unsupported claims.
- A future backend, connector, package manager, or deployment path changes the threat model without review.

Out-of-scope stories for the current state:

- server-side request forgery, auth bypass, tenant isolation failure, SQL injection, and backend privilege escalation, because no server or database exists.
- supply-chain compromise through package dependencies, because no package manager is present in the clean runtime.
- exploitation of third-party systems, because this repository is defensive and local-only.

## Severity Calibration

Critical:

- A future backend or connector exposes credentials, private scan data, or remote execution paths.
- A public deploy introduces automatic ingestion from untrusted remote sources and renders attacker content unsafely.

High:

- Imported signal content reaches unsafe DOM sinks such as `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, or `new Function`.
- Documentation falsely claims official affiliation, privileged access, external approval, or completed validation that did not occur.

Medium:

- Evidence or inventory docs drift from project reality and weaken auditability.
- Snapshot export includes sensitive operator notes because the operator used localStorage as a secret store.

Low:

- UI-only defects that misclassify local sample data without changing security decisions.
- Local documentation mentions backup paths as audit metadata without exposing secrets or public endpoints.
