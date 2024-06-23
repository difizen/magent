
from .object_manager import ChatObjectManager
from .openai import OpenAIChatObjectProvider


chat_object_manager = ChatObjectManager()
chat_object_manager.register_provider(OpenAIChatObjectProvider())
