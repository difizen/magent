from typing import Any
from .executor import Executor
from .adapter_registry import adapter_registry


_current_executor = None


# Function to process any object using the registry
def process_object(obj: Any) -> Executor:
    global _current_executor
    executor = adapter_registry.get_adapter(obj)
    _current_executor = executor
    return executor


def get_current_executor():
    return _current_executor
