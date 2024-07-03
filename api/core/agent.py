'''Agent'''
from typing import AsyncIterator, List
from abc import ABC, abstractmethod
from langchain.schema.messages import BaseMessage, BaseMessageChunk
from pydantic import BaseModel

from models.chat import MessageModel

from .base import ConfigMeta


class Agent(BaseModel, ABC):
    meta: ConfigMeta

    '''Abstract agent'''
    @abstractmethod
    def invoke(
        self,
        config: ConfigMeta,
        chat_id: int,
        history: List[MessageModel],
        message: MessageModel,
    ) -> BaseMessage | None:
        """Chat with agent"""

    @abstractmethod
    def invoke_astream(self,
                       config: ConfigMeta,
                       chat_id: int,
                       history: List[MessageModel],
                       message: MessageModel,) -> AsyncIterator[BaseMessageChunk] | None:
        """Chat with agent and get answer via stream"""
