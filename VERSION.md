# Version

## 0.2.3 - 2026-06-20

Plugin local de ativacao criado para os artefatos defensivos:

- `plugins/fccsecurity-doc-activation/.codex-plugin/plugin.json`;
- skills locais para `SAFETY_TEST_PLAN.md`, `SECURITY_FINDINGS.md`, `REMEDIATION_BACKLOG.md` e `PATCH_VALIDATION_REPORT.md`;
- plugin validado com `validate_plugin.py`;
- quatro skills validadas com `quick_validate.py`;
- sem marketplace, install global, rede, package install, deploy, commit, push ou GitHub write.
## 0.2.2 - 2026-06-20

Continuacao docs-only de revisao defensiva:

- adicionados `SAFETY_TEST_PLAN.md`, `SECURITY_FINDINGS.md`, `REMEDIATION_BACKLOG.md` e `PATCH_VALIDATION_REPORT.md`;
- runtime preservado sem alteracao;
- validacao local repetida com `node --check app.js`, `node scripts\validate-local.js`, busca de sinks runtime, busca de overclaim/path privado e `git diff --check`;
- sem rede, package install, deploy, commit, push, hook ou GitHub write.

## 0.2.1 - 2026-06-19

Workspace autoritativo marcado de forma explicita:

- `C:\tmp\FCCSecurity-clean-20260618T202007` definido como unico workspace operacional;
- checkout antigo em OneDrive declarado fora de escopo para patches, validacao, pacote, commit, release e evidencia atual;
- `ACTIVE_WORKSPACE.md`, `AGENTS.md`, `README.md` e `SECURITY_SCOPE.md` atualizados para impedir retorno acidental ao workspace bloqueado.
## 0.2.0 - 2026-06-18

Projeto local limpo criado fora do OneDrive e consolidado como workspace principal:

- backup integral preservado em `C:\tmp\FCCSecurity-backup-20260618T202007\FCCSecurity`;
- runtime estatico mantido em `index.html`, `styles.css` e `app.js`;
- artefatos brutos de scan historico removidos do clean tree por desenho;
- documentacao central reescopada para operacao local-only;
- `app.js` endurecido com wrappers seguros de `localStorage`, limite de notas e metadado `exportPolicy` no snapshot JSON;
- navegacao local `Board`, `Evidence` e `Validate` convertida em views funcionais com whitelist e `aria-current`;
- validacao local atual registrada em `docs/validation/local_validation.md`;
- validador local sem dependencias adicionado em `scripts/validate-local.js`;
- sem rede, package install, deploy, commit, push, hook ou GitHub write.

## 0.1.1 - 2026-06-18

Atualizacao defensiva anterior de evidencia no mirror operacional:

- scan defensivo local revisou runtime, docs e evidencias;
- drift documental MEDIUM/P2 foi identificado e corrigido no mirror;
- checagem global local-first adicionada para governanca, runtime safety, monitoramento e enforcement.

## 0.1.0 - 2026-06-16

Primeira entrega local-first de Frontier Cyber Intelligence:

- painel estatico executavel;
- threat model inicial;
- evidencia de implementacao;
- validacao local executada e documentada.
