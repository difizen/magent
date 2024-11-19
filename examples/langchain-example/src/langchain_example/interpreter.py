from langchain_openai import ChatOpenAI
from magent_ui_langchain import launch
from langchain_core.tools import tool
from langchain_core.output_parsers import PydanticToolsParser
from pydantic import BaseModel, Field
from langchain.agents import initialize_agent
from langchain.agents import AgentType
import sys


sys.path.append(
    "/Users/brokun/github/libro-code-interpreter/libro-client/src")
sys.path.append(
    "/Users/brokun/github/libro-code-interpreter/libro-code-interpreter/src")


@tool
def ipython_executor(code: str):
    """A Python code executor. Use this to execute python commands. Input should be a valid python command.

    Args:
        code: python code
    """
    print(code)
    from libro_code_interpreter import execute_ipython
    return execute_ipython(code)


llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)


class IPythonExecutor(BaseModel):
    """A Python code executor. Use this to execute python commands. Input should be a valid python command."""

    code: str = Field(..., description="Python code")

    # def __init__(self, code: str):
    #     self.code = code
    #     print('IPythonExecutor', code)


llm_with_tools = llm.bind_tools(
    [IPythonExecutor])

tools = [ipython_executor]

agent = initialize_agent(
    tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)


chain = llm_with_tools | PydanticToolsParser(tools=[IPythonExecutor])

launch(agent)
