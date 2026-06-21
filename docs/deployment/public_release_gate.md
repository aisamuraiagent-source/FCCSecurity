Do not publish the current local package unchanged. It contains local artifact paths and internal evidence references that are useful for audit but should be sanitized before public release.

Current gate status:

```text
OpenAI Developer Community submission created.
Account temporarily on hold by automated moderation pending staff review.
No OpenAI approval, endorsement, or release authorization has been received.
Private GitHub repository created on 2026-06-18 for controlled review only.
Public GitHub, GitHub Pages, Netlify, and any public static deployment remain blocked until review.
```

## Release Options

### Option A: Private GitHub Repository First

Best first step.

- Preserve evidence and history privately.
- Share the repo link with reviewers.
- Avoid public indexing while wording is reviewed.
- Attach `report.md`, `report.html`, ZIP hash, and screenshot as release artifacts or issue attachments.

### Option B: Public GitHub Repository
### Opção B: repositório público no GitHub

Use only after the public wording is sanitized.
Usar somente depois que o texto público estiver sanitizado.

Required changes before public release:
Mudanças obrigatórias antes da publicação:

- replace absolute local paths with relative artifact descriptions;
- substituir caminhos locais absolutos por descrições relativas de artefatos;
- add a non-affiliation disclaimer;
- adicionar declaração pública de não afiliação;
- keep OpenAI/Codex references factual and secondary;
- manter referências a OpenAI/Codex factuais e secundárias;
- avoid OpenAI logos, marks, or model names in the project title;
- evitar logos, marcas ou nomes de modelos da OpenAI no título do projeto;
- keep "cyber intelligence" framed as defensive evidence organization, not national-security or surveillance work;
- manter "cyber intelligence" enquadrado como organização de evidência defensiva, não como segurança nacional ou vigilância;
- include a clear "no offensive capability" statement;
- incluir declaração clara de ausência de capacidade ofensiva;
- include the final scan summary without exposing private machine paths;
- incluir o resumo final do scan sem expor caminhos privados da máquina.

### Option C: Static Deploy Preview
### Opção C: preview de deploy estático

Use after GitHub sanitation.
Usar depois da sanitização do GitHub.

Acceptable targets:
Alvos aceitáveis:

- GitHub Pages;
- Netlify;
- Cloudflare Pages;
- local downloadable ZIP only.
- ZIP local baixável apenas.

Static deploy must not add:
O deploy estático não deve adicionar:

- backend;
- login;
- analytics/telemetry;
- analytics/telemetria;
- API key;
- chave de API;
- remote ingestion;
- ingestão remota;
- automated scanning;
- varredura automatizada;
- hidden background jobs;
- tarefas ocultas em segundo plano.

## Public Disclaimer
## Aviso público

Use this exact disclaimer in the public README before deploy:
Use este aviso exatamente no README público antes de qualquer deploy:

```text
FCC Security is an independent local-first defensive security prototype by Renan Raad. It is not affiliated with, endorsed by, or sponsored by OpenAI. References to Codex or Codex Security describe tools/workflows used during local development and review. The project does not perform external scanning, exploitation, credential collection, malware activity, telemetry, or production monitoring.
FCC Security é um protótipo independente de segurança defensiva local-first de Renan Raad. Não é afiliado, endossado ou patrocinado pela OpenAI. Referências a Codex ou Codex Security descrevem ferramentas e fluxos usados durante desenvolvimento e revisão locais. O projeto não realiza varredura externa, exploração, coleta de credenciais, atividade de malware, telemetria ou monitoramento de produção.
```

## Evidence Bundle
## Pacote de evidências

Current local evidence:
Evidência local atual:

```text
local-evidence/report.md
local-evidence/report.html
local-evidence/fccsecurity-frontier-cyber-intelligence.zip
local-evidence/fccsecurity-frontier-cyber-intelligence.zip.sha256
local-evidence/fccsecurity-final-desktop.png
```

SHA-256 receipt:
Recibo SHA-256:

```text
local-evidence/fccsecurity-frontier-cyber-intelligence.zip.sha256
```

## Release Checklist

- [ ] Sanitize absolute local paths from public docs.
- [x] Add public disclaimer to README.
- [x] Keep scan result factual, dated, and historical instead of using broad "secure" wording.
- [x] Keep OpenAI references secondary and factual.
- [x] Remove or rewrite any phrase that implies OpenAI approval before approval exists.
- [x] Create private GitHub repository for controlled review.
- [ ] Keep private GitHub repository private until the release gate is closed.
- [ ] Deploy static preview only after review/sanitation.
- [x] Re-run `node --check app.js`.
- [x] Re-run runtime sink grep.
- [ ] Regenerate ZIP and SHA-256 after public copy is sanitized.
