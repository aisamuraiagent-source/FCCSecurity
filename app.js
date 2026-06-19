const signals = [
  {
    id: "SIG-001",
    title: "Public claim drift in security evidence",
    summary: "Documentation was reconciled against the clean local-first workspace and current local evidence.",
    severity: "medium",
    status: "Closed",
    source: "docs/evidence",
    owner: "Codex",
    category: "closed",
    evidence: "README, VERSION, SECURITY_SCOPE, threat model, and local validation now describe the clean C:\\tmp workspace without relying on absent scan bundles.",
    action: "Keep any future public wording tied to sanitized local validation receipts before publication."
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
    evidence: "Local validation and sink grep found no runtime unsafe DOM, dynamic execution, or network sinks.",
    action: "Keep data rendering on textContent/createElement and re-run sink checks."
  },
  {
    id: "SIG-003",
    title: "Clean local project bootstrap completed",
    summary: "The project was rebuilt outside OneDrive as a clean local-first workspace with backup evidence preserved.",
    severity: "low",
    status: "Closed",
    source: "local bootstrap evidence",
    owner: "Codex",
    category: "closed",
    evidence: "Backup and clean-project evidence are recorded under docs/evidence and docs/validation in the C:\\tmp workspace.",
    action: "Use local validation evidence as the release gate before any future publication decision."
  },
  {
    id: "SIG-004",
    title: "Local-only intelligence state",
    summary: "Operator notes and selected signal state stay in the browser through localStorage.",
    severity: "low",
    status: "Closed",
    source: "browser localStorage",
    owner: "FCC Security",
    category: "closed",
    evidence: "No backend or network path exists in the current prototype.",
    action: "Keep local state bounded; avoid storing secrets or personal identifiers."
  }
];

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
  ["Public claims", "suppressed", "One stale status claim patched and suppressed before final report"],
  ["Local storage", "suppressed", "No secrets intended; warning documented"]
];

const timeline = [
  ["2026-06-16 09:54", "UI concept generated for operational dashboard direction."],
  ["2026-06-16 10:00", "Repository scaffold created as static local-first prototype."],
  ["2026-06-16 10:05", "Threat model persisted for local defensive review workflow."],
  ["2026-06-16 10:45", "Clean local workspace created, validated, and kept out of active cloud workflow."]
];

const MAX_NOTE_LENGTH = 4000;
const ALLOWED_VIEWS = ["intelligence", "evidence", "validation"];

const storageState = {
  available: true,
  lastError: ""
};

function safeGetStorage(key, fallback = "") {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    storageState.available = false;
    storageState.lastError = error.name || "StorageError";
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    storageState.available = true;
    storageState.lastError = "";
    return true;
  } catch (error) {
    storageState.available = false;
    storageState.lastError = error.name || "StorageError";
    return false;
  }
}

function boundedNote(value) {
  return value.slice(0, MAX_NOTE_LENGTH);
}

function normalizedView(view) {
  return ALLOWED_VIEWS.includes(view) ? view : "intelligence";
}

const state = {
  filter: "all",
  selectedId: safeGetStorage("fcc:selectedSignal", signals[0].id),
  view: normalizedView(safeGetStorage("fcc:view", "intelligence"))
};

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
  const savedNotes = boundedNote(safeGetStorage(`fcc:notes:${signal.id}`, ""));

  elements.detailTitle.textContent = signal.title;
  elements.detailSeverity.textContent = signal.severity;
  elements.detailSeverity.className = `severity-badge ${severityClass(signal.severity)}`;
  elements.detailSummary.textContent = `${signal.summary} Next action: ${signal.action}`;
  elements.detailSource.textContent = signal.source;
  elements.detailStatus.textContent = signal.status;
  elements.detailOwner.textContent = signal.owner;
  elements.operatorNotes.value = savedNotes;
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

function setView(view) {
  state.view = normalizedView(view);
  safeSetStorage("fcc:view", state.view);

  document.querySelectorAll(".nav-item").forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("active", active);
    if (active) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== state.view;
  });
}

function exportSnapshot() {
  const signal = selectedSignal();
  const notes = boundedNote(elements.operatorNotes.value);
  const snapshot = {
    generatedAt: new Date().toISOString(),
    selectedSignal: signal,
    notes,
    exportPolicy: {
      notesIncluded: true,
      notesMaxLength: MAX_NOTE_LENGTH,
      notesTruncated: elements.operatorNotes.value.length > MAX_NOTE_LENGTH,
      localStorageAvailable: storageState.available,
      localStorageLastError: storageState.lastError
    },
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
  button.addEventListener("click", () => setView(button.dataset.view));
});

elements.operatorNotes.addEventListener("input", () => {
  const nextValue = boundedNote(elements.operatorNotes.value);
  if (nextValue !== elements.operatorNotes.value) {
    elements.operatorNotes.value = nextValue;
  }
  safeSetStorage(`fcc:notes:${selectedSignal().id}`, nextValue);
});

elements.markReviewed.addEventListener("click", () => {
  const signal = selectedSignal();
  signal.status = "Closed";
  renderAll();
});

elements.escalateSignal.addEventListener("click", () => {
  const signal = selectedSignal();
  signal.status = "Needs validation";
  signal.severity = signal.severity === "low" ? "medium" : signal.severity;
  renderAll();
});

elements.exportSnapshot.addEventListener("click", exportSnapshot);

renderAll();
setView(state.view);





