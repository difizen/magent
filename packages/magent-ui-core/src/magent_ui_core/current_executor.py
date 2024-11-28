from typing import Any, Optional
from .base_adaptor import InvokeAdaptor
from .adaptor_registry import adaptor_registry


_current_invoke_adapator: InvokeAdaptor | None = None

# Function to process any object using the registry


def process_object(obj: Any, llm_type: str | None) -> InvokeAdaptor:
    global _current_invoke_adapator
    _current_invoke_adapator = adaptor_registry.get_invoke_adaptor(
        obj, llm_type)
    return _current_invoke_adapator


def get_current_invoke_adaptor():
    return _current_invoke_adapator
