from abc import ABCMeta
from typing import Any, Callable, List, Tuple, Type
from .base_adaptor import InvokeAdaptor, InputAdaptor


class AdaptorRegistry:
    def __init__(self):
        self.invoke_adaptors: List[Tuple[int, Callable[[
            Any, str | None], bool], Type[InvokeAdaptor]]] = []

        self.input_adaptors: List[Tuple[int, Callable[[
            Any, str | None], bool], Type[InputAdaptor]]] = []

    def register_invoke_adaptor(self, recognizer: Callable[[Any, str | None], bool], adaptor_cls: Type[InvokeAdaptor], priority: int = 0, ):
        """
        Register a new adaptor with a priority and a recognizer function.
        """
        self.invoke_adaptors.append((priority, recognizer, adaptor_cls))
        # Sort adaptors by priority
        self.invoke_adaptors.sort(key=lambda x: x[0])

    def register_input_adaptor(self, recognizer: Callable[[Any, str | None], bool], adaptor_cls: Type[InputAdaptor], priority: int = 0, ):
        """
        Register a new adaptor with a priority and a recognizer function.
        """
        self.input_adaptors.append((priority, recognizer, adaptor_cls))
        self.input_adaptors.sort(key=lambda x: x[0])

    def register_adaptor(self, recognizer: Callable[[Any, str | None], bool], adaptor_cls: Type[InputAdaptor | InvokeAdaptor], priority: int = 0, ):
        """
        Register a new adaptor with a priority and a recognizer function.

        :param priority: The priority of the adaptor (lower numbers mean higher priority).
        :param recognizer: A function that returns True if the adaptor can handle the object.
        :param adaptor_cls: The adaptor class to use if the recognizer returns True.
        """

        if issubclass(adaptor_cls, InvokeAdaptor):
            self.invoke_adaptors.append((priority, recognizer, adaptor_cls))
            # Sort adaptors by priority
            self.invoke_adaptors.sort(key=lambda x: x[0], reverse=True)
        if issubclass(adaptor_cls, InputAdaptor):
            self.input_adaptors.append((priority, recognizer, adaptor_cls))
            self.input_adaptors.sort(key=lambda x: x[0], reverse=True)

    def get_invoke_adaptor(self, obj: Any, llm_type: str | None = None) -> InvokeAdaptor:
        """
        Get the appropriate adaptor for the given object based on registered recognizers.

        :param obj: The object to be processed.
        :return: An instance of the appropriate adaptor.
        """
        input_adaptor = self.get_input_adaptor(obj, llm_type)

        for _, recognizer, adaptor_cls in self.invoke_adaptors:
            if recognizer(obj, llm_type):
                return adaptor_cls(object=obj, input_adaptor=input_adaptor)
        raise ValueError(f"No suitable adaptor found for object: {obj}")

    def get_input_adaptor(self, obj: Any, llm_type: str | None = None) -> InputAdaptor:
        """
        Get the appropriate adaptor for the given object based on registered recognizers.

        :param obj: The object to be processed.
        :return: An instance of the appropriate adaptor.
        """
        for _, recognizer, adaptor_cls in self.input_adaptors:
            if recognizer(obj, llm_type):
                return adaptor_cls(object=obj)
        raise ValueError(f"No suitable adaptor found for object: {obj}")


adaptor_registry = AdaptorRegistry()
