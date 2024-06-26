import enum
import uuid
from typing import List, Optional
from pydantic import UUID4, BaseModel
from datetime import datetime

from sqlalchemy import (
    ForeignKey,
    Column,
    Integer,
    DateTime,
    Text,
    Boolean,
    UUID,
    Enum
)
from sqlalchemy.orm import relationship

from db import Base


class ChatORM(Base):
    __tablename__ = 'chats'

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
        'MessageORM', back_populates='chat')


class MessageSenderType(enum.Enum):
    AI = "ai"
    HUMAN = "human"
    SYSTEM = "system"


class MessageType(enum.Enum):
    MARKDOWN = "markdown"
    TEXT = "text"


class MessageORM(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, autoincrement=True)
    chat_id = Column(Integer, ForeignKey(
        'chats.id', ondelete="CASCADE"), nullable=False)
    sender_type = Column(Enum(MessageSenderType), nullable=False)
    sender_id = Column(Integer, nullable=False)
    chat_trun_id = Column(UUID, nullable=False)
    message_type = Column(Enum(MessageType), nullable=False)
    content = Column(Text, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(), default=datetime.now(), nullable=False)
    chat = relationship('ChatORM', back_populates='messages')


class MessageModelCreate(BaseModel):
    sender_id: int
    sender_type: MessageSenderType = MessageSenderType.HUMAN
    message_type: MessageType = MessageType.MARKDOWN
    chat_turn_id: Optional[UUID4] = None
    chat_id: int
    content: str


class MessageModel(MessageModelCreate):
    id: int
    is_deleted: bool = False
    chat_turn_id: UUID4 = uuid.uuid4()
    created_at: datetime = datetime.now()

    class Config:
        from_attributes = True


class ChatModel(BaseModel):
    messages: List[MessageModel] = []
    bot_id: int
    bot_config_id: int
    created_by: int
    created_at: datetime = datetime.now()

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

    class Config:
        from_attributes = True
