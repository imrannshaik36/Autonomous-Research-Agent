import urllib.request
import urllib.parse
import json
from langchain_tavily import TavilySearch
from langchain_core.tools import tool

# Base Tavily Search client instance
tavily_instance = TavilySearch(max_results=3)

@tool
def search_live_web(query: str) -> str:
    """
    Search the live web for current news, latest 2026 technical updates, recent breakthroughs, and dynamic industry data.
    Use this tool when you need real-time data or recent market/tech developments.
    """
    try:
        return str(tavily_instance.invoke({"query": query}))
    except Exception as e:
        return f"Live web search error for '{query}': {str(e)}"

@tool
def get_wikipedia_summary(query: str) -> str:
    """
    Search Wikipedia for foundational domain concepts, historical background, core scientific definitions, and established encyclopedic knowledge.
    Use this tool when you need fundamental definitions or background theory on a topic.
    """
    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(query.strip())}"
        req = urllib.request.Request(url, headers={'User-Agent': 'AutonomousResearchAgent/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            extract = data.get('extract')
            if extract:
                return extract
            return f"No direct Wikipedia article summary found for '{query}'."
    except Exception as e:
        return f"Wikipedia search lookup error for '{query}': {str(e)}"

def get_tools():
    return [search_live_web, get_wikipedia_summary]