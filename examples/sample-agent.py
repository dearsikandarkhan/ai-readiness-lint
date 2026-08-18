"""
Example agent for demoing ai-readiness-lint.
This file intentionally has SOME guardrails and is missing others,
so a scan against it produces a mixed (not perfect) score.
"""

import logging
from langgraph.graph import StateGraph

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("support_agent")


def retrieve_context(state):
    try:
        results = search_knowledge_base(state["query"])
    except ConnectionError:
        logger.error("knowledge base unavailable, using cached fallback")
        results = get_cached_results(state["query"])
    return {"context": results}


def classify_ticket(state):
    # NOTE: no max_tokens set here, and no eval harness exists for this step.
    response = call_llm(state["context"], max_tokens=500)
    return {"classification": response}


def route_ticket(state):
    if state["classification"] == "urgent_refund":
        # High-risk action with no human approval step — flagged by the linter.
        issue_refund(state["ticket_id"])
    return state


graph = StateGraph(dict)
graph.add_node("retrieve", retrieve_context)
graph.add_node("classify", classify_ticket)
graph.add_node("route", route_ticket)
graph.set_entry_point("retrieve")
