from typing import List
from abc import ABC, abstractmethod
from pydantic import BaseModel
from typing import Callable

from .executor import ChatExecutor


class ChatObject(BaseModel):
    name: str = ""
    order: int = 0
    to_executor: Callable[[], ChatExecutor] | None = None

    @property
    def key(self):
        return self.name


class ChatObjectProvider(BaseModel, ABC):
    name: str = "custom"

    @abstractmethod
    def list(self) -> List[ChatObject]:
        """List chat executors."""
