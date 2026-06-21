const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const runtimeFiles = ["index.html", "app.js", "styles.css"];
const requiredFiles = [
  ...runtimeFiles,
  "README.md",
  "VERSION.md",
  "SAFETY_TEST_PLAN.md",
  "SECURITY_FINDINGS.md",
  "REMEDIATION_BACKLOG.md",
  "PATCH_VALIDATION_REPORT.md",
  "docs/threat-model/threat_model.md",
  "docs/evidence/implementation_evidence.md",
  "docs/evidence/evidence_manifest.json",
  "docs/validation/local_validation.md"
];

const runtimeForbidden = [
  /innerHTML/,
  /outerHTML/,
  /insertAdjacentHTML/,
  /document\.write/,
  /eval\s*\(/,
  /new Function/,
  /setTimeout\s*\(\s*["'`]/,
  /setInterval\s*\(\s*["'`]/,
  /fetch\s*\(/,
  /XMLHttpRequest/,
  /WebSocket/,
  /EventSource/,
  /sendBeacon/,
  /javascript:/
];

const liveDocs = [
  "README.md",
  "VERSION.md",
  "SAFETY_TEST_PLAN.md",
  "SECURITY_FINDINGS.md",
  "REMEDIATION_BACKLOG.md",
  "PATCH_VALIDATION_REPORT.md",
  "docs/threat-model/threat_model.md",
  "docs/evidence/implementation_evidence.md",
  "docs/validation/local_validation.md",
  "docs/deployment/deploy_manifest.md",
  "docs/deployment/public_release_gate.md",
  "docs/openai/openai_deploy_review_request.md",
  "docs/openai/openai_developer_forum_post.md"
];

const staleLiveClaims = [
  /zero findings/i,
  /zero surviving/i,
  /zero reportable/i,
  /release-gate evidence/i,
  /scan completed/i,
  /scan completo/i,
  /valida[cç][aã]o conclu[ií]da/i
];

function readRelative(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkRequiredFiles() {
  for (const file of requiredFiles) {
    assert(fs.existsSync(path.join(root, file)), `missing required file: ${file}`);
  }
}

function checkRuntimeSinks() {
  for (const file of runtimeFiles) {
    const content = readRelative(file);
    for (const pattern of runtimeForbidden) {
      assert(!pattern.test(content), `forbidden runtime pattern ${pattern} found in ${file}`);
    }
  }
}

function checkEvidenceIntegrityContracts() {
  const app = readRelative("app.js");
  assert(app.includes("SNAPSHOT_SCHEMA_VERSION"), "app export must declare snapshot schema version");
  assert(app.includes("STATE_MODE = \"session-only\""), "app export must declare session-only state mode");
  assert(app.includes("EVIDENCE_MANIFEST_PATH"), "app export must point to the evidence manifest");
  assert(app.includes("MAX_NOTE_LENGTH"), "operator notes must be bounded");
  assert(app.includes("safeGetStorage") && app.includes("safeSetStorage"), "localStorage access must use safe wrappers");

  const index = readRelative("index.html");
  assert(index.includes("Mark reviewed in session"), "review button must be labeled session-only");
  assert(index.includes("Flag in session"), "flag button must be labeled session-only");
  assert(index.includes("Do not enter secrets"), "operator notes UI must warn against secrets");
}

function checkLiveDocClaims() {
  for (const file of liveDocs) {
    const fullPath = path.join(root, file);
    if (!fs.existsSync(fullPath)) {
      continue;
    }
    const content = readRelative(file);
    for (const pattern of staleLiveClaims) {
      assert(!pattern.test(content), `stale live evidence claim ${pattern} found in ${file}`);
    }
  }
}

function checkManifest() {
  const manifest = JSON.parse(readRelative("docs/evidence/evidence_manifest.json"));
  assert(manifest.schemaVersion === 1, "manifest schemaVersion must be 1");
  assert(typeof manifest.baseCommit === "string" && manifest.baseCommit.length >= 7, "manifest must include baseCommit");
  assert(manifest.claimPolicy.uiReviewActions.includes("Session-only"), "manifest must identify session-only review actions");
  assert(manifest.claimPolicy.historicalScanArtifacts.includes("Dated local receipts"), "manifest must separate historical scan artifacts from current validation");
  assert(Array.isArray(manifest.commands) && manifest.commands.length >= 3, "manifest must list validation commands");
}

function main() {
  checkRequiredFiles();
  checkRuntimeSinks();
  checkEvidenceIntegrityContracts();
  checkLiveDocClaims();
  checkManifest();
  console.log("local validation passed");
}

main();
