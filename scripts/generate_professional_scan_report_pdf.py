from __future__ import annotations

import json
import os
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
HISTORICAL_SCAN_ID = "no-head_20260618T085508-0300"
HISTORICAL_SCAN_DIR = ROOT / f"docs/security-scans/FCCSecurity/{HISTORICAL_SCAN_ID}"
OUT_DIR = Path(os.environ.get("FCCSECURITY_REPORT_OUT_DIR", str(ROOT / "local-evidence" / "fccsecurity-professional-report")))
PREVIEW_DIR = OUT_DIR / "preview"
PDF_PATH = OUT_DIR / "fccsecurity-codex-security-professional-report.pdf"
LINKEDIN_TXT = OUT_DIR / "linkedin-post.txt"
CV_TXT = OUT_DIR / "curriculo-bullets.txt"

PAGE_W, PAGE_H = A4
ACCENT = colors.HexColor("#16A66A")
BLUE = colors.HexColor("#2F6BFF")
DARK = colors.HexColor("#071013")
INK = colors.HexColor("#101820")
MUTED = colors.HexColor("#52616B")
LINE = colors.HexColor("#D8E2E7")
SOFT = colors.HexColor("#F4F8FA")
PALE_GREEN = colors.HexColor("#E9F8F0")
PALE_BLUE = colors.HexColor("#EAF1FF")


def register_fonts() -> tuple[str, str]:
    windir = os.environ.get("WINDIR")
    if windir:
        regular = Path(windir) / "Fonts" / "arial.ttf"
        bold = Path(windir) / "Fonts" / "arialbd.ttf"
        if regular.exists() and bold.exists():
            pdfmetrics.registerFont(TTFont("PremiumSans", str(regular)))
            pdfmetrics.registerFont(TTFont("PremiumSans-Bold", str(bold)))
            return "PremiumSans", "PremiumSans-Bold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


def validate_historical_scan_artifacts() -> None:
    required = [
        HISTORICAL_SCAN_DIR / "report.md",
        HISTORICAL_SCAN_DIR / "report.html",
        HISTORICAL_SCAN_DIR / "artifacts" / "02_discovery" / "work_ledger.jsonl",
        HISTORICAL_SCAN_DIR / "artifacts" / "05_findings" / "FCCSEC-DOC-001" / "validation_report.md",
        HISTORICAL_SCAN_DIR / "artifacts" / "05_findings" / "FCCSEC-DOC-001" / "attack_path_analysis_report.md",
    ]
    missing = [str(path) for path in required if not path.exists()]
    if missing:
        raise FileNotFoundError(
            "Historical scan evidence is incomplete. Missing: " + "; ".join(missing)
        )


def style_sheet():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName=FONT_BOLD,
            fontSize=27,
            leading=31,
            textColor=colors.white,
            alignment=TA_LEFT,
            spaceAfter=12,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#DDE8E4"),
            alignment=TA_LEFT,
        ),
        "section": ParagraphStyle(
            "section",
            parent=base["Heading2"],
            fontName=FONT_BOLD,
            fontSize=15,
            leading=18,
            textColor=INK,
            spaceBefore=12,
            spaceAfter=8,
        ),
        "h3": ParagraphStyle(
            "h3",
            parent=base["Heading3"],
            fontName=FONT_BOLD,
            fontSize=11.5,
            leading=14,
            textColor=INK,
            spaceBefore=8,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=9.4,
            leading=13.2,
            textColor=INK,
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=8,
            leading=10.2,
            textColor=MUTED,
        ),
        "callout": ParagraphStyle(
            "callout",
            parent=base["BodyText"],
            fontName=FONT_BOLD,
            fontSize=10,
            leading=13,
            textColor=INK,
        ),
        "table_head": ParagraphStyle(
            "table_head",
            parent=base["BodyText"],
            fontName=FONT_BOLD,
            fontSize=9.4,
            leading=12,
            textColor=colors.white,
        ),
        "quote": ParagraphStyle(
            "quote",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=9.2,
            leading=13.2,
            textColor=INK,
            leftIndent=6,
            rightIndent=6,
        ),
        "center": ParagraphStyle(
            "center",
            parent=base["BodyText"],
            fontName=FONT_BOLD,
            fontSize=10,
            leading=13,
            alignment=TA_CENTER,
            textColor=INK,
        ),
    }


S = style_sheet()


class Rule(Flowable):
    def __init__(self, color=ACCENT, width=1.2, space=8):
        super().__init__()
        self.color = color
        self.width = width
        self.space = space

    def wrap(self, availWidth, availHeight):
        self.availWidth = availWidth
        return availWidth, self.space

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.width)
        self.canv.line(0, self.space / 2, self.availWidth, self.space / 2)


class CoverBlock(Flowable):
    def wrap(self, availWidth, availHeight):
        self.width = availWidth
        return availWidth, 19.2 * cm

    def draw(self):
        c = self.canv
        c.saveState()
        c.setFillColor(DARK)
        c.roundRect(0, 0, self.width, 19.2 * cm, 16, stroke=0, fill=1)
        c.setFillColor(ACCENT)
        c.rect(0, 0, 0.34 * cm, 19.2 * cm, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#0E2422"))
        c.circle(self.width - 1.8 * cm, 16.2 * cm, 4.8 * cm, stroke=0, fill=1)
        c.setStrokeColor(colors.HexColor("#235E52"))
        c.setLineWidth(0.8)
        for i in range(7):
            y = 4.3 * cm + i * 1.15 * cm
            c.line(1.15 * cm, y, self.width - 1.15 * cm, y + 0.26 * cm)
        c.restoreState()


def para(text: str, style="body"):
    return Paragraph(text, S[style])


def bullets(items: list[str], level: str = "body") -> ListFlowable:
    return ListFlowable(
        [ListItem(Paragraph(item, S[level]), bulletColor=ACCENT, leftIndent=12) for item in items],
        bulletType="bullet",
        leftIndent=16,
        bulletFontName=FONT_BOLD,
        bulletFontSize=7,
    )


def card(title: str, body: str, fill=SOFT, border=LINE):
    table = Table(
        [[Paragraph(title, S["callout"])], [Paragraph(body, S["body"])]],
        colWidths=[16.2 * cm],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), fill),
                ("BOX", (0, 0), (-1, -1), 0.7, border),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def kpi_table():
    data = [
        [Paragraph("18/18", S["center"]), Paragraph("2", S["center"]), Paragraph("1", S["center"]), Paragraph("0", S["center"])],
        [
            Paragraph("historical worklist rows closed", S["small"]),
            Paragraph("historical candidates validated", S["small"]),
            Paragraph("historical final MEDIUM finding", S["small"]),
            Paragraph("historical HIGH/CRITICAL findings", S["small"]),
        ],
    ]
    table = Table(data, colWidths=[4.05 * cm] * 4, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                ("TEXTCOLOR", (0, 0), (-1, 0), ACCENT),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    return table


def evidence_table():
    rows = [
        ["Artifact", "Result"],
        ["Source scan", f"Historical local scan `{HISTORICAL_SCAN_ID}`"],
        ["Scan mode", "Historical repository-wide defensive scan, local workspace only"],
        ["Coverage", "Historical result: 18/18 rows completed with work-ledger receipts"],
        ["Runtime checks", "node --check app.js passed; unsafe DOM/network sink grep returned no runtime candidate"],
        ["Secrets check", "Refined token/private-key grep returned no secret matches"],
        ["Final reportability", "Historical result: 1 MEDIUM/P2 documentation-evidence drift finding; no HIGH/CRITICAL findings"],
        ["Limits", "No external scan, package install, deploy, commit, or source remediation performed"],
    ]
    table = Table([[Paragraph(c, S["table_head"] if r == 0 else S["body"]) for c in row] for r, row in enumerate(rows)], colWidths=[4.3 * cm, 11.9 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), DARK),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.45, LINE),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def public_safety_table():
    rows = [
        ["Pode dizer", "Evitar"],
        [f"Documentei o scan defensivo histórico `{HISTORICAL_SCAN_ID}` com evidência auditável.", "O projeto foi aprovado pela OpenAI ou por terceiros."],
        ["Nesse scan histórico, 18/18 superfícies do worklist foram fechadas com discovery, validation e attack-path.", "O sistema está seguro, blindado ou sem vulnerabilidades."],
        ["Nesse scan histórico, foi identificado 1 finding MEDIUM de drift documental e 0 HIGH/CRITICAL.", "Houve teste contra terceiros, exploração externa ou validação em produção."],
        ["Nesse escopo histórico observado, não houve sinks DOM perigosos, segredos ou dependências de runtime.", "O scan prova segurança geral fora do escopo analisado."],
    ]
    table = Table([[Paragraph(c, S["callout"] if r == 0 else S["body"]) for c in row] for r, row in enumerate(rows)], colWidths=[8.1 * cm, 8.1 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), PALE_GREEN),
                ("BACKGROUND", (1, 0), (1, -1), colors.HexColor("#FFF1F1")),
                ("GRID", (0, 0), (-1, -1), 0.45, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(doc.leftMargin, 1.28 * cm, PAGE_W - doc.rightMargin, 1.28 * cm)
    canvas.setFont(FONT, 7.6)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 0.78 * cm, "FCC Security - Professional Defensive Scan Report")
    canvas.drawRightString(PAGE_W - doc.rightMargin, 0.78 * cm, f"Page {doc.page}")
    canvas.restoreState()


def cover_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont(FONT, 7.8)
    canvas.setFillColor(colors.HexColor("#B8C8C3"))
    canvas.drawString(doc.leftMargin, 1.05 * cm, "Independent defensive portfolio artifact. No endorsement, affiliation, or approval claim.")
    canvas.restoreState()


def build_story():
    cv_bullets = [
        f"Documentei o scan defensivo histórico `{HISTORICAL_SCAN_ID}` em aplicação local-first, cobrindo runtime, documentação, deployment gates e evidência pública.",
        "Estruturei threat model, discovery ledger, validation receipts, attack-path analysis e relatório final auditável para esse ciclo histórico.",
        "No ciclo histórico, 18/18 superfícies do worklist foram fechadas, 2 candidatos foram validados e 1 finding MEDIUM de drift documental foi classificado.",
        "No escopo histórico observado, validei ausência de HIGH/CRITICAL, runtime exploit path, segredos, chamadas de rede e sinks DOM perigosos.",
        "Produzi recomendações de remediação com wording público sanitizado e preservação de revisão humana.",
    ]

    linkedin_post = (
        "Documentei um ciclo histórico de revisão defensiva em um protótipo local-first de inteligência de segurança.\n\n"
        "O objetivo não foi criar uma narrativa de marketing, mas transformar um repositório pequeno em evidência auditável: "
        "threat model, discovery ledger, validation receipts, attack-path analysis e relatório final.\n\n"
        f"Resumo do ciclo histórico {HISTORICAL_SCAN_ID}:\n"
        "- 18/18 superfícies do worklist fechadas\n"
        "- 2 candidatos validados\n"
        "- 1 finding final MEDIUM/P2 de drift documental\n"
        "- 0 findings HIGH ou CRITICAL\n"
        "- sem scan externo, sem exploração, sem deploy, sem coleta de credenciais\n\n"
        "O ponto mais importante foi a calibragem: o runtime estático não apresentou caminho de exploit no escopo observado, "
        "mas a documentação pública ainda precisava separar melhor o que é runtime deployável do que é tooling local opcional.\n\n"
        "Para mim, esse é o tipo de trabalho defensivo que vale mostrar: escopo claro, evidência local, revisão humana, "
        "claims conservadores e rastreabilidade do começo ao fim.\n\n"
        "#CyberSecurity #SecureCodeReview #ThreatModeling #AppSec #AIForSecurity"
    )

    cv_text = "\n".join(f"- {item}" for item in cv_bullets)
    return cv_bullets, linkedin_post, cv_text


def build_pdf():
    validate_historical_scan_artifacts()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    cv_bullets, linkedin_post, cv_text = build_story()

    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        leftMargin=2.1 * cm,
        rightMargin=2.1 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        title="FCCSecurity Codex Security Professional Report",
        author="Renan Raad",
    )

    story = []
    story.append(CoverBlock())
    story.append(Spacer(1, -16.5 * cm))
    story.append(Paragraph("FCC Security", S["title"]))
    story.append(Paragraph(f"Relatorio profissional historico do scan {HISTORICAL_SCAN_ID}, evidencias auditaveis e narrativa publica segura", S["subtitle"]))
    story.append(Spacer(1, 0.55 * cm))
    story.append(card("Resumo executivo", f"Scan historico {HISTORICAL_SCAN_ID}: repo-wide local com 18/18 superficies fechadas, 2 candidatos validados, 1 finding final MEDIUM/P2 e nenhum HIGH/CRITICAL sobrevivente. O resultado relevante para portfolio e curriculo e a capacidade de transformar revisao defensiva em evidencia rastreavel, sem representar scans posteriores.", fill=colors.HexColor("#F7FFFB"), border=colors.HexColor("#65D69D")))
    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph("Renan Raad - Defensive AI Security / Secure Code Review / Evidence Workflows", S["subtitle"]))
    story.append(PageBreak())

    story.append(Paragraph("1. Executive Snapshot", S["section"]))
    story.append(kpi_table())
    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph(f"Este relatorio converte o scan tecnico historico {HISTORICAL_SCAN_ID} em uma narrativa profissional segura para curriculo, portfolio e LinkedIn. A leitura correta e: trabalho defensivo local, escopo autorizado, evidencia auditavel e claims conservadores. Nao e uma certificacao, aprovacao externa, prova geral de seguranca fora do escopo ou resumo automatico de scans posteriores.", S["body"]))
    story.append(evidence_table())
    story.append(Spacer(1, 0.2 * cm))
    story.append(card("Finding final reportavel", "MEDIUM/P2 - wording publico/OpenAI-facing estava amplo demais ao afirmar postura static-only/no-dependency sem separar o runtime deployavel do tooling Python local opcional.", fill=PALE_BLUE, border=BLUE))

    story.append(Paragraph("2. O que foi demonstrado", S["section"]))
    story.append(bullets([
        "Capacidade de conduzir um fluxo de seguranca em fases: threat model, discovery, validation, attack-path e final report.",
        "Cobertura auditavel: cada linha do worklist foi fechada por recibo ou disposicao explicita.",
        "Separacao entre bug real, risco reportavel e higiene documental: um candidato foi validado, mas suprimido pela politica final por baixo impacto.",
        "Calibragem profissional: nenhum HIGH/CRITICAL foi forçado quando a evidencia sustentava apenas drift documental MEDIUM.",
        "Postura publica conservadora: sem afirmar aprovacao, afiliacao, deploy externo, scan ofensivo ou seguranca absoluta.",
    ]))
    story.append(Spacer(1, 0.2 * cm))
    story.append(KeepTogether([Paragraph("Linguagem publica segura", S["h3"]), public_safety_table()]))

    story.append(PageBreak())
    story.append(Paragraph("3. Texto para curriculo", S["section"]))
    story.append(Paragraph("Versao curta para experiencia/projeto:", S["h3"]))
    story.append(card("Defensive AI Security - FCC Security", f"Documentei o scan defensivo historico {HISTORICAL_SCAN_ID} em prototipo local-first de seguranca, estruturando threat model, discovery ledger, validation receipts, attack-path analysis e relatorio auditavel. Nesse ciclo, 18/18 superficies do worklist foram fechadas, 2 candidatos foram validados e 1 finding MEDIUM de drift documental foi classificado, sem findings HIGH/CRITICAL no escopo observado.", fill=colors.white, border=ACCENT))
    story.append(Paragraph("Bullets recomendados:", S["h3"]))
    story.append(bullets(cv_bullets))
    story.append(Paragraph("Headline possivel:", S["h3"]))
    story.append(card("Defensive AI Security Builder", "Threat modeling, secure code review, dependency-risk reasoning, patch validation, Codex-assisted workflows and audit-ready evidence.", fill=SOFT, border=LINE))

    story.append(PageBreak())
    story.append(Paragraph("4. Post pronto para LinkedIn", S["section"]))
    story.append(Table([[Paragraph(linkedin_post.replace("\n", "<br/>"), S["quote"])]], colWidths=[16.2 * cm], style=TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F7FAFC")),
        ("BOX", (0, 0), (-1, -1), 0.8, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ])))

    story.append(PageBreak())
    story.append(Paragraph("5. Evidencia e limites", S["section"]))
    story.append(Paragraph(f"O relatorio tecnico historico validado esta em `{HISTORICAL_SCAN_ID}`:", S["body"]))
    story.append(bullets([
        f"docs/security-scans/FCCSecurity/{HISTORICAL_SCAN_ID}/report.md",
        f"docs/security-scans/FCCSecurity/{HISTORICAL_SCAN_ID}/report.html",
        f"docs/security-scans/FCCSecurity/{HISTORICAL_SCAN_ID}/artifacts/02_discovery/work_ledger.jsonl - 18/18 recibos de cobertura historica",
        f"docs/security-scans/FCCSecurity/{HISTORICAL_SCAN_ID}/artifacts/05_findings/FCCSEC-DOC-001 - validation e attack-path do finding final historico",
    ]))
    story.append(Spacer(1, 0.2 * cm))
    story.append(card("Limites publicos", "Nao dizer que houve aprovacao da OpenAI, auditoria externa independente, deploy em producao, scan ofensivo ou garantia de seguranca. O resultado e um artefato defensivo local, escopado e auditavel.", fill=colors.HexColor("#FFF8E8"), border=colors.HexColor("#F0B429")))
    story.append(Paragraph("Proximo passo recomendado", S["h3"]))
    story.append(Paragraph("Aplicar um patch documental pequeno para escopar a frase 'static/no dependency install' ao runtime deployavel e documentar o tooling Python local como opcional. Depois, rodar grep direcionado para claims publicos, paths locais e dependencias.", S["body"]))

    doc.build(story, onFirstPage=cover_footer, onLaterPages=footer)

    LINKEDIN_TXT.write_text(linkedin_post, encoding="utf-8")
    CV_TXT.write_text(cv_text, encoding="utf-8")


def render_previews():
    import pypdfium2 as pdfium

    pdf = pdfium.PdfDocument(str(PDF_PATH))
    rendered = []
    for index in range(min(3, len(pdf))):
        page = pdf[index]
        bitmap = page.render(scale=1.6).to_pil()
        out = PREVIEW_DIR / f"page-{index + 1}.png"
        bitmap.save(out)
        rendered.append(str(out))
    return rendered


def main():
    build_pdf()
    previews = render_previews()
    reader = PdfReader(str(PDF_PATH))
    result = {
        "pdf": str(PDF_PATH),
        "pages": len(reader.pages),
        "linkedin_txt": str(LINKEDIN_TXT),
        "cv_txt": str(CV_TXT),
        "previews": previews,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
