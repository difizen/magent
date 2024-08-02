from typing import Optional

from pydantic import BaseModel, Field


class Prompt(BaseModel):
    introduction: Optional[str] = Field(description="prompt introduction", default="")
    target: Optional[str] = Field(description="prompt target", default="")
    instruction: Optional[str] = Field(description="prompt instruction", default="")
