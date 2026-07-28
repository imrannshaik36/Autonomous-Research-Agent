from agent import run_agent
import os

os.environ["GROQ_API_KEY"] = "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"
os.environ["TAVILY_API_KEY"] = "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"

topic = input("Enter research topic: ")
report = run_agent(topic)

print("\n" + "="*50)
print("TITLE:", report.title)
print("\nKEY FINDINGS:")
for i, f in enumerate(report.key_findings, 1):
    print(f"{i}. {f}")
print("\nCONCLUSION:", report.conclusion)
print("\nSEARCHES USED:", report.search_queries_used)