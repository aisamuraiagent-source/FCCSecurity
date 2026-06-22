from __future__ import annotations

import hashlib
import os
from datetime import date
from pathlib import Path

from PIL import Image
from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
)

try:
    import pypdfium2 as pdfium
except Exception:  # pragma: no cover - validation reports this explicitly
    pdfium = None


ROOT = Path(__file__).resolve().parents[1]
OUT_ROOT = Path(os.environ.get("PROFILE_PDF_OUT_ROOT", str(ROOT / "local-evidence" / "fccsecurity-profile-pdfs")))
OUT_DIR = OUT_ROOT / "output" / "pdf"
TMP_DIR = OUT_ROOT / "tmp" / "pdfs"
OUT_DIR.mkdir(parents=True, exist_ok=True)
TMP_DIR.mkdir(parents=True, exist_ok=True)

REPORT_PDF = OUT_DIR / "relatorio-documental-governanca-github-daybreak.pdf"
CV_PDF = OUT_DIR / "curriculo-renan-raad-frontier-cyber-intelligence-atualizado.pdf"
VALIDATION_TXT = OUT_DIR / "validacao-pdfs.txt"


def register_fonts() -> tuple[str, str]:
    windir = os.environ.get("WINDIR")
    candidates = []
    if windir:
        candidates = [
            Path(windir) / "Fonts" / "arial.ttf",
            Path(windir) / "Fonts" / "arialbd.ttf",
        ]
    if len(candidates) == 2 and candidates[0].exists() and candidates[1].exists():
        pdfmetrics.registerFont(TTFont("Arial", str(candidates[0])))
        pdfmetrics.registerFont(TTFont("Arial-Bold", str(candidates[1])))
        return "Arial", "Arial-Bold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName=FONT_BOLD,
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#111827"),
            spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#374151"),
            spaceAfter=10,
        ),
        "section": ParagraphStyle(
            "section",
            parent=base["Heading2"],
            fontName=FONT_BOLD,
            fontSize=11.5,
            leading=14,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=8,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=8.8,
            leading=12.2,
            textColor=colors.HexColor("#111827"),
            alignment=TA_LEFT,
            spaceAfter=4,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=7.7,
            leading=10.5,
            textColor=colors.HexColor("#4b5563"),
            spaceAfter=3,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=8.4,
            leading=11.4,
            leftIndent=0,
            textColor=colors.HexColor("#111827"),
        ),
    }


S = styles()


def bullet_list(items: list[str], size: str = "bullet") -> ListFlowable:
    return ListFlowable(
        [
            ListItem(Paragraph(item, S[size]), leftIndent=0.16 * cm)
            for item in items
        ],
        bulletType="bullet",
        start="circle",
        leftIndent=0.35 * cm,
        bulletFontName=FONT,
        bulletFontSize=5,
        bulletColor=colors.HexColor("#111827"),
        spaceBefore=1,
        spaceAfter=4,
    )


def header_footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setStrokeColor(colors.HexColor("#d1d5db"))
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, h - 1.35 * cm, w - doc.rightMargin, h - 1.35 * cm)
    canvas.setFont(FONT, 7)
    canvas.setFillColor(colors.HexColor("#6b7280"))
    footer_label = getattr(doc, "footer_label", "Relatorio gerado localmente - evidencia sanitizada")
    canvas.drawString(doc.leftMargin, 0.8 * cm, footer_label)
    canvas.drawRightString(w - doc.rightMargin, 0.8 * cm, f"Pagina {doc.page}")
    canvas.restoreState()


def cv_footer(canvas, doc):
    canvas.saveState()
    w, _ = A4
    canvas.setFont("Times-Roman", 7)
    canvas.setFillColor(colors.HexColor("#6b7280"))
    footer_label = "Curriculo atualizado em 17/06/2026 - foco: Defensive AI, Codex local workflows, secure remediation e evidencia auditavel."
    canvas.drawCentredString(w / 2, 0.8 * cm, footer_label)
    canvas.restoreState()


def build_pdf(
    path: Path,
    story: list,
    top_margin: float = 1.7 * cm,
    footer_label: str | None = None,
    on_page=header_footer,
):
    doc = BaseDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=1.6 * cm,
        leftMargin=1.6 * cm,
        topMargin=top_margin,
        bottomMargin=1.25 * cm,
    )
    if footer_label:
        doc.footer_label = footer_label
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        id="normal",
    )
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=on_page)])
    doc.build(story)


def make_report():
    story = [
        Paragraph("Relatorio Documental de Execucao", S["title"]),
        Paragraph(
            "Projeto: AI Threat Modeling & Dependency Risk Review Lab<br/>"
            "Repositorio: aisamuraiagent-source/ai-threat-model-dependency-risk-lab<br/>"
            "Data: 17/06/2026<br/>"
            "Natureza: governanca defensiva, protecao de branch, revisao humana e evidencia auditavel.",
            S["subtitle"],
        ),
        Paragraph("1. Objetivo", S["section"]),
        Paragraph(
            "Registrar a execucao de um fluxo defensivo de governanca no GitHub para proteger a branch principal, exigir revisao humana antes de merge e documentar a evidencia em artefato publico sanitizado.",
            S["body"],
        ),
        Paragraph("2. Acoes Executadas", S["section"]),
        bullet_list(
            [
                "Criado e ativado o ruleset GitHub <b>protect-main-defensive-lab</b>.",
                "Aplicado o controle a branch padrao <b>main</b>.",
                "Exigido pull request antes de merge e 1 aprovacao por revisor com write access.",
                "Mantida bypass list vazia.",
                "Bloqueados force push e delecao da branch protegida.",
                "Status checks foram adiados ate existir GitHub CI.",
                "Criado PR #1 para registrar o Entry 6 em HUMAN_APPROVAL_LOG.md.",
            ]
        ),
        Paragraph("3. Revisao Humana", S["section"]),
        bullet_list(
            [
                "Colaborador externo: <b>arquitetomarketing-cyber</b>.",
                "Permissao efetiva: <b>write</b>.",
                "Review valida: <b>APPROVED</b>.",
                "Comentario: Reviewed. Documentation-only evidence is scoped and sanitized.",
            ]
        ),
        Paragraph("4. Merge e Publicacao", S["section"]),
        bullet_list(
            [
                "PR #1 mergeado na main.",
                "Commit publicado: <b>698b549d082441d9c8f6b2b645e21492430fba80</b>.",
                "Branch temporaria codex/ruleset-approval-log removida apos o merge.",
                "HUMAN_APPROVAL_LOG.md contem Entry 6 publicado na main.",
            ]
        ),
        Paragraph("5. Validacoes Tecnicas", S["section"]),
        bullet_list(
            [
                "PR #1: closed e merged.",
                "HEAD local e origin/main sincronizados no commit 698b549.",
                "Branch temporaria ausente na busca de branches do GitHub.",
                "npm test --prefix app: 5 testes passaram, 0 falhas.",
                "Ruleset aplicado a main: pull_request, non_fast_forward e deletion.",
            ]
        ),
        Paragraph("6. Limites Preservados", S["section"]),
        bullet_list(
            [
                "Nenhuma alteracao em codigo de aplicacao.",
                "Nenhuma dependencia adicionada.",
                "Nenhum backend, banco, login, hook ou automacao externa criado.",
                "Nenhum scan externo executado.",
                "Nenhum dado sensivel, credencial, log bruto, IP privado ou screenshot publicado.",
                "Nenhuma claim de afiliacao, certificacao, endosso ou acesso privilegiado.",
            ]
        ),
        Paragraph("7. Conclusao", S["section"]),
        Paragraph(
            "O trabalho foi concluido com evidencia auditavel: ruleset ativo, revisao externa valida, merge via PR, registro sanitizado publicado na main, branch temporaria removida e checkout local sincronizado.",
            S["body"],
        ),
    ]
    build_pdf(REPORT_PDF, story, footer_label="Relatorio gerado localmente - evidencia sanitizada")


def cv_styles():
    return {
        "cv_name": ParagraphStyle(
            "cv_name",
            fontName="Times-Bold",
            fontSize=23,
            leading=26,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#111111"),
            spaceAfter=3,
        ),
        "cv_role": ParagraphStyle(
            "cv_role",
            fontName="Times-Bold",
            fontSize=10.8,
            leading=12.5,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#1f4e79"),
            spaceAfter=2,
        ),
        "cv_contact": ParagraphStyle(
            "cv_contact",
            fontName="Times-Roman",
            fontSize=8.7,
            leading=10.2,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#555555"),
            spaceAfter=5,
        ),
        "cv_highlight": ParagraphStyle(
            "cv_highlight",
            fontName="Times-Roman",
            fontSize=9.3,
            leading=11,
            textColor=colors.HexColor("#222222"),
            spaceAfter=5,
        ),
        "cv_section": ParagraphStyle(
            "cv_section",
            fontName="Times-Bold",
            fontSize=10.7,
            leading=12.5,
            textColor=colors.HexColor("#1f4e79"),
            spaceBefore=5,
            spaceAfter=0,
        ),
        "cv_body": ParagraphStyle(
            "cv_body",
            fontName="Times-Roman",
            fontSize=9.1,
            leading=10.7,
            textColor=colors.HexColor("#222222"),
            spaceAfter=4,
        ),
        "cv_job": ParagraphStyle(
            "cv_job",
            fontName="Times-Bold",
            fontSize=10,
            leading=11.2,
            textColor=colors.HexColor("#111111"),
            spaceBefore=4,
            spaceAfter=0,
        ),
        "cv_meta": ParagraphStyle(
            "cv_meta",
            fontName="Times-Italic",
            fontSize=8.8,
            leading=10,
            textColor=colors.HexColor("#666666"),
            spaceAfter=1,
        ),
        "cv_bullet": ParagraphStyle(
            "cv_bullet",
            fontName="Times-Roman",
            fontSize=8.75,
            leading=10.2,
            leftIndent=10,
            firstLineIndent=-6,
            bulletIndent=0,
            textColor=colors.HexColor("#222222"),
            spaceAfter=0.7,
        ),
        "cv_skill": ParagraphStyle(
            "cv_skill",
            fontName="Times-Roman",
            fontSize=9,
            leading=10.6,
            textColor=colors.HexColor("#222222"),
            spaceAfter=2,
        ),
    }


CVS = cv_styles()


def cv_section_title(title: str) -> list:
    return [
        Paragraph(title.upper(), CVS["cv_section"]),
        HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#9ca3af"), spaceBefore=0, spaceAfter=4),
    ]


def cv_bullets(items: list[str]) -> list:
    return [Paragraph(item, CVS["cv_bullet"], bulletText="\u2022") for item in items]


def cv_entry(title: str, meta: str, bullets: list[str]) -> KeepTogether:
    return KeepTogether(
        [
            Paragraph(title, CVS["cv_job"]),
            Paragraph(meta, CVS["cv_meta"]),
            *cv_bullets(bullets),
        ]
    )


def make_cv():
    story = [
        Paragraph("Renan Raad", CVS["cv_name"]),
        Paragraph(
            "Defensive AI Systems Builder | Frontier Cyber Intelligence Plugin | Secure Remediation | Threat Modeling",
            CVS["cv_role"],
        ),
        Paragraph(
            "Funilandia, MG, Brasil | Remoto | contato sob demanda<br/>"
            "LinkedIn: www.linkedin.com/in/renan-raad-308540387 | GitHub: github.com/aisamuraiagent-source",
            CVS["cv_contact"],
        ),
        Paragraph(
            "<b>Destaque atual:</b> Frontier Cyber Intelligence v0.1.0 - plugin/skill local para Codex que estrutura revisao defensiva, threat modeling, remediacao minima, validacao local, governanca GitHub e evidencia auditavel em fluxo repetivel.",
            CVS["cv_highlight"],
        ),
        *cv_section_title("Resumo Profissional"),
        Paragraph(
            "Defensive AI Systems Builder focado em workflows defensivos com Codex, secure code review, threat modeling, dependency risk review, patch validation, automacao local-first, governanca de repositorios e documentacao sanitizada. Construo laboratorios publicos e artefatos auditaveis onde a IA apoia triagem, proposta de correcao, validacao e evidencia, sempre com escopo autorizado, aprovacao humana e limites operacionais explicitos.",
            CVS["cv_body"],
        ),
        *cv_section_title("Projetos Recentes em Destaque"),
        cv_entry(
            "Frontier Cyber Intelligence - Plugin local para Codex",
            "2026 | Plugin/skill pessoal v0.1.0 | Defensive AI workflow",
            [
                "Camada operacional para transformar repositorios, sinais de scan, bugs, notas tecnicas e incertezas de seguranca em analise escopada, priorizacao de risco, remediacao minima, validacao local e evidencia pronta para revisao humana.",
                "Skill reutilizavel para scoped review, threat model, dependency risk triage, secure remediation, patch validation, evidence review e resumo sanitizado.",
                "Design local-first e conservador: sem MCP servers, hooks, credenciais, automacao em segundo plano, rede adicional ou permissoes amplas.",
            ],
        ),
        cv_entry(
            "GitHub Defensive Governance - Branch Ruleset e PR Review Gate",
            "2026 | GitHub governance | Evidencia documental auditavel",
            [
                "Criacao do ruleset protect-main-defensive-lab para proteger a main com pull request obrigatorio, 1 aprovacao por revisor com write access, bloqueio de force push e bloqueio de delecao.",
                "Fluxo completo com branch temporaria, PR documental, aprovacao externa, merge controlado, remocao da branch pos-merge e registro em HUMAN_APPROVAL_LOG.md.",
                "Validacao com GitHub API, git local e npm test --prefix app; bypass list vazia, sem status checks ficticios, sem scan externo e sem claims de afiliacao.",
            ],
        ),
        cv_entry(
            "BIOCYBER - Read-only Defensive MVP",
            "2026 | HTML/JavaScript local | Cybersecurity concept system",
            [
                "Organismo de defesa digital inspirado em hematopoiese, sistemas imunologicos artificiais, memoria adaptativa, expansao clonal e vacina virtual para visualizacao defensiva.",
                "Importa eventos de seguranca sanitizados, converte sinais em antigenos visuais, persiste memoria em localStorage, registra evidencia em tempo real e exporta JSON de auditoria.",
                "Limite seguro: nao coleta dados reais, nao executa remediacao no host, nao bloqueia processo/rede/arquivo e nao funciona como EDR, SIEM ou antivirus real.",
            ],
        ),
        cv_entry(
            "DayBreak Defensive Remediation Lab",
            "2026 | Lab defensivo local-first | Secure remediation",
            [
                "Laboratorio publico sanitizado para revisao de codigo seguro, plano de remediacao, aprovacao humana, validacao local, resumo publico e evidencia textual sem dados sensiveis.",
                "Inclui correcao rastreavel de sink DOM inseguro de innerHTML para textContent, validacao sintetica com Node.js e triagem de padroes perigosos e possiveis segredos.",
            ],
        ),
        cv_entry(
            "AI Threat Modeling & Dependency Risk Review Lab",
            "2026 | Threat model / dependency risk / patch validation",
            [
                "Lab publico sanitizado para threat modeling, revisao assistida por Codex, dependency risk review, scan inicial, patch revisado com controle humano e validacao pos-patch.",
                "Documentacao ajustada com postura conservadora: evidencia limitada ao escopo analisado, sem declarar ausencia global de vulnerabilidades.",
            ],
        ),
        cv_entry(
            "Protocolo Defensivo Windows / PowerShell",
            "2026 | Defensive operations | Evidencia TXT",
            [
                "Fluxos locais e passivos para triagem de rede, Windows Defender, processos, tarefas agendadas e estado operacional em Windows.",
                "Postura reversivel: coleta, diagnostico, documentacao e proximo passo humano, sem bloqueios automaticos quando nao autorizados.",
            ],
        ),
        PageBreak(),
        *cv_section_title("Experiencia"),
        cv_entry(
            "Defensive AI Systems Builder | Criador do plugin Frontier Cyber Intelligence",
            "Trabalho independente / Codex local workflows | junho de 2026 - presente | Brasil / remoto",
            [
                "Criei e documentei o Frontier Cyber Intelligence v0.1.0 para padronizar revisao defensiva, threat modeling, triagem de dependencias, remediacao segura, validacao de patch e evidencia auditavel.",
                "Estruturei labs defensivos publicos e sanitizados para demonstrar revisao assistida por IA, aprovacao humana, validacao local, governanca Git/GitHub e fechamento de evidencia.",
                "Registrei governanca GitHub com ruleset ativo, aprovacao externa, merge via PR, Entry 6 em HUMAN_APPROVAL_LOG.md e validacao local publicada.",
                "Mantenho limites explicitos: apenas alvos autorizados, sem scan externo sem pedido claro, sem teste contra terceiros, brute force, malware, persistencia, evasao, coleta de credenciais ou claims de afiliacao oficial.",
            ],
        ),
        cv_entry(
            "Founder & AI Systems Architect | AI Systems Lab",
            "maio de 2026 - maio de 2026 | Brasil / remoto",
            [
                "Desenhei arquiteturas de IA aplicadas a negocios e operacoes digitais, incluindo agentes, copilotos, prompts mestres, SOPs, playbooks e modelos reutilizaveis.",
                "Estruturei sistemas multiagentes com handoff entre estrategia, engenharia, execucao e revisao, conectando n8n, APIs, CRMs, planilhas e automacoes operacionais.",
            ],
        ),
        cv_entry(
            "AI Automation & Workflow Engineer | Independent",
            "janeiro de 2023 - abril de 2026 | Remoto",
            [
                "Projetei automacoes com IA, Python, APIs e plataformas de workflow para reduzir trabalho repetitivo, organizar processos digitais e melhorar eficiencia operacional.",
                "Base aplicada posteriormente a seguranca defensiva: arquitetura de processo, documentacao rigorosa, validacao human-in-the-loop e rastreabilidade.",
            ],
        ),
        *cv_section_title("Competencias"),
        Paragraph(
            "<b>Seguranca defensiva:</b> threat modeling; secure code review; dependency risk review; patch validation; DOM XSS remediation patterns; evidencia auditavel; documentacao sanitizada; governanca de PR.",
            CVS["cv_skill"],
        ),
        Paragraph(
            "<b>GitHub / Git:</b> branch rulesets; protecao de main; pull request review gates; colaborador com write access; merge controlado; limpeza de branch; validacao de refs.",
            CVS["cv_skill"],
        ),
        Paragraph(
            "<b>Codex / IA aplicada:</b> Codex CLI workflows; plugin/skill design; Frontier Cyber Intelligence; human-in-the-loop validation; AGENTS.md; prompts operacionais; sistemas multiagentes.",
            CVS["cv_skill"],
        ),
        Paragraph(
            "<b>Automacao e engenharia:</b> PowerShell; Python; Git; GitHub; HTML/CSS/JavaScript; Node.js validation; Playwright/headless validation; localStorage; JSON evidence.",
            CVS["cv_skill"],
        ),
        Paragraph(
            "<b>Operacao e produto:</b> SOPs; playbooks; README tecnico; relatorios executivos; validation reports; checklists; workflows local-first.",
            CVS["cv_skill"],
        ),
        *cv_section_title("Formacao, Idiomas e Limites Operacionais"),
        Paragraph(
            "Formacao: Faculdade Pitagoras - Bacharelado em Nutricao Humana; Faculdade Pitagoras - Licenciatura em Ciencias Biologicas.",
            CVS["cv_body"],
        ),
        Paragraph(
            "Idiomas: Portugues nativo/bilingue; Ingles nativo/bilingue; Espanhol nativo/bilingue.",
            CVS["cv_body"],
        ),
        Paragraph(
            "Limites: trabalho defensivo e autorizado, revisao em repositorios proprios ou com escopo definido, validacao local, revisao humana, documentacao sanitizada e ausencia de claims de afiliacao, certificacao, endosso ou acesso privilegiado a OpenAI, DayBreak, Codex ou Codex Security.",
            CVS["cv_body"],
        ),
    ]
    build_pdf(CV_PDF, story, top_margin=1.15 * cm, on_page=cv_footer)


def render_first_pages(pdf_path: Path) -> list[Path]:
    rendered = []
    if pdfium is None:
        return rendered
    pdf = pdfium.PdfDocument(str(pdf_path))
    for i in range(min(2, len(pdf))):
        page = pdf[i]
        bitmap = page.render(scale=1.35).to_pil()
        out = TMP_DIR / f"{pdf_path.stem}-page-{i + 1}.png"
        bitmap.save(out)
        rendered.append(out)
    return rendered


def validate_pdf(pdf_path: Path, required_terms: list[str]) -> dict:
    reader = PdfReader(str(pdf_path))
    texts = [(page.extract_text() or "") for page in reader.pages]
    full_text = "\n".join(texts)
    rendered = render_first_pages(pdf_path)
    blank_images = []
    for image_path in rendered:
        image = Image.open(image_path).convert("L")
        extrema = image.getextrema()
        if extrema == (255, 255):
            blank_images.append(str(image_path))
    missing = [term for term in required_terms if term not in full_text]
    return {
        "file": str(pdf_path),
        "sha256": hashlib.sha256(pdf_path.read_bytes()).hexdigest(),
        "pages": len(reader.pages),
        "text_chars": len(full_text),
        "missing_terms": missing,
        "rendered_pages": [str(p) for p in rendered],
        "blank_rendered_pages": blank_images,
    }


def main():
    make_report()
    make_cv()
    checks = [
        validate_pdf(
            REPORT_PDF,
            [
                "Relatorio Documental de Execucao",
                "protect-main-defensive-lab",
                "698b549d082441d9c8f6b2b645e21492430fba80",
                "npm test --prefix app",
            ],
        ),
        validate_pdf(
            CV_PDF,
            [
                "Renan Raad",
                "GitHub Defensive Governance",
                "Branch Ruleset e PR Review Gate",
                "protect-main-defensive-lab",
            ],
        ),
    ]
    lines = []
    for check in checks:
        lines.append(f"FILE: {check['file']}")
        lines.append(f"SHA256: {check['sha256']}")
        lines.append(f"PAGES: {check['pages']}")
        lines.append(f"TEXT_CHARS: {check['text_chars']}")
        lines.append(f"MISSING_TERMS: {check['missing_terms']}")
        lines.append(f"RENDERED_PAGES: {check['rendered_pages']}")
        lines.append(f"BLANK_RENDERED_PAGES: {check['blank_rendered_pages']}")
        lines.append("")
        if check["missing_terms"] or check["blank_rendered_pages"]:
            raise SystemExit(f"Validation failed for {check['file']}")
    VALIDATION_TXT.write_text("\n".join(lines), encoding="utf-8")
    print(VALIDATION_TXT)


if __name__ == "__main__":
    main()
