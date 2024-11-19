from typing import Any, AsyncIterator
from langchain_community.callbacks.manager import get_openai_callback
from langchain_core.runnables import Runnable, RunnableBinding
from .event import BaseEvent
from .langchain_adaptor import RunnableAdaptor
from .utils import is_community_installed, is_in_array_or_has_prefix


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


class OpenAIAdaptor(RunnableAdaptor):
    @staticmethod
    def recognizer(object, llm_type: str | None = None):
        if not isinstance(object, Runnable):
            return False
        if llm_type == 'openai':
            return True
        if isinstance(object, RunnableBinding):
            return OpenAIAdaptor.recognizer(object.bound)
        if not is_community_installed():
            return False
        from langchain_community.chat_models.openai import ChatOpenAI
        if isinstance(object, ChatOpenAI):
            return is_in_array_or_has_prefix(openai_models, object.model_name)
        return False

    def invoke(self, value, image=None) -> Any | None:
        with get_openai_callback() as cb:
            return super().invoke(value, image)

    def invoke_stream(self, value, image=None) -> AsyncIterator[BaseEvent] | None:
        with get_openai_callback() as cb:
            return super().invoke_stream(value, image)
