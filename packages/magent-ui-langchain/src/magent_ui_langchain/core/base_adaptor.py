from abc import ABC, abstractmethod
from typing import Any, AsyncIterator
from .event import BaseEvent

from pydantic import BaseModel


class InputAdaptor(BaseModel):
    '''
    A class to format the input message
    '''
    object: Any
    llm_type: str | None = None

    def to_input_message(self, value, *args, **kwargs):
        return value


class InvokeAdaptor(BaseModel, ABC):
    name: str = "custom"
    llm_type: str | None = None
    object: Any
    input_adaptor: InputAdaptor | None = None

    @abstractmethod
    def invoke(self, value, *args, **kwargs) -> Any | None:
        """Chat invoke"""
        raise NotImplementedError(
            "Each adaptor must implement the `invoke` method.")


class StreamInvokeAdaptor(InvokeAdaptor):
    @abstractmethod
    def invoke_stream(self, value, *args, **kwargs) -> AsyncIterator[BaseEvent] | None:
        """Chat invoke"""
        raise NotImplementedError(
            "Each adaptor must implement the `invoke` method.")


# class OutputAdaptor(BaseModel):
#     '''
#     A class to format the output message
#     '''
#     object: Any
#     llm_type: str | None = None

#     def to_output_message(self, value, *args, **kwargs):
#         return value

#     def to_output_event(self, value, *args, **kwargs):
#         return value
