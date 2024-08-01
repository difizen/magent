from typing import Optional
from pydantic import BaseModel, Field
from magent_ui.models.llm import Llm
from magent_ui.models.prompt import Prompt
from magent_ui.models.planner import Planner
from magent_ui.models.knowledge import Knowledge
from magent_ui.models.tool import Tool

class Agent(BaseModel):
    id: str = Field(description="ID")
    nickname: Optional[str] = Field(description="agent nickname", default="")
    avatar: Optional[str] = Field(description="agent avatar path", default="")
    description: Optional[str] = Field(description="agent description", default="")
    opening_speech: Optional[str] = Field(description="agent opening speech", default="")
    prompt: Optional[Prompt] = Field(description="agent prompt", default=None)
    llm: Optional[Llm] = Field(description="agent llm", default=None)
    tool: Optional[list[Tool]] = Field(description="agent tool list", default=[])
    memory: Optional[str] = Field(description="agent memory id", default='')
    planner: Optional[Planner] = Field(description="agent planner", default=None)
    knowledge: Optional[list[Knowledge]] = Field(description="agent knowledge list", default=[])
