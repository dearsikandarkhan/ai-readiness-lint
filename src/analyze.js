import path from "node:path";
import { CHECKS } from "./checks.js";

function findFirstMatch(content, patterns) {
  const lines = content.split("\n");
  for (const pattern of patterns) {
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        return { line: i + 1, text: lines[i].trim().slice(0, 100) };
      }
    }
  }
  return null;
}

function gradeFor(score) {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

/**
 * Run all checks across the given agent files and produce a report.
 * A check passes if evidence is found in ANY scanned agent file
 * (repo-level heuristic, not a per-file guarantee).
 */
export function analyze(agentFiles, rootDir) {
  const results = CHECKS.map((check) => {
    let evidence = null;
    let matchedFile = null;

    for (const { filePath, content } of agentFiles) {
      const match = findFirstMatch(content, check.patterns);
      if (match) {
        evidence = match;
        matchedFile = path.relative(rootDir, filePath);
        break;
      }
    }

    return {
      ...check,
      passed: Boolean(evidence),
      evidence,
      matchedFile,
    };
  });

  const passedCount = results.filter((r) => r.passed).length;
  const score = Math.round((passedCount / results.length) * 100);

  return {
    score,
    grade: gradeFor(score),
    passedCount,
    totalChecks: results.length,
    checks: results,
  };
}
