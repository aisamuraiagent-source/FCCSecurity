# Active Workspace Lock

Date: 2026-06-19

## Authoritative Workspace

The only active FCCSecurity workspace is:

```text
C:\tmp\FCCSecurity-clean-20260618T202007
```

## Deprecated Workspace

The former OneDrive checkout is deprecated for operations:

```text
<deprecated_onedrive_checkout>
```

Do not use the OneDrive checkout for patches, validation, packaging, evidence updates, commits, releases, or future agent work.

## Required Behavior

If a future session starts in the OneDrive path, stop and switch to the active workspace before acting.

The OneDrive copy may be treated only as historical backup evidence. It is not the source of truth.

