from typing import Any, AsyncIterator
from langchain_community.callbacks.manager import get_openai_callback
from langchain_core.runnables import Runnable, RunnableBinding
from langchain.agents.agent import AgentExecutor
from langchain.chains.llm import LLMChain
from langchain.agents.mrkl.base import ZeroShotAgent
from .event import BaseEvent
from .langchain_adaptor import RunnableAdaptor
from .utils import is_community_installed, is_in_array_or_has_prefix, attempt_import


openai_models = [
    "gpt-4o",
    "gpt-4",
    "gpt-3.5",
    "text-ada-001",
    "ada",
    "text-babbage-001",
    "babbage",
    "text-curie-001",
    "curie",
    "davinci",
    "text-davinci-003",
    "text-davinci-002",
    "code-davinci-002",
    "code-davinci-001",
    "code-cushman-002",
    "code-cushman-001",
]


def is_langchain_openai_installed():
    return attempt_import('langchain_openai') is not None


class OpenAIAdaptor(RunnableAdaptor):
    @staticmethod
    def recognizer(object, llm_type: str | None = None):
        if isinstance(object, ZeroShotAgent):
            return OpenAIAdaptor.recognizer(object.llm_chain)

        if not isinstance(object, Runnable):
            return False
        if llm_type == 'openai':
            return True
        if isinstance(object, RunnableBinding):
            return OpenAIAdaptor.recognizer(object.bound)

        if isinstance(object, LLMChain):
            return OpenAIAdaptor.recognizer(object.llm)

        if isinstance(object, AgentExecutor):
            return OpenAIAdaptor.recognizer(object.agent)

        if is_community_installed():
            from langchain_community.llms.openai import OpenAIChat
            if isinstance(object, OpenAIChat):
                return is_in_array_or_has_prefix(openai_models, object.model_name)
        if is_langchain_openai_installed():
            from langchain_openai import ChatOpenAI
            if isinstance(object, ChatOpenAI):
                return is_in_array_or_has_prefix(openai_models, object.model_name)
        return False

    def invoke(self, value, image=None) -> Any | None:
        with get_openai_callback() as cb:
            return super().invoke(value, image)

    def invoke_stream(self, value, image=None) -> AsyncIterator[BaseEvent] | None:
        with get_openai_callback() as cb:
            return super().invoke_stream(value, image)
