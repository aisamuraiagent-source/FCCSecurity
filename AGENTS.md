# FCC Security Agent Rules

Idioma padrao: portugues brasileiro. Para codigo, docs tecnicos e evidencia de seguranca, usar linguagem direta, factual e auditavel.

## Workspace Ativo Obrigatorio

- O unico workspace operacional autorizado e `C:\tmp\FCCSecurity-clean-20260618T202007`.
- O checkout antigo em OneDrive nao deve ser usado para leitura operacional, escrita, patch, validacao, commit, pacote, release ou evidencia atual.
- Se uma sessao iniciar em `<deprecated_onedrive_checkout>`, pare, registre desvio de workspace e mude para `C:\tmp\FCCSecurity-clean-20260618T202007` antes de qualquer acao.
- Evidencia antiga do OneDrive pode ser citada apenas como backup historico, nunca como fonte autoritativa do estado atual.
## Escopo

- Este repositorio e defensivo.
- Nao realizar exploracao de terceiros, brute force, coleta de credenciais, malware, evasao ou varredura externa.
- Nao adicionar backend, banco, login, API, dependencia externa, hook, automacao em segundo plano, commit, push ou deploy externo sem pedido explicito no turno atual.
- Preferir HTML, CSS e JavaScript puro quando a entrega puder ser local-first.
- Preservar claims publicos factuais, sanitizados e sustentados por evidencia verificavel.

## DayBreak

- Tratar DayBreak como objetivo estrategico principal.
- Usar carreira, portfolio e repos publicos apenas como superficies de suporte.
- Priorizar ameacas de maior impacto antes de volume.
- Toda correcao deve ter evidencia local: comando, escopo, resultado, limitacao e proximo passo.

## Codigo

- Entender README, VERSION, AGENTS.md, estrutura e arquivos principais antes de alterar.
- Fazer alteracoes minimas, rastreaveis e reversiveis.
- Evitar `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval` e `new Function` para dados controlados por usuario.
- Separar nucleo semantico, interface, estado, renderizacao e validacao.
- Validar sintaxe e fluxo antes de declarar pronto.

## Codex Security

- Manter `docs/threat-model/threat_model.md` como threat model reutilizavel.
- Para scan repo-wide completo, usar o fluxo Codex Security e pedir autorizacao explicita para subagentes quando a skill exigir.
- Registrar findings como evidencia proporcional: reportable, suppressed, not_applicable ou deferred com razao exata.


