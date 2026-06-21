const signals = [
  {
    id: "SIG-001",
    title: "Evidence integrity alignment",
    summary: "Live docs and dashboard wording must distinguish historical scan receipts from current local validation.",
    severity: "medium",
    status: "Closed",
    source: "README, VERSION, validation docs",
    owner: "Codex",
    category: "closed",
    evidence: "Current validation is tied to scripts/validate-local.js and docs/evidence/evidence_manifest.json; historical scan artifacts remain dated receipts, not fresh release-gate proof.",
    action: "Keep public wording tied to the latest manifest before publication."
  },
  {
    id: "SIG-002",
    title: "Runtime rendering sink control",
    summary: "Dynamic UI rendering preserves text-only writes for operator notes and signal labels.",
    severity: "high",
    status: "Closed",
    source: "app.js",
    owner: "FCC Security",
    category: "closed",
    evidence: "Local validation checks runtime files for unsafe DOM, dynamic execution, timer-string, and browser network sinks.",
    action: "Keep data rendering on textContent/createElement and re-run sink checks."
  },
  {
    id: "SIG-003",
    title: "Historical Codex Security scan receipt",
    summary: "Repo-wide Codex Security artifacts are retained as dated evidence and are not treated as a fresh current scan.",
    severity: "low",
    status: "Deferred",
    source: "docs/security-scans/FCCSecurity",
    owner: "Codex",
    category: "deferred",
    evidence: "Historical reports remain in docs/security-scans/FCCSecurity/no-head_20260618T085508-0300; current release decisions require fresh local validation.",
    action: "Do not present historical scan output as current audit-ready release evidence without a new manifest."
  },
  {
    id: "SIG-004",
    title: "Session-only review state",
    summary: "Operator notes and selected signal state stay local; review button changes are session-only UI state.",
    severity: "low",
    status: "Closed",
    source: "browser localStorage",
    owner: "FCC Security",
    category: "closed",
    evidence: "Exported JSON declares schemaVersion, stateMode, manifest path, note policy, and session transitions.",
    action: "Avoid treating exports as an audit ledger until durable history and approval identity exist."
  }
];

const APP_VERSION = "0.1.2-evidence-integrity";
const SNAPSHOT_SCHEMA_VERSION = 2;
const STATE_MODE = "session-only";
const MAX_NOTE_LENGTH = 4000;
const EVIDENCE_MANIFEST_PATH = "docs/evidence/evidence_manifest.json";
const NOTE_POLICY = "Local notes are browser-local operator context, not a secret vault or durable audit ledger.";

const threatSurfaces = [
  {
    name: "Public evidence credibility",
    detail: "README, validation docs, scan outputs, and portfolio wording must not overclaim."
  },
  {
    name: "Local operator state",
    detail: "Notes and selections are browser-local and must not become a secret store."
  },
  {
    name: "Rendering boundary",
    detail: "Signal data is untrusted by default and must render through text-safe APIs."
  },
  {
    name: "Scan workflow integrity",
    detail: "Coverage, validation, and attack-path receipts must stay explicit and auditable."
  }
];

const ledgerRows = [
  ["Static UI runtime", "not_applicable", "No backend, no auth, no external API"],
  ["DOM rendering", "suppressed", "No unsafe runtime sink found in reviewed files"],
  ["Public claims", "controlled", "Historical scan wording separated from current validation evidence"],
  ["Local storage", "controlled", "Notes are bounded and exported with session-only policy metadata"]
];

const timeline = [
  ["2026-06-16 09:54", "UI concept generated for operational dashboard direction."],
  ["2026-06-16 10:00", "Repository scaffold created as static local-first prototype."],
  ["2026-06-16 10:05", "Threat model persisted for future Codex Security workflow."],
  ["2026-06-18 08:55", "Historical Codex Security scan artifacts preserved as dated local evidence."],
  ["2026-06-21", "Evidence integrity patch added local validator, manifest, and session-only export metadata."]
];

const state = {
  filter: "all",
  selectedId: safeGetStorage("fcc:selectedSignal") || signals[0].id,
  transitions: []
};

function safeGetStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

function boundedNotes(value) {
  return value.slice(0, MAX_NOTE_LENGTH);
}

const elements = {
  riskScore: document.querySelector("#riskScore"),
  riskTrend: document.querySelector("#riskTrend"),
  openSignals: document.querySelector("#openSignals"),
  validatedSignals: document.querySelector("#validatedSignals"),
  deferredSignals: document.querySelector("#deferredSignals"),
  threatList: document.querySelector("#threatList"),
  signalList: document.querySelector("#signalList"),
  queueTitle: document.querySelector("#queueTitle"),
  detailTitle: document.querySelector("#detailTitle"),
  detailSeverity: document.querySelector("#detailSeverity"),
  detailSummary: document.querySelector("#detailSummary"),
  detailSource: document.querySelector("#detailSource"),
  detailStatus: document.querySelector("#detailStatus"),
  detailOwner: document.querySelector("#detailOwner"),
  operatorNotes: document.querySelector("#operatorNotes"),
  ledgerRows: document.querySelector("#ledgerRows"),
  timelineList: document.querySelector("#timelineList"),
  exportSnapshot: document.querySelector("#exportSnapshot"),
  markReviewed: document.querySelector("#markReviewed"),
  escalateSignal: document.querySelector("#escalateSignal")
};

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  return element;
}

function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function severityClass(severity) {
  return severity.toLowerCase();
}

function filteredSignals() {
  if (state.filter === "all") {
    return signals;
  }

  if (state.filter === "high") {
    return signals.filter((signal) => signal.severity === "high");
  }

  if (state.filter === "validation") {
    return signals.filter((signal) => signal.status === "Needs validation" || signal.status === "Open");
  }

  return signals.filter((signal) => signal.status === "Closed" || signal.status === "Deferred");
}

function selectedSignal() {
  return signals.find((signal) => signal.id === state.selectedId) || signals[0];
}

function renderMetrics() {
  const open = signals.filter((signal) => signal.status === "Open" || signal.status === "Needs validation").length;
  const validated = signals.filter((signal) => signal.status === "Closed").length;
  const deferred = signals.filter((signal) => signal.status === "Deferred").length;
  const score = Math.round((open * 28 + deferred * 10 + validated * 4) / signals.length);

  elements.riskScore.textContent = String(score);
  elements.riskTrend.textContent = open > 1 ? "review" : "stable";
  elements.openSignals.textContent = String(open);
  elements.validatedSignals.textContent = String(validated);
  elements.deferredSignals.textContent = String(deferred);
}

function renderThreatModel() {
  clearNode(elements.threatList);
  threatSurfaces.forEach((surface) => {
    const item = document.createElement("li");
    item.className = "threat-item";
    item.append(
      createTextElement("strong", "", surface.name),
      createTextElement("span", "", surface.detail)
    );
    elements.threatList.appendChild(item);
  });
}

function renderSignals() {
  const list = filteredSignals();
  const title = {
    all: "All signals",
    high: "High impact",
    validation: "Needs validation",
    closed: "Closed or deferred"
  }[state.filter];

  elements.queueTitle.textContent = title;
  clearNode(elements.signalList);

  list.forEach((signal) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = signal.id === state.selectedId ? "signal-card active" : "signal-card";
    card.dataset.signalId = signal.id;

    const topLine = document.createElement("div");
    topLine.className = "signal-topline";
    topLine.append(
      createTextElement("p", "signal-title", signal.title),
      createTextElement("span", `status-badge ${severityClass(signal.severity)}`, signal.severity)
    );

    const meta = document.createElement("div");
    meta.className = "signal-meta";
    meta.append(
      createTextElement("span", "status-badge", signal.id),
      createTextElement("span", "status-badge", signal.status)
    );

    card.append(
      topLine,
      createTextElement("p", "signal-summary", signal.summary),
      meta
    );

    card.addEventListener("click", () => {
      state.selectedId = signal.id;
      safeSetStorage("fcc:selectedSignal", state.selectedId);
      renderAll();
    });

    elements.signalList.appendChild(card);
  });
}

function renderDetail() {
  const signal = selectedSignal();
  const savedNotes = safeGetStorage(`fcc:notes:${signal.id}`) || "";

  elements.detailTitle.textContent = signal.title;
  elements.detailSeverity.textContent = signal.severity;
  elements.detailSeverity.className = `severity-badge ${severityClass(signal.severity)}`;
  elements.detailSummary.textContent = `${signal.summary} Next action: ${signal.action}`;
  elements.detailSource.textContent = signal.source;
  elements.detailStatus.textContent = signal.status;
  elements.detailOwner.textContent = signal.owner;
  elements.operatorNotes.value = boundedNotes(savedNotes);
}

function renderLedger() {
  clearNode(elements.ledgerRows);
  ledgerRows.forEach(([surface, disposition, evidence]) => {
    const row = document.createElement("div");
    row.className = "ledger-row";
    row.setAttribute("role", "row");
    row.append(
      createTextElement("span", "", surface),
      createTextElement("span", "", disposition),
      createTextElement("span", "", evidence)
    );
    elements.ledgerRows.appendChild(row);
  });
}

function renderTimeline() {
  clearNode(elements.timelineList);
  timeline.forEach(([time, receipt]) => {
    const item = document.createElement("li");
    item.className = "timeline-item";
    item.append(
      createTextElement("strong", "", time),
      createTextElement("span", "", receipt)
    );
    elements.timelineList.appendChild(item);
  });
}

function renderAll() {
  renderMetrics();
  renderThreatModel();
  renderSignals();
  renderDetail();
  renderLedger();
  renderTimeline();
}

function setFilter(filter) {
  state.filter = filter;
  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
  renderSignals();
}

function exportSnapshot() {
  const signal = selectedSignal();
  const notes = boundedNotes(elements.operatorNotes.value);
  const snapshot = {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    generatedAt: new Date().toISOString(),
    stateMode: STATE_MODE,
    stateScope: "Browser-local session snapshot. Button-driven review changes are not durable audit approvals.",
    sourceManifest: EVIDENCE_MANIFEST_PATH,
    exportPolicy: {
      notePolicy: NOTE_POLICY,
      maxNoteLength: MAX_NOTE_LENGTH,
      notesTruncated: elements.operatorNotes.value.length > MAX_NOTE_LENGTH
    },
    selectedSignal: signal,
    notes,
    sessionTransitions: state.transitions,
    metrics: {
      open: elements.openSignals.textContent,
      validated: elements.validatedSignals.textContent,
      deferred: elements.deferredSignals.textContent,
      score: elements.riskScore.textContent
    }
  };
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "fcc-security-snapshot.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

elements.operatorNotes.addEventListener("input", () => {
  const notes = boundedNotes(elements.operatorNotes.value);
  if (notes !== elements.operatorNotes.value) {
    elements.operatorNotes.value = notes;
  }
  safeSetStorage(`fcc:notes:${selectedSignal().id}`, notes);
});

elements.markReviewed.addEventListener("click", () => {
  const signal = selectedSignal();
  const previousStatus = signal.status;
  signal.status = "Closed";
  state.transitions.push({
    at: new Date().toISOString(),
    signalId: signal.id,
    action: "mark-reviewed-session-only",
    previousStatus,
    nextStatus: signal.status
  });
  renderAll();
});

elements.escalateSignal.addEventListener("click", () => {
  const signal = selectedSignal();
  const previousStatus = signal.status;
  const previousSeverity = signal.severity;
  signal.status = "Needs validation";
  signal.severity = signal.severity === "low" ? "medium" : signal.severity;
  state.transitions.push({
    at: new Date().toISOString(),
    signalId: signal.id,
    action: "flag-session-only",
    previousStatus,
    nextStatus: signal.status,
    previousSeverity,
    nextSeverity: signal.severity
  });
  renderAll();
});

elements.exportSnapshot.addEventListener("click", exportSnapshot);

renderAll();
