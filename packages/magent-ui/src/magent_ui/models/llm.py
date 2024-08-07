from typing import Optional, List

from pydantic import BaseModel, Field


class Llm(BaseModel):
    id: str = Field(description="ID")
    nickname: Optional[str] = Field(description="llm nickname", default="")
    temperature: Optional[float] = Field(description="llm temperature", default=None)
    model_name: Optional[List[str]] = Field(description="llm model name list", default=[])
