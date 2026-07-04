const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

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

const localEvidenceDirectory = "local-evidence";
const evidenceManifestFile = "docs/evidence/evidence_manifest.json";
const manifestDigestAlgorithm = "sha256";
const publicationSkipDirectories = new Set([".git", localEvidenceDirectory, "node_modules"]);
const publicationExtensions = new Set([
  ".css",
  ".csv",
  ".html",
  ".js",
  ".json",
  ".jsonl",
  ".md",
  ".py",
  ".txt",
  ".yaml",
  ".yml"
]);

const localFileScheme = "file" + ":///";
const absoluteLocalPathPatterns = [
  new RegExp("(^|[^A-Za-z])[A-Z]:[\\\\/]", "i"),
  new RegExp(`${localFileScheme}[A-Z]:/`, "i")
];

const allowedPublicEmails = new Set(["partnercomms@openai.com"]);
const directEmailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const directPhonePattern = /\+\d{1,3}\s?\d{1,3}\s?\d{4,}/g;
const privateRemoteUrlPattern = new RegExp(
  `${"https://github\\.com/"}${"aisamuraiagent-source/"}${"FCCSecurity\\.git"}`,
  "i"
);
const privateRemoteMetadataPatterns = [
  {
    pattern: privateRemoteUrlPattern,
    label: "concrete private GitHub remote URL"
  },
  {
    pattern: /Current remote:\s*`origin`\s*->/i,
    label: "concrete Git remote mapping"
  },
  {
    pattern: new RegExp(["Current", "sync", "state", "observed"].join("\\s+"), "i"),
    label: "concrete Git branch sync-state label"
  },
  {
    pattern: /main\.\.\.origin\/main/i,
    label: "concrete Git branch tracking state"
  },
  {
    pattern: new RegExp(["The", "private", "GitHub", "repository", "now", "exists"].join("\\s+"), "i"),
    label: "private repository existence statement"
  },
  {
    pattern: new RegExp(["private", "remote", "audit", "context"].join("[-\\s]+"), "i"),
    label: "sensitive remote metadata marker"
  }
];

function readRelative(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function stableJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function normalizeManifestScopePath(file) {
  const normalized = file.replace(/\\/g, "/");
  assert(
    normalized && !path.isAbsolute(normalized) && !normalized.split("/").includes(".."),
    `manifest scope file must be repository-relative: ${file}`
  );
  return normalized;
}

function manifestForDigest(manifest) {
  const copy = JSON.parse(JSON.stringify(manifest));
  delete copy.scopeDigest;
  return `${stableJson(copy)}\n`;
}

function listManifestScopeFiles(manifest) {
  assert(manifest.scope && typeof manifest.scope === "object", "manifest must include scope");
  const files = new Set([evidenceManifestFile]);

  for (const scopeFiles of Object.values(manifest.scope)) {
    assert(Array.isArray(scopeFiles), "manifest scope entries must be arrays");
    for (const file of scopeFiles) {
      files.add(normalizeManifestScopePath(file));
    }
  }

  return [...files].sort();
}

function calculateManifestScopeDigest(manifest) {
  const hash = crypto.createHash(manifestDigestAlgorithm);
  for (const file of listManifestScopeFiles(manifest)) {
    const content = file === evidenceManifestFile
      ? manifestForDigest(manifest)
      : readRelative(file).replace(/\r\n/g, "\n");
    hash.update(file);
    hash.update("\0");
    hash.update(content);
    hash.update("\0");
  }
  return `${manifestDigestAlgorithm}:${hash.digest("hex")}`;
}

function runGit(args, errorMessage) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8"
  });

  if (result.error) {
    throw result.error;
  }

  assert(
    result.status === 0,
    `${errorMessage}: ${(result.stderr || result.stdout || "").trim()}`
  );

  return result.stdout.trim();
}

function listPublicationFiles(directory = root) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && publicationSkipDirectories.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listPublicationFiles(fullPath));
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    if (publicationExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(path.relative(root, fullPath).replace(/\\/g, "/"));
    }
  }
  return files;
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

function checkLocalEvidencePolicy() {
  const gitignoreLines = readRelative(".gitignore")
    .split(/\r?\n/)
    .map((line) => line.trim());

  assert(
    gitignoreLines.includes(`${localEvidenceDirectory}/`),
    `${localEvidenceDirectory}/ must be ignored before it is skipped by publication sanitization`
  );

  if (!fs.existsSync(path.join(root, ".git"))) {
    return;
  }

  const result = spawnSync("git", ["ls-files", "-z"], {
    cwd: root,
    encoding: "utf8"
  });

  if (result.error) {
    throw result.error;
  }

  assert(
    result.status === 0,
    `git ls-files failed: ${(result.stderr || "").trim()}`
  );

  const trackedFiles = result.stdout
    .split("\0")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => file.split(/[\\/]/).includes(localEvidenceDirectory));

  assert(
    trackedFiles.length === 0,
    `${localEvidenceDirectory}/ files must not be tracked: ${trackedFiles.join(", ")}`
  );
}

function checkPublicSurfaceSanitization() {
  for (const file of listPublicationFiles()) {
    const content = readRelative(file);
    for (const pattern of absoluteLocalPathPatterns) {
      assert(!pattern.test(content), `unsanitized absolute local path ${pattern} found in ${file}`);
    }
    for (const match of content.matchAll(directEmailPattern)) {
      assert(allowedPublicEmails.has(match[0].toLowerCase()), `direct email address found in ${file}`);
    }
    assert(!directPhonePattern.test(content), `direct phone number found in ${file}`);
    directPhonePattern.lastIndex = 0;
    for (const { pattern, label } of privateRemoteMetadataPatterns) {
      assert(!pattern.test(content), `${label} found in ${file}`);
    }
  }
}

function checkManifest() {
  const manifest = JSON.parse(readRelative(evidenceManifestFile));
  assert(manifest.schemaVersion === 1, "manifest schemaVersion must be 1");
  assert(/^[0-9a-f]{40}$/i.test(manifest.baseCommit), "manifest baseCommit must be a full Git commit SHA");
  if (fs.existsSync(path.join(root, ".git"))) {
    runGit(["cat-file", "-e", `${manifest.baseCommit}^{commit}`], "manifest baseCommit must exist in local Git history");
    runGit(["merge-base", "--is-ancestor", manifest.baseCommit, "HEAD"], "manifest baseCommit must be an ancestor of HEAD");
  }
  const expectedDigest = calculateManifestScopeDigest(manifest);
  assert(
    manifest.scopeDigest === expectedDigest,
    `manifest scopeDigest must match current validation scope: expected ${expectedDigest}`
  );
  assert(manifest.claimPolicy.uiReviewActions.includes("Session-only"), "manifest must identify session-only review actions");
  assert(manifest.claimPolicy.historicalScanArtifacts.includes("Dated local receipts"), "manifest must separate historical scan artifacts from current validation");
  assert(Array.isArray(manifest.commands) && manifest.commands.length >= 3, "manifest must list validation commands");
}

function main() {
  checkRequiredFiles();
  checkRuntimeSinks();
  checkEvidenceIntegrityContracts();
  checkLiveDocClaims();
  checkLocalEvidencePolicy();
  checkPublicSurfaceSanitization();
  checkManifest();
  console.log("local validation passed");
}

main();
