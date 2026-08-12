from pydantic import BaseModel, Field
from typing import List

class SearchResult(BaseModel):
    query: str = Field(description="The search query")
    source: str = Field(description="The source used: 'wiki' or 'tavily'")

class ResearchReport(BaseModel):
    title: str = Field(description="Title of the research report")
    key_findings: List[str] = Field(description="List of 5 key findings")
    conclusion: str = Field(description="Final conclusion in 2-3 sentences")
    search_queries_used: List[SearchResult] = Field(description="List of search queries with their sources")