from typing import List
from pydantic import BaseModel


class BaseOutputMessage(BaseModel):
    id: str
    output: str


class BaseEvent(BaseModel):
    type: str
    id: str
    data: str | BaseModel


class ChunkEvent(BaseEvent):
    type: str = 'chunk'
    id: str
    data: str | BaseOutputMessage


class ResultEvent(BaseEvent):
    type: str = 'result'
    id: str
    data: str | BaseOutputMessage


class ErrorMessage(BaseModel):
    error_message: str


class ErrorEvent(BaseEvent):
    type: str = 'error'
    id: str
    data: str | ErrorMessage


class ActionMessage(BaseModel):
    name: str
    arguments: List[str] | None


class ActionEvent(BaseEvent):
    type: str = 'action'
    id: str
    data: str | ErrorMessage
