# FCC Security

Frontier Cyber Intelligence e um painel local-first para organizar sinais defensivos, threat model, validacao e evidencia operacional com Codex.

Estado atual: prototipo estatico executavel. Nao ha backend, banco, login, API externa, dependencia de build ou telemetria.

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
- `app.js`: dados locais, estado, filtros, selecao de sinais, ledger e exportacao.
- `docs/threat-model/threat_model.md`: threat model base para Codex Security.
- `docs/evidence/implementation_evidence.md`: inventario da primeira entrega.
- `docs/validation/local_validation.md`: evidencia de validacao local.

## Codex Security

O scan repo-wide Codex Security foi executado em 2026-06-16 com cobertura sobre runtime, documentacao, threat model e manifestos de deploy. Resultado final: zero findings reportaveis sobreviventes; uma divergencia documental de status foi corrigida e suprimida antes do relatorio final.

Relatorios locais:

```text
local-evidence/report.md
local-evidence/report.html
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
