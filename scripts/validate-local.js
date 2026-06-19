const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const files = {
  html: "index.html",
  css: "styles.css",
  js: "app.js",
  readme: "README.md",
  version: "VERSION.md",
  scope: "SECURITY_SCOPE.md",
  threatModel: path.join("docs", "threat-model", "threat_model.md"),
  validation: path.join("docs", "validation", "local_validation.md"),
  bootstrap: path.join("docs", "evidence", "bootstrap_evidence.md"),
  hardening: path.join("docs", "evidence", "runtime_hardening_20260618.md")
};

function read(relativePath) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(absolute, "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertNoMatch(name, content, patterns) {
  for (const pattern of patterns) {
    assert(!pattern.test(content), `${name} matched forbidden pattern: ${pattern}`);
  }
}

const html = read(files.html);
const css = read(files.css);
const js = read(files.js);
const docs = [
  files.readme,
  files.version,
  files.scope,
  files.threatModel,
  files.validation,
  files.bootstrap,
  files.hardening
].map((file) => [file, read(file)]);

const runtime = `${html}\n${css}\n${js}`;

assertNoMatch("runtime", runtime, [
  /innerHTML/,
  /outerHTML/,
  /insertAdjacentHTML/,
  /document\.write/,
  /eval\s*\(/,
  /new Function/,
  /setTimeout\s*\(/,
  /setInterval\s*\(/,
  /fetch\s*\(/,
  /XMLHttpRequest/,
  /WebSocket/,
  /EventSource/,
  /sendBeacon/,
  /javascript:/i
]);

assertNoMatch("app.js direct fcc storage", js, [
  /localStorage\.getItem\(["'`]fcc:/,
  /localStorage\.setItem\(["'`]fcc:/
]);

assert(js.includes("function safeGetStorage"), "safeGetStorage wrapper missing");
assert(js.includes("function safeSetStorage"), "safeSetStorage wrapper missing");
assert(js.includes("const MAX_NOTE_LENGTH = 4000"), "MAX_NOTE_LENGTH contract missing");
assert(js.includes("const ALLOWED_VIEWS"), "ALLOWED_VIEWS contract missing");
assert(js.includes("function normalizedView"), "normalizedView whitelist missing");
assert(js.includes("function setView"), "setView missing");
assert(js.includes('button.setAttribute("aria-current", "page")'), "active view aria-current missing");
assert(js.includes('safeGetStorage("fcc:view", "intelligence")'), "view persistence read missing");
assert(js.includes('safeSetStorage("fcc:view", state.view)'), "view persistence write missing");
assert(js.includes("exportPolicy"), "snapshot exportPolicy missing");
assert(js.includes("notesTruncated"), "snapshot notesTruncated metadata missing");

for (const view of ["intelligence", "evidence", "validation"]) {
  assert(html.includes(`data-view-panel="${view}"`), `Missing data-view-panel for ${view}`);
}
assert(html.includes('class="command-strip" aria-label="Signal filters" data-view-panel="intelligence"'), "Filter strip is not scoped to intelligence view");
assert(html.includes('data-view-panel="evidence" hidden'), "Evidence panel should start hidden");
assert(html.includes('data-view-panel="validation" hidden'), "Validation panel should start hidden");
assert(css.includes("grid-column: 1 / -1"), "Evidence/validation full-width grid rule missing");

const docBundle = docs.map(([file, content]) => `--- ${file} ---\n${content}`).join("\n");
assertNoMatch("docs", docBundle, [
  /docs\/security-scans/,
  /docs\\security-scans/,
  /docs\/deployment/,
  /docs\\deployment/,
  /no-head_/,
  /codex-security-scans/,
  /zero surviving/i,
  /zero findings/i,
  /C:\\Users\\vtcom/
]);

assertNoMatch("unsupported affiliation claims", docBundle, [
  /officially affiliated/i,
  /officially endorsed/i,
  /approved by OpenAI/i,
  /OpenAI approved/i,
  /sponsored by OpenAI/i
]);
assert(docBundle.includes("local-only"), "local-only scope wording missing");
assert(docBundle.includes("sem rede") || docBundle.includes("No network"), "no-network evidence missing");

class FakeClassList {
  constructor(initial = "") {
    this.items = new Set(initial.split(/\s+/).filter(Boolean));
  }

  add(name) {
    this.items.add(name);
  }

  remove(name) {
    this.items.delete(name);
  }

  toggle(name, force) {
    if (force) {
      this.add(name);
      return true;
    }
    this.remove(name);
    return false;
  }

  contains(name) {
    return this.items.has(name);
  }

  toString() {
    return Array.from(this.items).join(" ");
  }
}

class FakeElement {
  constructor(tagName, options = {}) {
    this.tagName = tagName;
    this.id = options.id || "";
    this.dataset = options.dataset || {};
    this.hidden = Boolean(options.hidden);
    this.classList = new FakeClassList(options.className || "");
    this.attributes = new Map();
    this.listeners = new Map();
    this.children = [];
    this.textContent = "";
    this.value = "";
    this.type = "";
    this.download = "";
    this.href = "";
  }

  set className(value) {
    this.classList = new FakeClassList(value);
  }

  get className() {
    return this.classList.toString();
  }

  get firstChild() {
    return this.children[0] || null;
  }

  append(...nodes) {
    this.children.push(...nodes);
  }

  appendChild(node) {
    this.children.push(node);
    return node;
  }

  removeChild(node) {
    const index = this.children.indexOf(node);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
    return node;
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }

  click() {
    const handler = this.listeners.get("click");
    if (handler) {
      handler();
    }
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  getAttribute(name) {
    return this.attributes.get(name) || null;
  }
}

function createFakeDocument() {
  const ids = [
    "riskScore", "riskTrend", "openSignals", "validatedSignals", "deferredSignals",
    "threatList", "signalList", "queueTitle", "detailTitle", "detailSeverity",
    "detailSummary", "detailSource", "detailStatus", "detailOwner", "operatorNotes",
    "ledgerRows", "timelineList", "exportSnapshot", "markReviewed", "escalateSignal"
  ];
  const byId = new Map(ids.map((id) => [id, new FakeElement("div", { id })]));
  byId.set("operatorNotes", new FakeElement("textarea", { id: "operatorNotes" }));

  const navItems = [
    new FakeElement("button", { className: "nav-item active", dataset: { view: "intelligence" } }),
    new FakeElement("button", { className: "nav-item", dataset: { view: "evidence" } }),
    new FakeElement("button", { className: "nav-item", dataset: { view: "validation" } })
  ];
  const filterChips = ["all", "high", "validation", "closed"].map((filter, index) => new FakeElement("button", {
    className: index === 0 ? "filter-chip active" : "filter-chip",
    dataset: { filter }
  }));
  const panels = [
    new FakeElement("section", { className: "command-strip", dataset: { viewPanel: "intelligence" } }),
    new FakeElement("article", { className: "risk-panel", dataset: { viewPanel: "intelligence" } }),
    new FakeElement("article", { className: "threat-panel", dataset: { viewPanel: "intelligence" } }),
    new FakeElement("article", { className: "queue-panel", dataset: { viewPanel: "intelligence" } }),
    new FakeElement("article", { className: "detail-panel", dataset: { viewPanel: "intelligence" } }),
    new FakeElement("article", { className: "ledger-panel", dataset: { viewPanel: "validation" }, hidden: true }),
    new FakeElement("article", { className: "timeline-panel", dataset: { viewPanel: "evidence" }, hidden: true })
  ];

  return {
    querySelector(selector) {
      if (selector.startsWith("#")) {
        return byId.get(selector.slice(1)) || null;
      }
      return null;
    },
    querySelectorAll(selector) {
      if (selector === ".nav-item") {
        return navItems;
      }
      if (selector === ".filter-chip") {
        return filterChips;
      }
      if (selector === "[data-view-panel]") {
        return panels;
      }
      return [];
    },
    createElement(tagName) {
      return new FakeElement(tagName);
    },
    navItems,
    filterChips,
    panels
  };
}

function assertVisiblePanels(document, view) {
  for (const panel of document.panels) {
    assert(panel.hidden === (panel.dataset.viewPanel !== view), `Panel visibility mismatch for ${panel.className} in ${view}`);
  }
}

const fakeDocument = createFakeDocument();
const storage = new Map([["fcc:view", "unknown-view"]]);
const context = {
  document: fakeDocument,
  localStorage: {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    }
  },
  Blob: class Blob {
    constructor(parts, options) {
      this.parts = parts;
      this.options = options;
    }
  },
  URL: {
    createObjectURL() {
      return "blob:local-validation";
    },
    revokeObjectURL() {}
  },
  Date,
  console
};
vm.createContext(context);
vm.runInContext(js, context, { filename: "app.js" });

assert(storage.get("fcc:view") === "intelligence", "Invalid stored view should normalize to intelligence");
assertVisiblePanels(fakeDocument, "intelligence");
assert(fakeDocument.navItems[0].getAttribute("aria-current") === "page", "Board should be aria-current after initial render");

fakeDocument.navItems[1].click();
assert(storage.get("fcc:view") === "evidence", "Evidence click did not persist view");
assertVisiblePanels(fakeDocument, "evidence");
assert(fakeDocument.navItems[1].getAttribute("aria-current") === "page", "Evidence should be aria-current after click");

fakeDocument.navItems[2].click();
assert(storage.get("fcc:view") === "validation", "Validate click did not persist view");
assertVisiblePanels(fakeDocument, "validation");
assert(fakeDocument.navItems[2].getAttribute("aria-current") === "page", "Validate should be aria-current after click");

console.log("local validation passed");



