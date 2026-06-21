# Version

## 0.1.1 - 2026-06-21

Continuacao docs-only baseada em `origin/main`:

- adicionados `SAFETY_TEST_PLAN.md`, `SECURITY_FINDINGS.md`, `REMEDIATION_BACKLOG.md` e `PATCH_VALIDATION_REPORT.md`;
- adicionado bundle local `plugins/fccsecurity-doc-activation`;
- runtime preservado sem alteracao;
- validacao local repetida com `node --check app.js`, busca de sinks runtime, busca documental de sentinelas e `git diff --check`;
- sem merge em `main`, deploy, package install, CI/CD change ou runtime patch.

## 0.1.0 - 2026-06-16

Primeira entrega local-first de Frontier Cyber Intelligence:

- painel estatico executavel;
- threat model inicial;
- evidencia de implementacao;
- validacao local executada e documentada;
- scan Codex Security repo-wide executado com zero findings reportaveis sobreviventes.
