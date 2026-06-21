# FCC Security

Frontier Cyber Intelligence e um painel local-first para organizar sinais defensivos, threat model, validacao e evidencia operacional com Codex.

Estado atual: prototipo estatico executavel com validacao local reproduzivel. Nao ha backend, banco, login, API externa, dependencia de build ou telemetria.

## Como executar

Abra `index.html` diretamente no navegador ou sirva a pasta localmente:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Depois acesse:

```text
http://127.0.0.1:4173/
```

## Superficies

- `index.html`: estrutura da interface.
- `styles.css`: sistema visual responsivo.
- `app.js`: dados locais, estado, filtros, selecao de sinais, snapshot de validacao e exportacao.
- `scripts/validate-local.js`: validacao local reproduzivel para runtime, docs e manifesto de evidencia.
- `docs/threat-model/threat_model.md`: threat model base para Codex Security.
- `docs/evidence/implementation_evidence.md`: inventario da primeira entrega.
- `docs/evidence/evidence_manifest.json`: manifesto local com commit base, comandos de validacao e limitacoes.
- `docs/validation/local_validation.md`: evidencia de validacao local.
- `SAFETY_TEST_PLAN.md`: plano docs-only para revisao defensiva e verificacao local.
- `SECURITY_FINDINGS.md`: findings defensivos classificados e riscos residuais.
- `REMEDIATION_BACKLOG.md`: backlog de controles e gates para evolucao segura.
- `PATCH_VALIDATION_REPORT.md`: validacao da continuacao docs-only sem patch de runtime.

## Plugin local de ativacao

O bundle local em `plugins/fccsecurity-doc-activation` empacota as skills docs-only para reutilizar estes artefatos defensivos dentro do workspace.

Este bundle local nao instala marketplace global, nao altera runtime, nao executa rede, nao faz deploy e nao substitui revisao humana antes de publicacao.

## Codex Security

Os artefatos Codex Security preservados neste repositorio sao recibos historicos e datados de revisoes locais. Eles nao substituem uma validacao atual nem devem ser apresentados como release gate fresco sem novo manifesto ligado ao estado corrente do commit/worktree.

Relatorios historicos locais:

```text
docs/security-scans/FCCSecurity/no-head_20260618T085508-0300/report.md
docs/security-scans/FCCSecurity/no-head_20260618T085508-0300/report.html
```

Validacao atual recomendada:

```powershell
node --check app.js
node scripts\validate-local.js
git diff --check
```

## Pacote local

O pacote estatico de entrega deve ser gerado em:

```text
local-evidence/fccsecurity-frontier-cyber-intelligence.zip
```

Manifesto: `docs/deployment/deploy_manifest.md`.

## Aviso público

FCC Security is an independent local-first defensive security prototype by Renan Raad. It is not affiliated with, endorsed by, or sponsored by OpenAI. References to Codex or Codex Security describe tools/workflows used during local development and review. The project does not perform external scanning, exploitation, credential collection, malware activity, telemetry, or production monitoring.
FCC Security é um protótipo independente de segurança defensiva local-first de Renan Raad. Não é afiliado, endossado ou patrocinado pela OpenAI. Referências a Codex ou Codex Security descrevem ferramentas e fluxos usados durante desenvolvimento e revisão locais. O projeto não realiza varredura externa, exploração, coleta de credenciais, atividade de malware, telemetria ou monitoramento de produção.

## Limites

- Os dados do painel sao exemplos locais para estruturar fluxo defensivo.
- Nao existe ingestao automatica de logs ou alertas reais.
- Nao houve deploy externo nesta etapa.
- Botoes de revisao da interface alteram apenas o estado da sessao; exports JSON nao sao ledger auditavel sem historico duravel, identidade de aprovador e commit validado.
