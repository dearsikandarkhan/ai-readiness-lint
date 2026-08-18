import fs from "node:fs";
import path from "node:path";

const CODE_EXTENSIONS = new Set([".py", ".js", ".jsx", ".ts", ".tsx", ".mjs"]);

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "venv",
  ".venv",
  "__pycache__",
  ".next",
  "coverage",
  ".pytest_cache",
]);

// Signals that a file is likely defining or orchestrating an AI agent,
// not just any code that happens to call an LLM API once.
const AGENT_SIGNALS = [
  /langgraph/i,
  /crewai/i,
  /autogen/i,
  /from\s+langchain/i,
  /import\s+langchain/i,
  /StateGraph/,
  /AgentExecutor/,
  /bedrock.*agent/i,
  /agentcore/i,
  /class\s+\w*Agent\w*/,
  /def\s+run_agent/,
  /\bcreate_react_agent\b/,
  /\btool_calls?\b/i,
];

/**
 * Recursively walk `rootDir` and return all code files.
 */
function walk(rootDir) {
  const results = [];

  function recurse(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".") && entry.name !== ".github") continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (IGNORE_DIRS.has(entry.name)) continue;
        recurse(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (CODE_EXTENSIONS.has(ext)) {
          results.push(fullPath);
        }
      }
    }
  }

  recurse(rootDir);
  return results;
}

/**
 * Scan a directory and return the subset of files that look like
 * agent/orchestration code, along with their contents.
 */
export function scanRepo(rootDir) {
  const allFiles = walk(rootDir);
  const agentFiles = [];

  for (const filePath of allFiles) {
    let content;
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }
    if (AGENT_SIGNALS.some((pattern) => pattern.test(content))) {
      agentFiles.push({ filePath, content });
    }
  }

  return {
    totalFilesScanned: allFiles.length,
    agentFiles,
  };
}
