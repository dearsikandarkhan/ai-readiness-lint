# Launch copy

Ready-to-paste posts for launching `ai-readiness-lint`. Swap in your GitHub
URL before posting. Post LinkedIn first (your core audience), then X, then
consider HN/Reddit once the repo has a few stars and the README benchmark
table is solid — cold-launching to HN with zero stars gets buried fast.

---

## LinkedIn (primary — your audience is here)

> I scanned 5 popular open-source AI agent projects for one thing: are they
> actually ready for production, or just good demos?
>
> Built a small open-source tool to check — `ai-readiness-lint`. It's a
> static linter that scans agent code (LangGraph, CrewAI, AutoGen, Bedrock
> AgentCore) for 8 production guardrails: error handling, cost/token limits,
> human-in-the-loop checkpoints, evaluation coverage, retries, timeouts,
> observability, and rate limiting. Outputs a Lighthouse-style score, 0-100.
>
> The results were more interesting than I expected:
>
> - AutoGPT: 100/100 (A)
> - Microsoft AutoGen: 88/100 (B)
> - CrewAI examples: 75/100 (B)
> - LangGraph's official quickstart template: 0/100 (F)
> - LangChain's react-agent template: 0/100 (F)
>
> The pattern makes sense once you think about it: mature, widely-deployed
> frameworks have accumulated guardrails from real production pain. Official
> quickstart templates are intentionally minimal — which is fine, until a
> team copies one straight into production and inherits zero guardrails
> without realizing it.
>
> This is basically the AI delivery governance work I do day to day (risk
> registers, production-readiness gates, UAT criteria) turned into a CLI you
> can run in 10 seconds: `npx ai-readiness-lint .`
>
> Open source, MIT licensed, would love feedback from anyone shipping agents
> to production: [GITHUB_URL]
>
> #AgenticAI #AIGovernance #LangGraph #OpenSource

---

## X / Twitter (shorter, punchier)

> Ran a "production-readiness" linter against 5 popular open-source AI agent
> repos.
>
> AutoGPT: 100/100
> AutoGen: 88/100
> CrewAI examples: 75/100
> LangGraph's official starter template: 0/100
> LangChain's react-agent template: 0/100
>
> Official quickstart templates are the least production-ready thing you can
> clone. Built the tool that checks this — open source, npx ai-readiness-lint
>
> [GITHUB_URL]

**Thread follow-up (optional, 2nd tweet):**

> It checks for 8 things: error handling, cost/token limits,
> human-in-the-loop gates on risky actions, eval coverage, retries,
> timeouts, tracing, rate limiting.
>
> Static analysis only — no API calls, free to run in CI. MIT licensed,
> PRs welcome for new checks.

---

## Hacker News (Show HN)

**Title:** Show HN: ai-readiness-lint – a production-readiness linter for AI agents

**Post body:**

> I kept seeing the same gap on AI delivery projects: teams could build an
> agent quickly, but had no repeatable way to check if it was actually ready
> to run in production — proper error handling, cost ceilings, a
> human-in-the-loop gate before risky actions, some eval coverage, retries,
> timeouts, tracing, rate limiting.
>
> Built a small static-analysis CLI that checks for exactly those 8 things
> in LangGraph/CrewAI/AutoGen/Bedrock AgentCore code and outputs a score
> (0-100, graded A-F), with evidence for what it found and a fix suggestion
> for what's missing. No API calls, no dependencies, runs in CI.
>
> Ran it against a few well-known open-source agent projects as a sanity
> check — mature frameworks (AutoGPT, AutoGen) scored well, but the official
> LangGraph and LangChain quickstart templates scored 0, which tracks: they're
> designed to be minimal for learning, not production-ready out of the box.
> Full numbers and methodology in the README.
>
> It's obviously a heuristic (regex-based, not semantic), so happy to hear
> where it's wrong. MIT licensed: [GITHUB_URL]

---

## Reddit (r/LangChain, r/LocalLLaMA, r/MachineLearning — adjust per sub's rules)

**Title:** I built a "production-readiness" linter for AI agents — ran it on AutoGPT, AutoGen, CrewAI, and LangGraph's official templates

**Post body:**

> Static-analysis CLI that scans agent code (LangGraph/CrewAI/AutoGen/Bedrock
> AgentCore) for 8 production guardrails — error handling, cost/token limits,
> human-in-the-loop gates, eval coverage, retries, timeouts, observability,
> rate limiting — and outputs a 0-100 score.
>
> Benchmarked it against a few well-known repos (numbers + methodology in the
> README, happy to be challenged on any of it):
>
> - AutoGPT: 100/100
> - AutoGen: 88/100
> - CrewAI examples: 75/100
> - LangGraph quickstart template: 0/100
> - react-agent template: 0/100
>
> Not knocking the templates — they're meant to be minimal. But if you've
> ever copied a "getting started" repo straight into a client project, this
> is the gap it doesn't warn you about.
>
> MIT licensed, no deps, `npx ai-readiness-lint .`: [GITHUB_URL]
>
> Genuinely want pushback — if a check is wrong or missing, open an issue.

---

## GitHub repo metadata (set these before sharing links)

**Description (used in search/social previews):**
> ESLint for AI agents — a static production-readiness linter for LangGraph, CrewAI, AutoGen & Bedrock AgentCore agents. Scores 0-100 with a Lighthouse-style report.

**Topics/tags to add:**
`ai-agents` `langgraph` `crewai` `autogen` `langchain` `ai-governance`
`static-analysis` `linter` `production-readiness` `agentic-ai` `llmops`
`developer-tools` `cli`

**Social preview image:** GitHub auto-generates one from the README's first
image if present — a screenshot of the colored terminal report (score +
category breakdown) makes a strong preview. Take one after your first real
`npx ai-readiness-lint .` run and drop it near the top of the README.
