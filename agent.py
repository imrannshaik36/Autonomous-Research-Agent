from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, ToolMessage
from tools import get_tools
from prompts import get_system_prompt
from output import ResearchReport, SearchResult
import os

def run_agent(topic: str) -> ResearchReport:
    llm = ChatGroq(model="llama-3.1-8b-instant")
    tools = get_tools()
    tool_map = {t.name: t for t in tools}
    llm_with_tools = llm.bind_tools(tools)
    structured_llm = llm.with_structured_output(ResearchReport)

    messages = [get_system_prompt(), HumanMessage(f"Research this topic thoroughly: {topic}")]

    response = llm_with_tools.invoke(messages)
    messages.append(response)

    all_results = []
    search_sources = []  # Track which source was used for each query
    max_searches = 3
    search_count = 0

    while response.tool_calls and search_count < max_searches:
        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            query = tool_call["args"].get("query", "")
            tool_to_use = tool_map.get(tool_name, tools[0])
            tool_result = tool_to_use.invoke(tool_call["args"])
            trimmed = str(tool_result)[:500]
            
            # Determine the source
            source = "tavily" if tool_name == "search_live_web" else "wiki"
            all_results.append(f"[{tool_name}]: {trimmed}")
            search_sources.append({"query": query, "source": source})
            
            messages.append(ToolMessage(content=trimmed, tool_call_id=tool_call["id"]))
            search_count += 1
        response = llm_with_tools.invoke(messages)
        messages.append(response)

    summary_prompt = f"""Based on these multi-tool research findings, write a detailed report on: {topic}

FINDINGS & SOURCES:
{chr(10).join(all_results)}

Also list the search queries or tools used during research."""

    final = structured_llm.invoke([HumanMessage(summary_prompt)])
    
    # Convert search_sources dicts to SearchResult objects
    final.search_queries_used = [SearchResult(**s) for s in search_sources]
    
    return final