from datetime import datetime
from langchain_core.messages.base import BaseMessage

from pydantic import BaseModel, Field


class ConversationMessage(BaseModel):
    id: int
    sender: int
    sender_type: int
    conversation: int
    is_deleted: bool
    created_at: datetime
    message: BaseMessage
