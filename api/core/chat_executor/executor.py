from typing import Any, AsyncIterator
from abc import ABC, abstractmethod
from langchain.schema.messages import BaseMessage, BaseMessageChunk
from pydantic import BaseModel


class ChatExecutor(BaseModel, ABC):
    name: str = "custom"
    order: int = 0

    @abstractmethod
    def run(
        self,
        value,
        **kwargs,
    ) -> BaseMessage | None:
        """Chat and get result."""

    @abstractmethod
    def astream(self, value, **kwargs) -> AsyncIterator[BaseMessageChunk] | None:
        """Stream chat and get result."""


class LLMChat(ChatExecutor):
    name: str = "custom"

    @abstractmethod
    def load(self, config: dict) -> bool:
        """Load LLM from Config Dict."""
