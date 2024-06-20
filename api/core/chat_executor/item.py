from typing import List, Callable
from abc import ABC, abstractmethod
from pydantic import BaseModel

from .executor import ChatExecutor


class ChatObject(BaseModel):
    name: str = ""
    to_executor: Callable[[], ChatExecutor] | None = None

    @property
    def key(self):
        return "%s" % self.name


class ChatObjectProvider(BaseModel, ABC):
    name: str = ""

    @abstractmethod
    def list(self) -> List[ChatObject]:
        """List chat executors."""
