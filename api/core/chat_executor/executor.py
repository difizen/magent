from typing import Any
from abc import ABC, abstractmethod
from langchain.schema.messages import BaseMessage
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


class LLMChat(ChatExecutor):
    name: str = "custom"

    @abstractmethod
    def load(self, config: dict) -> bool:
        """Load LLM from Config Dict."""