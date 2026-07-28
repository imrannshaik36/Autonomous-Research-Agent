from langchain_tavily import TavilySearch

def get_tools():
    search_tool = TavilySearch(max_results=3)
    return [search_tool]