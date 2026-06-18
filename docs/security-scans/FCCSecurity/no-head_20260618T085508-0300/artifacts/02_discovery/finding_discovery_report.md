# Finding Discovery Report

Scan: `no-head_20260618T085508-0300`

Scope: repository-wide scan of `<repo_root>`.

Threat model source: `artifacts/01_context/threat_model.md`.

## Worklist

- `rank_input.csv` generated from Codex Security worklist logic, then manually added back documentation and governance files because the repository threat model treats public wording, validation evidence, and deployment posture as security-relevant boundaries.
- `top-percent=100`; every row in `deep_review_input.csv` received a full-file review receipt.
- Coverage: 18/18 worklist rows closed in `work_ledger.jsonl`.

## Discovery Results

Two candidates were preserved:

1. `FCS-DOC-PATH-001` LOW: public evidence docs expose workstation-specific absolute paths.
2. `FCCSEC-DOC-001` MEDIUM: OpenAI-facing/static-only wording overstates no dependency install posture while optional Python PDF tooling imports third-party libraries.

No runtime candidates were discovered for unsafe DOM sinks, dynamic code execution, network fetch, backend/auth/session flaws, package-manager dependency risk, file/path impact, or secrets.

## Evidence

- `node --check app.js`: passed.
- Python syntax parse for `scripts/generate_profile_pdfs.py`: passed using in-memory `compile(...)`; `py_compile` was not used because it attempted to create `__pycache__` in the repository.
- Dangerous runtime sink grep over `app.js`, `index.html`, `styles.css`, and `scripts/generate_profile_pdfs.py`: no matches for unsafe DOM/dynamic execution/network sinks.
- Refined token/private-key grep excluding scan artifacts: no matches.
- Dependency manifest search: no `package.json`, lockfile, `requirements.txt`, `pyproject.toml`, `Pipfile`, or `poetry.lock` found.

## Limitations

- No external network verification was performed.
- No application code or source documentation was modified; only scan artifacts were written under this scan directory.
