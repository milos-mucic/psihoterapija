import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const projectRoot = process.cwd();
const targetRoots = ["src/components", "src/pages"];
const allowedExtensions = new Set([".astro", ".tsx", ".ts"]);
const exemptMarker = "i18n-exempt";

const ignoredPaths = [
  `${path.sep}src${path.sep}features${path.sep}i18n${path.sep}dictionaries${path.sep}`,
  `${path.sep}src${path.sep}content${path.sep}`,
  `${path.sep}src${path.sep}components${path.sep}components${path.sep}Admin`,
  `${path.sep}src${path.sep}pages${path.sep}studio${path.sep}`,
];

const userFacingAttributeNames = new Set(["aria-label", "title", "placeholder", "alt", "label"]);

const ignoredAttributeNames = new Set([
  "class",
  "className",
  "id",
  "name",
  "method",
  "type",
  "href",
  "src",
  "rel",
  "target",
  "for",
  "htmlFor",
  "slot",
  "role",
]);

function normalizeForMatch(filePath) {
  return filePath.split(path.sep).join(path.sep);
}

function shouldIgnorePath(filePath) {
  const normalized = normalizeForMatch(filePath);
  return ignoredPaths.some((segment) => normalized.includes(segment));
}

async function walkDirectory(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDirectory(entryPath)));
      continue;
    }

    if (allowedExtensions.has(path.extname(entry.name)) && !shouldIgnorePath(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
}

function hasLetters(value) {
  return /\p{L}{2,}/u.test(value);
}

function looksLikeCode(value) {
  return (
    value.length === 0 ||
    /^https?:\/\//.test(value) ||
    /^(mailto:|tel:)/.test(value) ||
    /^&[a-z]+;$/i.test(value) ||
    /^var\(--[\w-]+\)$/.test(value) ||
    /^\/[\w\-./[\]]*$/.test(value) ||
    /^[.@/\\\w-]+$/.test(value) ||
    /^[\d\s.,:%+-]+$/.test(value) ||
    /^[\d.\s]+(px|rem|em|vw|vh|ms|s|%)$/.test(value) ||
    /^[\d.\s]+(px|rem|em|vw|vh|ms|s|%)(\s+[\d.\s]+(px|rem|em|vw|vh|ms|s|%))*$/.test(value) ||
    /^(sr|en)(-[A-Za-z]+)*$/.test(value) ||
    /^[A-Z0-9_ -]+$/.test(value) ||
    (value.length <= 4 && /[^\p{ASCII}]/u.test(value) && !/[\s]/.test(value)) ||
    value.includes("{") ||
    value.includes("}") ||
    value.includes("${")
  );
}

function isAllowedLiteralValue(value) {
  const trimmed = value.trim();
  return !hasLetters(trimmed) || looksLikeCode(trimmed);
}

function getLineInfo(sourceFile, position) {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(position);
  return { line: line + 1, column: character + 1 };
}

function lineHasExemption(sourceText, lineNumber) {
  const lines = sourceText.split(/\r?\n/);
  const current = lines[lineNumber - 1] ?? "";
  const previous = lines[lineNumber - 2] ?? "";
  return current.includes(exemptMarker) || previous.includes(exemptMarker);
}

function collectTsViolations(filePath, sourceText) {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const violations = [];

  function report(node, text, reason = "Hardcoded text must come from locale JSON.") {
    const { line, column } = getLineInfo(sourceFile, node.getStart(sourceFile));
    if (lineHasExemption(sourceText, line)) return;
    violations.push({
      filePath,
      line,
      column,
      text: text.trim(),
      reason,
    });
  }

  function getAttributeName(node) {
    if (!ts.isJsxAttribute(node)) return null;
    return node.name.text;
  }

  function shouldIgnoreStringLiteral(node) {
    const parent = node.parent;
    if (!parent) return true;

    if (
      ts.isImportDeclaration(parent) ||
      ts.isExportDeclaration(parent) ||
      ts.isLiteralTypeNode(parent) ||
      ts.isTypeAliasDeclaration(parent) ||
      ts.isImportEqualsDeclaration(parent)
    ) {
      return true;
    }

    if (
      ts.isPropertyAssignment(parent) &&
      parent.name &&
      ts.isStringLiteral(parent.name) &&
      parent.name === node
    ) {
      return true;
    }

    if (ts.isJsxAttribute(parent)) {
      const attributeName = getAttributeName(parent);
      if (attributeName && ignoredAttributeNames.has(attributeName)) return true;
      if (attributeName && attributeName.startsWith("data-")) return true;
      return false;
    }

    let current = parent;
    while (current) {
      if (ts.isJsxAttribute(current) && current.name.text === "style") {
        return true;
      }
      current = current.parent;
    }

    if (ts.isNewExpression(parent) && parent.expression.getText(sourceFile) === "Error") {
      return true;
    }

    if (
      ts.isCallExpression(parent) &&
      parent.expression.getText(sourceFile).includes("toLocaleDateString")
    ) {
      return true;
    }

    return false;
  }

  function visit(node) {
    if (ts.isJsxText(node)) {
      const value = node.getText(sourceFile).replace(/\s+/g, " ").trim();
      if (hasLetters(value)) {
        report(node, value);
      }
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (!shouldIgnoreStringLiteral(node)) {
        const value = node.text.trim();
        if (!isAllowedLiteralValue(value)) {
          report(node, value);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return violations;
}

function collectAstroViolations(filePath, sourceText) {
  const violations = [];
  let body = sourceText;

  if (sourceText.startsWith("---")) {
    const secondFence = sourceText.indexOf("\n---", 3);
    if (secondFence !== -1) {
      const frontmatter = sourceText.slice(3, secondFence);
      violations.push(...collectTsViolations(filePath, frontmatter));
      body = sourceText.slice(secondFence + 4);
    }
  }

  const lines = body.split(/\r?\n/);

  const textNodePattern = />\s*([^<>{][^<]*)\s*</g;
  const attributePattern = /\b([A-Za-z:-]+)\s*=\s*"([^"]+)"/g;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.includes(exemptMarker)) continue;

    for (const match of line.matchAll(textNodePattern)) {
      const value = match[1].replace(/\s+/g, " ").trim();
      if (hasLetters(value) && !isAllowedLiteralValue(value)) {
        violations.push({
          filePath,
          line: index + 1,
          column: (match.index ?? 0) + 1,
          text: value,
          reason: "Hardcoded markup text must come from locale JSON.",
        });
      }
    }

    for (const match of line.matchAll(attributePattern)) {
      const attributeName = match[1];
      const value = match[2].trim();
      if (!userFacingAttributeNames.has(attributeName)) continue;
      if (!hasLetters(value) || isAllowedLiteralValue(value)) continue;

      violations.push({
        filePath,
        line: index + 1,
        column: (match.index ?? 0) + 1,
        text: value,
        reason: `Hardcoded ${attributeName} text must come from locale JSON.`,
      });
    }
  }

  return violations;
}

async function main() {
  const files = (
    await Promise.all(targetRoots.map((root) => walkDirectory(path.join(projectRoot, root))))
  ).flat();

  const violations = [];

  for (const filePath of files) {
    const sourceText = await fs.readFile(filePath, "utf8");
    const extension = path.extname(filePath);

    if (extension === ".astro") {
      violations.push(...collectAstroViolations(filePath, sourceText));
      continue;
    }

    violations.push(...collectTsViolations(filePath, sourceText));
  }

  if (violations.length === 0) {
    console.log("i18n lint passed: no free text found in UI source.");
    return;
  }

  console.error("i18n lint failed. Move free text into locale JSON dictionaries.");
  for (const violation of violations) {
    const relativePath = path.relative(projectRoot, violation.filePath);
    console.error(`${relativePath}:${violation.line}:${violation.column} ${violation.reason}`);
    console.error(`  -> ${violation.text}`);
  }

  process.exitCode = 1;
}

await main();
