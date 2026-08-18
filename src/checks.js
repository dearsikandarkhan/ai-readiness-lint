/**
 * Each check is a heuristic, static-analysis signal — not a guarantee.
 * A "pass" means we found evidence the concern is addressed somewhere
 * in the scanned agent files. A "fail" means we found no such evidence,
 * which is a prompt to go verify manually, not a definitive bug report.
 */
export const CHECKS = [
  {
    id: "error-handling",
    name: "Error handling around model/tool calls",
    category: "Reliability",
    patterns: [
      /try\s*:/, // python
      /except\s+\w*Error/i,
      /try\s*{/, // js/ts
      /catch\s*\(/,
      /\.catch\(/,
    ],
    why: "Agent runs fail in the wild (timeouts, malformed tool output, rate limits). Without try/catch around model or tool calls, one bad response can crash the whole run.",
    fix: "Wrap LLM/tool calls in try/except (Python) or try/catch (JS/TS), and decide explicitly what happens on failure (retry, fallback, surface to user).",
  },
  {
    id: "cost-controls",
    name: "Cost / token limits",
    category: "Cost",
    patterns: [
      /max_tokens/i,
      /token_budget/i,
      /cost_limit/i,
      /max_iterations/i,
      /max_steps/i,
      /budget/i,
    ],
    why: "Agentic loops (especially ones with retries or reflection) can run away and burn tokens with no ceiling, turning a $2 task into a $200 one.",
    fix: "Set explicit max_tokens, max_iterations/max_steps, or a cost/budget ceiling per run, and fail closed when it's hit.",
  },
  {
    id: "human-in-the-loop",
    name: "Human-in-the-loop checkpoint for risky actions",
    category: "Safety",
    patterns: [
      /human_review/i,
      /require_approval/i,
      /\binterrupt\b/i,
      /\bconfirm\(/i,
      /needs_approval/i,
      /await\s+approval/i,
    ],
    why: "If the agent can take real-world actions (send emails, modify records, spend money), an unreviewed failure mode can cause real damage.",
    fix: "Add an explicit approval/interrupt step before high-risk actions, even if it's just a flag that routes to manual review initially.",
  },
  {
    id: "evaluation",
    name: "Evaluation or test coverage",
    category: "Quality",
    patterns: [
      /\beval(uate)?_/i,
      /def\s+test_/,
      /\.test\.[jt]sx?/,
      /describe\(/,
      /langfuse.*score/i,
      /langsmith.*eval/i,
    ],
    why: "Without any eval or test harness, you have no way to know if a prompt/model change made the agent better or worse before it hits users.",
    fix: "Add a small eval set (even 10-20 cases) with expected outcomes, run automatically on changes to prompts or agent logic.",
  },
  {
    id: "retry-fallback",
    name: "Retry / fallback logic",
    category: "Reliability",
    patterns: [
      /retry/i,
      /fallback/i,
      /exponential_backoff/i,
      /backoff/i,
      /circuit_breaker/i,
    ],
    why: "Model APIs and tool calls fail transiently. Without retries or a fallback path, a single flaky call fails the whole task.",
    fix: "Add retry with backoff for transient failures, and a defined fallback (simpler model, cached response, human handoff) for persistent ones.",
  },
  {
    id: "timeouts",
    name: "Timeout handling",
    category: "Reliability",
    patterns: [/timeout/i, /\.timeout\(/i, /signal:\s*AbortSignal/i],
    why: "Agent loops without timeouts can hang indefinitely on a slow tool call or an infinite reasoning loop, silently consuming resources.",
    fix: "Set an explicit timeout per step and per overall run, with a defined behavior when it's exceeded.",
  },
  {
    id: "observability",
    name: "Observability / tracing",
    category: "Operations",
    patterns: [
      /langfuse/i,
      /langsmith/i,
      /opentelemetry/i,
      /\.trace\(/i,
      /logging\.(info|warning|error|debug)/,
      /logger\.(info|warning|error|debug)/i,
      /console\.(log|warn|error)/,
    ],
    why: "If you can't see what the agent decided and why, you can't debug incidents or improve it — you're flying blind in production.",
    fix: "Instrument runs with a tracing tool (Langfuse, LangSmith, OpenTelemetry) or at minimum structured logging of decisions and tool calls.",
  },
  {
    id: "rate-limiting",
    name: "Rate limiting / throttling",
    category: "Operations",
    patterns: [/rate_limit/i, /throttle/i, /\bRateLimiter\b/, /semaphore/i],
    why: "Agents that call external tools or APIs in a loop can trigger provider rate limits or hammer downstream systems without any throttle.",
    fix: "Add a rate limiter or concurrency cap around external calls, especially in multi-step or parallel agent workflows.",
  },
];
