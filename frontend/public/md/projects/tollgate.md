# Tollgate

By [Yaduraj Singh](/about).

Cost & usage observability for LLM APIs. Reverse proxy for OpenAI, Anthropic and OpenAI-compatible providers — one base URL for per-feature cost, caching, budgets and runaway-agent alerts.

## Problem

LLM spend is invisible until the invoice arrives. There is no per-feature breakdown, no cache between identical calls, and nothing standing between a looping agent and an overnight surprise bill.

## Engineering approach

- Point one base_url at Tollgate — OpenAI, Anthropic, xAI, OpenRouter, Gemini and more. No SDK rewrite.
- Per-feature (tag) spend visibility, so cost is attributed to the feature that caused it.
- Exact-match prompt caching, so identical calls stop being paid for twice.
- Hard budgets plus runaway-agent alerts and guards — stop burn before it becomes a bill.

## Technical decisions

- OpenAI-compatible surface over a client library — adopting it is a base URL change, not a migration.
- Proxy rather than SDK wrapper, so every language and framework is covered at once.
- Budgets enforced at the gateway — a guard the calling code cannot forget to apply.

## Technology stack

OpenAI API, Anthropic API, OpenRouter, Vercel

## Links

[Project website](https://tollgate.yaduraj.me/)



[All projects](/projects) · [Contact Yaduraj Singh](/contact)
