from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, ToolMessage
from tools import get_tools
from prompts import get_system_prompt
from output import ResearchReport
import os

def run_agent(topic: str) -> ResearchReport:
    llm = ChatGroq(model="llama-3.1-8b-instant")
    tools = get_tools()
    llm_with_tools = llm.bind_tools(tools)
    structured_llm = llm.with_structured_output(ResearchReport)

    messages = [get_system_prompt(), HumanMessage(f"Research this topic thoroughly: {topic}")]

    response = llm_with_tools.invoke(messages)
    messages.append(response)

    all_results = []
    i = 1
    max_searches = 3
    search_count = 0

    while response.tool_calls and search_count < max_searches:
        for tool_call in response.tool_calls:
            tool_result = tools[0].invoke(tool_call["args"])
            trimmed = str(tool_result)[:500]
            all_results.append(trimmed)
            messages.append(ToolMessage(content=trimmed, tool_call_id=tool_call["id"]))
            search_count += 1
        i += 1
        response = llm_with_tools.invoke(messages)
        messages.append(response)

    summary_prompt = f"""Based on these research findings, write a detailed report on: {topic}

FINDINGS:
{chr(10).join(all_results)}

Also list the search queries that were used during research."""

    final = structured_llm.invoke([HumanMessage(summary_prompt)])
    return final