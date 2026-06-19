# Clean Project Bootstrap Evidence

Date: 2026-06-18 20:20:08 -03:00
Updated: 2026-06-18 20:20:30 -03:00

## Scope

- Backup source: `<old_onedrive_checkout>`
- Backup destination: `C:\tmp\FCCSecurity-backup-20260618T202007\FCCSecurity`
- Clean project: `C:\tmp\FCCSecurity-clean-20260618T202007`
- Network/deploy/package install/commit/push: not performed.
- Defender/OneDrive/ACL/ownership/sandbox config: not changed.

## Method

- Full filesystem backup copied to `C:\tmp` using read-only source access and local destination writes.
- Clean project created outside OneDrive using the validated mirror as source for the minimal local-first runtime and governance files.
- Raw historical scan artifacts were not copied into the clean project.
- No commit, push, hook, deploy, package install, network call, Defender change, OneDrive change, ACL change, ownership change, or sandbox configuration change was performed. Local Git metadata exists only because `git init` was run later; no staging, commit, remote, or cloud workflow is in use.

## Validation

- Backup file count: 400 files copied into the backup project directory.
- Clean project file count excluding local Git metadata: 16 files.
- Clean project includes runtime files: `index.html`, `styles.css`, `app.js`.
- Clean project includes governance files: `AGENTS.md`, `README.md`, `VERSION.md`, `SECURITY_SCOPE.md`, `SECURITY_POLICY.md`, `APPROVAL_GATES.md`, `SAFE_COMMAND_ALLOWLIST.md`, `DENYLISTED_ACTIONS.md`, `RUNTIME_GUARDRAILS.yaml`.
- Clean project includes `docs\threat-model\threat_model.md` and this bootstrap evidence file.
- Historical raw scan artifact directories are absent from the clean project by design.
- `node --check app.js`: passed.
- Runtime sink grep for unsafe DOM/dynamic execution/network APIs: no matches.

## Result

- Status: passed.
- The original OneDrive project was preserved as a backup under `C:\tmp`.
- A clean local-first project now exists outside the protected OneDrive path.

## Residual Risk

- The original OneDrive checkout remains subject to Controlled Folder Access write blocking.
- The clean project has local Git metadata from `git init`, but no staging, commit, remote, deploy, or package manifest is in use.





