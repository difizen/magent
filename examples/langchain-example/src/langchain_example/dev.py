from langchain_openai import ChatOpenAI
from magent_ui_langchain import launch

llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)


launch(llm)
