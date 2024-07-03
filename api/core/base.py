'''Base model'''
from typing import Any, List
from pydantic import BaseModel


class ModelMeta(BaseModel):
    '''LLM meta model '''
    key: str


class ConfigMeta(BaseModel):
    '''agent meta model'''
    persona: str
    model: ModelMeta
    tools: List[Any] = []
