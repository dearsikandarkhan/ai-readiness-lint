const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function colorForGrade(grade) {
  if (grade === "A" || grade === "B") return COLORS.green;
  if (grade === "C") return COLORS.yellow;
  return COLORS.red;
}

export function printTerminalReport(result, { rootDir, agentFileCount, totalFilesScanned }) {
  const { score, grade, passedCount, totalChecks, checks } = result;
  const gradeColor = colorForGrade(grade);

  const lines = [];
  lines.push("");
  lines.push(`${COLORS.bold}ai-readiness-lint${COLORS.reset} — AI agent production-readiness scan`);
  lines.push(COLORS.dim + "─".repeat(56) + COLORS.reset);
  lines.push(
    `Scanned ${totalFilesScanned} files, found ${agentFileCount} agent-related file(s) in ${rootDir}`
  );
  lines.push("");
  lines.push(
    `${COLORS.bold}Readiness score: ${gradeColor}${score}/100 (${grade})${COLORS.reset}  ` +
      `${COLORS.dim}(${passedCount}/${totalChecks} checks passed)${COLORS.reset}`
  );
  lines.push("");

  const byCategory = {};
  for (const check of checks) {
    byCategory[check.category] = byCategory[check.category] || [];
    byCategory[check.category].push(check);
  }

  for (const [category, categoryChecks] of Object.entries(byCategory)) {
    lines.push(`${COLORS.bold}${category}${COLORS.reset}`);
    for (const check of categoryChecks) {
      const icon = check.passed ? `${COLORS.green}✓${COLORS.reset}` : `${COLORS.red}✗${COLORS.reset}`;
      lines.push(`  ${icon} ${check.name}`);
      if (check.passed) {
        lines.push(
          `      ${COLORS.dim}found in ${check.matchedFile}:${check.evidence.line}${COLORS.reset}`
        );
      } else {
        lines.push(`      ${COLORS.dim}${check.why}${COLORS.reset}`);
        lines.push(`      ${COLORS.cyan}→ ${check.fix}${COLORS.reset}`);
      }
    }
    lines.push("");
  }

  if (agentFileCount === 0) {
    lines.push(
      `${COLORS.yellow}No agent-related files detected. This tool looks for LangGraph, CrewAI,` +
        ` LangChain, AutoGen, or Bedrock AgentCore signals. If your agent uses a different` +
        ` framework, results above are not meaningful yet.${COLORS.reset}`
    );
    lines.push("");
  }

  lines.push(
    COLORS.dim +
      "Note: this is a static heuristic scan, not a guarantee — a passing check means" +
      " evidence was found somewhere in your agent code, not that it's implemented correctly." +
      COLORS.reset
  );
  lines.push("");

  console.log(lines.join("\n"));
}

export function toJSON(result, meta) {
  return JSON.stringify(
    {
      score: result.score,
      grade: result.grade,
      passedCount: result.passedCount,
      totalChecks: result.totalChecks,
      meta,
      checks: result.checks.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        passed: c.passed,
        matchedFile: c.matchedFile,
        evidenceLine: c.evidence ? c.evidence.line : null,
        why: c.passed ? undefined : c.why,
        fix: c.passed ? undefined : c.fix,
      })),
    },
    null,
    2
  );
}
