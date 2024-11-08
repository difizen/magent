from abc import ABC, abstractmethod
from typing import Any, AsyncIterator, Iterator

from pydantic import BaseModel


class Executor(BaseModel, ABC):
    name: str = "custom"
    object: Any

    @abstractmethod
    def invoke(self, value) -> Any | None:
        """Chat invoke"""
        raise NotImplementedError(
            "Each adapter must implement the `invoke` method.")


class StreamExecutor(Executor):
    @abstractmethod
    def invoke_stream(self, value) -> AsyncIterator[Any] | None:
        """Chat invoke"""
        raise NotImplementedError(
            "Each adapter must implement the `invoke` method.")
