# FCC Security

FCC Security e um painel local-first de Frontier Cyber Intelligence para organizar sinais defensivos, threat model, validacao e evidencia operacional em ambiente local.

Estado atual: projeto limpo em `C:\tmp\FCCSecurity-clean-20260618T202007`, executavel como HTML/CSS/JavaScript estatico. Este e o unico workspace operacional autorizado. Nao ha backend, banco, login, API externa, dependencia de build, telemetria, deploy, push ou fluxo ativo de nuvem.
## Workspace ativo

Use somente:

```text
C:\tmp\FCCSecurity-clean-20260618T202007
```

Nao usar como workspace ativo:

```text
<deprecated_onedrive_checkout>
```

O checkout antigo em OneDrive e apenas backup historico. Ele nao deve receber patches, validacoes, pacotes, commits, evidencias atuais ou qualquer operacao futura.

## Como executar

Abra `index.html` diretamente no navegador ou sirva a pasta localmente:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Depois acesse:

```text
http://127.0.0.1:4173/
```

## Validacao local

```powershell
node --check app.js
node scripts\validate-local.js
```

O script `scripts\validate-local.js` usa apenas Node.js nativo e verifica contratos locais de runtime, views, storage seguro, documentacao sanitizada e ausencia de referencias antigas de scan/deploy.

## Superficies

- `index.html`: estrutura da interface.
- `styles.css`: sistema visual responsivo.
- `app.js`: dados locais, estado, filtros, selecao de sinais, ledger, notas locais e exportacao JSON.
- `docs/threat-model/threat_model.md`: threat model reutilizavel para revisao defensiva.
- `docs/evidence/bootstrap_evidence.md`: evidencia de criacao do projeto limpo e backup local.
- `docs/evidence/runtime_hardening_20260618.md`: evidencia do hardening de `localStorage`, limite de notas e exportacao.
- `docs/validation/local_validation.md`: validacao local atual.

## Pacote local

Pacote sanitizado local:

```text
C:\tmp\FCCSecurity-clean-local-package-20260618.zip
```

O pacote exclui `.git` e preserva apenas arquivos do projeto limpo.

## Estado operacional

- Backup preservado em `C:\tmp\FCCSecurity-backup-20260618T202007\FCCSecurity`.
- Workspace principal local em `C:\tmp\FCCSecurity-clean-20260618T202007`.
- Repositorio remoto GitHub nao e fluxo ativo deste projeto.
- O checkout antigo em OneDrive permanece fora de qualquer fluxo operacional.

## Limites

- Os dados do painel sao exemplos locais para estruturar fluxo defensivo.
- Nao existe ingestao automatica de logs, alertas reais ou dados de terceiros.
- Nao inserir segredos, tokens, credenciais, dados pessoais ou incidentes privados nas notas locais.
- Nao houve deploy externo nesta etapa.




