#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { scanRepo } from "../src/scanner.js";
import { analyze } from "../src/analyze.js";
import { printTerminalReport, toJSON } from "../src/report.js";
import { generateBadgeSVG } from "../src/badge.js";

function parseArgs(argv) {
  const args = { target: ".", json: false, help: false, badge: null };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") args.json = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--badge") {
      // Optional path argument: --badge ./readiness-badge.svg
      const next = argv[i + 1];
      args.badge = next && !next.startsWith("-") ? next : "readiness-badge.svg";
      if (args.badge !== "readiness-badge.svg") i++;
    } else rest.push(arg);
  }
  if (rest.length > 0) args.target = rest[0];
  return args;
}

function printHelp() {
  console.log(`
ai-readiness-lint — production-readiness linter for AI agents

Usage:
  npx ai-readiness-lint [path] [options]

Options:
  --json          Output machine-readable JSON instead of a terminal report
  --badge [path]  Write an SVG score badge (default: readiness-badge.svg)
                  to embed in your own README
  -h, --help      Show this help message

Examples:
  npx ai-readiness-lint .
  npx ai-readiness-lint ./my-agent --json > report.json
  npx ai-readiness-lint . --badge
`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const rootDir = path.resolve(process.cwd(), args.target);
  const { totalFilesScanned, agentFiles } = scanRepo(rootDir);

  if (agentFiles.length === 0) {
    if (args.json) {
      console.log(
        JSON.stringify(
          { score: null, grade: null, agentFileCount: 0, totalFilesScanned, rootDir },
          null,
          2
        )
      );
    } else {
      console.log(
        `\nai-readiness-lint scanned ${totalFilesScanned} file(s) in ${rootDir} but found no ` +
          `agent-related code (LangGraph, CrewAI, LangChain, AutoGen, Bedrock AgentCore signals).\n` +
          `Nothing to score yet — point this at a directory containing your agent code.\n`
      );
    }
    return;
  }

  const result = analyze(agentFiles, rootDir);

  if (args.json) {
    console.log(
      toJSON(result, {
        rootDir,
        totalFilesScanned,
        agentFileCount: agentFiles.length,
      })
    );
  } else {
    printTerminalReport(result, {
      rootDir,
      totalFilesScanned,
      agentFileCount: agentFiles.length,
    });
  }

  if (args.badge) {
    const svg = generateBadgeSVG(result.score, result.grade);
    fs.writeFileSync(args.badge, svg, "utf8");
    if (!args.json) {
      console.log(`Badge written to ${args.badge} — embed it with:`);
      console.log(`  ![ai-readiness](./${path.basename(args.badge)})\n`);
    }
  }

  // Non-zero exit below a "passing" threshold, so this can gate CI if desired.
  if (result.score < 60) {
    process.exitCode = 1;
  }
}

main();
