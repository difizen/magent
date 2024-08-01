from typing import Optional

from pydantic import BaseModel, Field


class Planner(BaseModel):
    id: str = Field(description="ID")
    nickname: Optional[str] = Field(description="planner nickname", default="")
