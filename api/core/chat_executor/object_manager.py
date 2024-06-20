import json
from typing import List, Dict
from pydantic import BaseModel
from .object import ChatObject, ChatObjectProvider
from .executor import ChatExecutor


class ChatObjectManager(BaseModel):
    providers: List[ChatObjectProvider] = []
    executors: Dict[str, ChatExecutor] = {}
    blocked_providers: List[str] = []
    blocked_executors: List[str] = []

    def register_provider(self, provider: ChatObjectProvider):
        if provider.name in self.providers:
            print(f"Provider {provider.name} already exists")
            return
        if isinstance(provider, ChatObjectProvider) == False:
            raise TypeError("provider must be ChatObjectProvider")
        if provider.name in map(lambda x: x.name, self.providers):
            print(f"Provider {provider.name} already exists")
            return
        self.providers.append(provider)

    def is_provider_blocked(self, provider: ChatObjectProvider) -> bool:
        return provider.name in self.blocked_providers

    def is_object_blocked(self, object: ChatObject) -> bool:
        return object.key in self.blocked_executors

    def get_executor(self, key: str) -> ChatExecutor:
        if key in self.executors:
            return self.executors[key]
        dict = self.get_object_dict()
        if key in dict:
            object = dict.get(key)
            if object and not self.is_object_blocked(object) and object.to_executor is not None:
                executor = object.to_executor()
                self.executors[key] = executor
                return executor
        raise Exception(f"Executor {key} not found")

    def get_object_dict(self) -> Dict[str, ChatObject]:
        chat_objects: Dict[str, ChatObject] = {}
        for provider in self.providers:
            if self.is_provider_blocked(provider):
                continue
            for item in provider.list():
                key = item.key
                exists = chat_objects.get(key)
                if exists:
                    if exists.order > item.order:
                        continue
                chat_objects[key] = item
        return chat_objects

    def get_object_list(self) -> List[ChatObject]:
        """List chat items."""
        list = sorted(self.get_object_dict().values(), key=lambda x: x.order)
        return list

    def dump_list_json(self) -> str:
        """List chat items."""
        list = self.get_object_list()
        return json.dumps([item.model_dump() for item in list])
