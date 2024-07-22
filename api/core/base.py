'''Base model'''
from enum import Enum
from typing import Any, List, Optional
from pydantic import BaseModel


class ModelMeta(BaseModel):
    '''LLM meta model '''
    key: str


class ConfigMeta(BaseModel):
    '''agent meta model'''
    persona: str
    model: ModelMeta
    plugins: List[Any] = []


class SSEType(Enum):
    MESSAGE = "message"
    BLANK_MESSAGE = "blank_message"
    CHUNK = "chunk"
    ERROR = "error"
    EOF = "EOF"
    RESULT = "result"


class ChatStreamChunk(BaseModel):
    type: SSEType
    chunk: Optional[str] = None
    content: Optional[str] = None
    error_msg: Optional[str] = None
