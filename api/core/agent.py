'''Agent'''
from typing import AsyncIterator, List
from abc import ABC, abstractmethod
from uuid import uuid4, UUID
from langchain.schema.messages import BaseMessage, BaseMessageChunk
from pydantic import BaseModel

from models.chat import MessageModel

from .base import ChatStreamChunk, ConfigMeta


class Agent(BaseModel, ABC):
    id: UUID = uuid4()
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
                       message: MessageModel,) -> AsyncIterator[BaseMessageChunk] | AsyncIterator[ChatStreamChunk] | None:
        """Chat with agent and get answer via stream"""
