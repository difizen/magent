from typing import Any, AsyncIterator, Iterator
from langchain_community.callbacks.manager import get_openai_callback
from langchain.llms.base import BaseLLM
from langchain_core.runnables import Runnable
from langchain.chains.base import Chain
from .executor import StreamExecutor


class LLMStreamExecutor(StreamExecutor):
    @staticmethod
    def recognizer(object):
        return isinstance(object, BaseLLM)

    def invoke(self, value) -> AsyncIterator[Any] | None:
        if not isinstance(self.object, BaseLLM):
            return None

        with get_openai_callback() as cb:
            result = self.object.astream(value)
            return result


class ChainStreamExecutor(StreamExecutor):
    @staticmethod
    def recognizer(object):
        return isinstance(object, Chain)

    def invoke(self, value) -> AsyncIterator[Any] | None:
        if not isinstance(self.object, Chain):
            return None
        with get_openai_callback() as cb:
            result = self.object.astream(value)
            return result


class RunnableStreamExecutor(StreamExecutor):
    @staticmethod
    def recognizer(object):
        return isinstance(object, Runnable)

    def invoke(self, value) -> AsyncIterator[Any] | None:
        if not isinstance(self.object, Runnable):
            return None

        with get_openai_callback() as cb:
            result = self.object.astream(value)
            return result
