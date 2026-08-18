# ai-readiness-lint

A production-readiness linter for AI agents. Point it at a repo and it scans
your agent/orchestration code (LangGraph, CrewAI, LangChain, AutoGen, Bedrock
AgentCore) for the guardrails that separate a demo from something you'd
actually ship: error handling, cost limits, human-in-the-loop checkpoints,
evaluation coverage, retries, timeouts, observability, and rate limiting.

It outputs a Lighthouse-style score (0–100, graded A–F) with evidence for
what it found and concrete suggestions for what's missing.

```
Readiness score: 50/100 (D)  (4/8 checks passed)

Reliability
  ✓ Error handling around model/tool calls
      found in sample-agent.py:15
  ✓ Retry / fallback logic
      found in sample-agent.py:18
  ✗ Timeout handling
      Agent loops without timeouts can hang indefinitely...
      → Set an explicit timeout per step and per overall run...

Safety
  ✗ Human-in-the-loop checkpoint for risky actions
      If the agent can take real-world actions (send emails, modify
      records, spend money), an unreviewed failure mode can cause real damage.
      → Add an explicit approval/interrupt step before high-risk actions...
```

## Why this exists

Most AI agent tooling focuses on making agents easier to *build*. Very
little focuses on whether an agent is actually ready to *run in production*
— the same questions any experienced delivery/engineering lead asks before
sign-off: what happens when this fails? what does it cost if it loops? who
reviews it before it takes a risky action? This tool turns those questions
into a repeatable, automatable check.

## Install & usage

No installation needed — run it directly:

```bash
npx ai-readiness-lint .
```

Or point it at a specific project:

```bash
npx ai-readiness-lint ./path/to/your-agent
```

Machine-readable output for CI pipelines:

```bash
npx ai-readiness-lint . --json > readiness-report.json
```

The CLI exits with a non-zero status code when the score is below 60, so it
can gate a CI pipeline if you want it to.

## What it checks

| Category | Check |
|---|---|
| Reliability | Error handling around model/tool calls |
| Reliability | Retry / fallback logic |
| Reliability | Timeout handling |
| Cost | Cost / token limits |
| Safety | Human-in-the-loop checkpoint for risky actions |
| Quality | Evaluation or test coverage |
| Operations | Observability / tracing |
| Operations | Rate limiting / throttling |

Full details and reasoning for each check are in
[`src/checks.js`](./src/checks.js).

## How it works (and its limits)

This is a **static, heuristic scan** — it looks for regex signals in your
code (e.g. `try/except`, `max_tokens`, `require_approval`, `langfuse`) across
files that look like agent code. It does not execute your agent or call any
LLM API, so it's free and safe to run anywhere, including CI.

That also means it can be fooled: a `try/except` that swallows every error
silently still "passes" the error-handling check. Treat a green check as
"evidence this was considered," not "this is definitely correct." The real
value is in what it catches by omission — an agent that can issue refunds
with no approval step and no eval harness is a good thing to know about
before a client finds out the hard way.

Agent detection currently looks for LangGraph, CrewAI, LangChain, AutoGen,
and Bedrock AgentCore signals. If your framework isn't recognized, the tool
will say so rather than silently returning a meaningless score — please open
an issue or PR with the framework's import signature.

## Roadmap

- [ ] GitHub Action that posts the report as a PR comment
- [ ] Config file (`.airlintrc`) to add custom checks or exclude paths
- [ ] Support for more frameworks (Semantic Kernel, Vercel AI SDK, OpenAI
      Assistants API)
- [ ] Per-file (not just repo-level) scoring

## Contributing

Issues and PRs welcome — especially new checks, framework signals, and false
positive/negative reports against real agent codebases. See
[`src/checks.js`](./src/checks.js) for how checks are structured.

## License

MIT
