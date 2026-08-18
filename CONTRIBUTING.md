# Contributing

This tool is intentionally small — that's the point. The easiest ways to
contribute:

## 1. Add a new check

Checks live in [`src/checks.js`](./src/checks.js) as plain objects:

```js
{
  id: "your-check-id",
  name: "Human-readable name",
  category: "Reliability | Cost | Safety | Quality | Operations",
  patterns: [/regex/, /patterns/i],
  why: "Why this matters in production.",
  fix: "The concrete fix.",
}
```

Ideas that would genuinely help: prompt injection defenses, secrets-in-prompt
detection, context-window overflow handling, PII redaction before logging.

## 2. Add a framework signal

If `ai-readiness-lint` isn't detecting your agent framework, add its import
signature to `AGENT_SIGNALS` in [`src/scanner.js`](./src/scanner.js). Please
include a link to a public repo using that framework in your PR description
so the signal can be verified.

## 3. Report false positives / negatives

Ran it on a real repo and a check passed when it shouldn't have (or vice
versa)? Open an issue with the repo (or a minimal snippet) and which check
was wrong. This is the highest-value feedback for improving accuracy.

## 4. Improve benchmark coverage

The "We scanned N open-source projects" table in the README should stay
current and honest. If you re-run it against updated versions of those repos
or want to propose adding another well-known project, open a PR with the
`--json` output attached.

## Development

```bash
git clone https://github.com/<you>/ai-readiness-lint.git
cd ai-readiness-lint
node bin/cli.js ./examples
```

No build step, no dependencies — it's plain Node.js. Please keep it that way
unless there's a strong reason not to; the zero-install `npx` experience is
core to what makes this useful.
