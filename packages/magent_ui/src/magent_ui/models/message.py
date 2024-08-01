from typing import Optional

from pydantic import BaseModel, Field


class Message(BaseModel):
    id: str = Field(description="ID")
    session_id: str = Field(description="Session ID")
    content: Optional[str] = Field(description="message content", default="")
    gmt_created: Optional[str] = Field(description="message create time")
    gmt_modified: Optional[str] = Field(description="message update time")
