# Security Scope

Date: 2026-06-18
Mode: local-only defensive build and validation.

## Authorized Target

- Project: FCC Security / Frontier Cyber Intelligence.
- Current workspace: `C:\tmp\FCCSecurity-clean-20260618T202007`.
- Local backup: `C:\tmp\FCCSecurity-backup-20260618T202007\FCCSecurity`.
- Environment: local development / sanitized lab.
- Git remote: none in use for this workflow.

## In Scope

- Static runtime: `index.html`, `styles.css`, `app.js`.
- Governance docs: `AGENTS.md`, `README.md`, `VERSION.md`, `SECURITY_SCOPE.md`, `SECURITY_POLICY.md`, `APPROVAL_GATES.md`, `SAFE_COMMAND_ALLOWLIST.md`, `DENYLISTED_ACTIONS.md`, `RUNTIME_GUARDRAILS.yaml`.
- Threat model: `docs/threat-model/threat_model.md`.
- Evidence and validation under `docs/evidence/**` and `docs/validation/**`.

## Out Of Scope

- External target scanning, exploitation, brute force, malware, persistence, evasion, credential collection, or exfiltration.
- Network access, package installation, deploy, GitHub write actions, CI/CD changes, commits, pushes, or hooks.
- Secrets, credentials, private incident data, production systems, and third-party assets.
- Raw historical scan artifacts in the previous project copy; they remain backup material, not active clean-project evidence.
- The former OneDrive checkout at `<deprecated_onedrive_checkout>` is out of scope for operational work, patching, validation, packaging, and current evidence.

## Operational Constraint

The OneDrive checkout had host-level write blocking. The active workflow is therefore local-only in `C:\tmp\FCCSecurity-clean-20260618T202007`, with the old project preserved only as backup and no cloud publication path active.

If any tool starts in the OneDrive path, treat that as a workspace-selection fault and switch to the active C:\tmp workspace before continuing.


