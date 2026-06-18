# Local Validation

Date: 2026-06-16

This file records local validation for the static prototype.

## Commands Executed

```powershell
node --check app.js
rg -n "innerHTML|outerHTML|insertAdjacentHTML|eval\\(|new Function" index.html app.js styles.css
"& \"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\" --headless=new --disable-gpu --no-first-run --user-data-dir=\"C:\\tmp\\chrome-fccsecurity\" --window-size=1440,1000 --screenshot=\"C:\\tmp\\fccsecurity-desktop-v2.png\" \"file:///<repo_root>/index.html\""
"& \"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\" --headless=new --disable-gpu --no-first-run --user-data-dir=\"C:\\tmp\\chrome-fccsecurity-mobile\" --window-size=390,900 --screenshot=\"C:\\tmp\\fccsecurity-mobile-v4.png\" \"file:///<repo_root>/index.html\""
"& \"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\" --headless=new --disable-gpu --no-first-run --user-data-dir=\"C:\\tmp\\chrome-fccsecurity-dom\" --dump-dom \"file:///<repo_root>/index.html\""
Compress-Archive -Path index.html,styles.css,app.js,AGENTS.md,README.md,VERSION.md,docs -DestinationPath C:\tmp\fccsecurity-frontier-cyber-intelligence.zip -Force
Get-FileHash C:\tmp\fccsecurity-frontier-cyber-intelligence.zip -Algorithm SHA256
```

## Results

- `node --check app.js`: passed.
- Runtime sink search over `index.html`, `app.js`, and `styles.css`: no matches.
- Repo-wide sink search has documentation-only matches in `AGENTS.md`, this validation file, and `docs/threat-model/threat_model.md`; these are policy/threat-model references, not runtime sinks.
- Chrome headless desktop screenshot written to `C:\tmp\fccsecurity-desktop-v2.png`.
- Chrome headless mobile screenshot written to `C:\tmp\fccsecurity-mobile-v4.png`.
- Chrome headless DOM dump confirmed that JavaScript rendered the signal queue, threat model, validation ledger, detail panel, and evidence timeline.
- Static deploy package written to `C:\tmp\fccsecurity-frontier-cyber-intelligence.zip`.
- Package SHA-256 is recorded outside the ZIP at `C:\tmp\fccsecurity-frontier-cyber-intelligence.zip.sha256` to avoid a self-referential package hash.
- Browser/IAB navigation tool was not exposed by `tool_search`; Node REPL Playwright fallback failed with `CreateProcessAsUserW failed: 5`; `npx playwright --version` failed due npm cache permission (`EPERM`). Chrome headless was used as the practical browser fallback.

## Codex Security

Full repository-wide Codex Security scan was completed on 2026-06-16 after explicit subagent authorization.

Final reports:

```text
C:\tmp\codex-security-scans\FCCSecurity\no-head_20260616T102807-0300\report.md
C:\tmp\codex-security-scans\FCCSecurity\no-head_20260616T102807-0300\report.html
```

Result:

- 11/11 deep-review rows received completion receipts.
- 1 documentation status candidate was discovered, patched, validated, and suppressed before final report.
- 0 reportable findings survived into the final report.
