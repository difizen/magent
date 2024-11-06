from abc import ABCMeta
from typing import Any, Callable, List, Tuple, Type
from .executor import Executor


class AdapterRegistry:
    def __init__(self):
        self.adapters: List[Tuple[int, Callable[[
            Any], bool], Type[Executor]]] = []

    def register_adapter(self, recognizer: Callable[[Any], bool], adapter_cls: Type[Executor], priority: int = 0, ):
        """
        Register a new adapter with a priority and a recognizer function.

        :param priority: The priority of the adapter (lower numbers mean higher priority).
        :param recognizer: A function that returns True if the adapter can handle the object.
        :param adapter_cls: The adapter class to use if the recognizer returns True.
        """
        self.adapters.append((priority, recognizer, adapter_cls))
        # Sort adapters by priority
        self.adapters.sort(key=lambda x: x[0])

    def get_adapter(self, obj: Any) -> Executor:
        """
        Get the appropriate adapter for the given object based on registered recognizers.

        :param obj: The object to be processed.
        :return: An instance of the appropriate adapter.
        """
        for _, recognizer, adapter_cls in self.adapters:
            if recognizer(obj):
                return adapter_cls(object=obj)
        raise ValueError(f"No suitable adapter found for object: {obj}")


adapter_registry = AdapterRegistry()
