from typing import Optional

from pydantic import BaseModel, Field


class Knowledge(BaseModel):
    id: str = Field(description="ID")
    nickname: Optional[str] = Field(description="knowledge nickname", default="")
    description: Optional[str] = Field(description="knowledge description", default="")
