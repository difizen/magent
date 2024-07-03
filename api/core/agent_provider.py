'''Agent Provider'''
from abc import ABC, abstractmethod
from pydantic import BaseModel

from .agent import Agent

from .base import ConfigMeta


class AgentProvider(BaseModel, ABC):
    '''Agent Provider'''
    name: str = "custom"

    def can_handle(self, config: ConfigMeta) -> int:
        '''Priority of provider for handling agent config'''
        return -1

    @abstractmethod
    def provide(self, config: ConfigMeta, chat_id: int) -> Agent:
        """List chat executors."""
