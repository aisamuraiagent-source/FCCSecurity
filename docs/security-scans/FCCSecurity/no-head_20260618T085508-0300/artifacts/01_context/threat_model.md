# FCC Security Threat Model

## Overview

FCC Security is a local-first defensive cyber intelligence dashboard. The first runtime surface is a static HTML, CSS, and JavaScript application that helps an operator organize security signals, threat model notes, validation state, Codex Security receipts, and next actions.

The repository supports Codex-assisted defensive workflows and repeatable Codex Security scans. It currently has no backend, authentication layer, package manager, database, external API, telemetry path, or deployment automation.

Primary assets:

- credibility of public security evidence and portfolio wording;
- integrity of local validation and scan receipts;
- operator notes stored in browser localStorage;
- threat model and validation docs used to guide future review;
- static runtime code that renders defensive intelligence data.

## Threat Model, Trust Boundaries, and Assumptions

Trust boundaries:

- Browser UI boundary: local JavaScript renders static seed data and operator notes into the DOM.
- Local storage boundary: notes persist in the operator browser and must not be treated as a secret vault.
- Documentation boundary: public or shareable Markdown can create reputational risk if it overclaims validation, OpenAI affiliation, DayBreak status, or Codex Security usage.
- Scan workflow boundary: future Codex Security artifacts must distinguish discovery, validation, attack-path analysis, and final report evidence.
- Deployment boundary: static files may be hosted later, but no external deploy is part of the current repository state.

Attacker-controlled inputs in the current prototype are limited to local operator notes and any future imported signal text. Developer-controlled inputs include seed data in `app.js`, docs, and static assets. Operator-controlled inputs include UI filter choices, selected signal state, notes, and exported snapshots.

Assumptions:

- The app is operated locally by an authorized user.
- No secrets, credentials, private incident data, or third-party target data should be entered into local notes.
- Future ingestion of real logs, advisories, or scan outputs must treat imported text as untrusted.
- Any public wording must remain factual and evidence-backed.

## Attack Surface, Mitigations, and Attacker Stories

Current attack surface:

- static DOM rendering in `app.js`;
- localStorage note persistence;
- JSON snapshot export through browser APIs;
- Markdown documentation that may later be published or used as portfolio evidence.

Existing mitigations:

- no backend, database, login, token, or remote API;
- no dependency install or build chain;
- rendering code uses DOM creation and `textContent` instead of string HTML injection;
- docs explicitly state the completed Codex Security repo-wide scan result and local report paths;
- repository rules forbid external scanning, malware, credential theft, and unsupported public claims.

Relevant attacker stories:

- A future imported signal contains HTML or script and attempts DOM injection.
- A public README or evidence file implies validation that was not performed.
- Operator notes accidentally store sensitive information and a local user exports the snapshot.
- A later deploy configuration exposes files that were intended to stay local.

Out-of-scope stories for the current state:

- server-side request forgery, auth bypass, tenant isolation failure, SQL injection, and backend privilege escalation, because no server or database exists.
- supply-chain compromise through package dependencies, because no package manager is present.
- exploitation of third-party systems, because this repository is defensive and local-only.

## Severity Calibration (Critical, High, Medium, Low)

Critical:

- A future backend or connector exposes credentials, private scan data, or remote execution paths.
- A public deploy introduces automatic ingestion from untrusted remote sources and renders attacker content unsafely.

High:

- Imported signal content reaches unsafe DOM sinks such as `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, or `new Function`.
- Documentation falsely claims official affiliation, privileged access, or completed validation that did not occur.

Medium:

- Evidence or inventory docs drift from repository reality and weaken auditability.
- Snapshot export includes sensitive operator notes because the operator used localStorage as a secret store.

Low:

- UI-only defects that misclassify local sample data without changing public claims or security decisions.
- Static deployment misconfiguration with no secrets, no private data, and no sensitive runtime path exposed.
