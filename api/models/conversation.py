import enum
from typing import List
from pydantic import BaseModel
from datetime import datetime

from sqlalchemy import (
    ForeignKey,
    Column,
    Integer,
    String,
    DateTime,
    Text,
    Boolean,
    Enum
)
from sqlalchemy.orm import relationship

from db import Base


class ConversationORM(Base):
    __tablename__ = 'conversations'

    id = Column(Integer, primary_key=True, autoincrement=True)
    bot_id = Column(Integer, ForeignKey(
        'agent_bots.id'), nullable=False)
    bot_config_id = Column(Integer, ForeignKey(
        'agent_configs.id'), nullable=False)
    created_by = Column(Integer)
    created_at = Column(DateTime(), default=datetime.now(), nullable=False)
    updated_at = Column(DateTime(), default=datetime.now(),
                        onupdate=datetime.now(), nullable=False)

    messages = relationship(
        'MessageORM', back_populates='conversation')


class MessageSenderType(enum.Enum):
    AI = "ai"
    HUMAN = "human"
    SYSTEM = "system"


class MessageType(enum.Enum):
    MARKDOWN = "markdown"


class MessageORM(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(Integer, ForeignKey(
        'conversations.id'), nullable=False)
    sender_type = Column(Enum(MessageSenderType), nullable=False)
    sender_id = Column(Integer, nullable=False)
    message_type = Column(
        String(50), default=MessageType.MARKDOWN, nullable=False)
    content = Column(Text, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(), default=datetime.now(), nullable=False)
    conversation = relationship('ConversationORM', back_populates='messages')


class MessageModel(BaseModel):
    id: int
    sender: int
    sender_type: MessageSenderType
    conversation_id: int
    is_deleted: bool
    created_at: datetime
    content: str


class ConversationModel(BaseModel):
    messages: List[MessageModel] = []
    created_by: int

    def append_messages(
        self,
        messages: List[MessageModel],
    ):

        for m in messages:
            self.append_message(m)

    def append_message(
        self,
        msg: MessageModel
    ):
        self.messages.append(msg)
