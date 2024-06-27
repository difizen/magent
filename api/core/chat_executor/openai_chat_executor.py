from typing import AsyncIterator, Optional
from pydantic import Field
from langchain_openai.chat_models import ChatOpenAI

from langchain.schema.messages import BaseMessage, BaseMessageChunk
from langchain_community.callbacks.manager import get_openai_callback

from .executor import LLMChat


class OpenAIChat(LLMChat):
    name: str = "chatgpt"
    model: str = Field(default="gpt-4")
    chat: Optional[ChatOpenAI] = None

    def load(self, config: dict = {}):
        self.chat = ChatOpenAI(model=self.model)
        return True

    def run(self, value, **kwargs) -> BaseMessage | None:
        if not self.chat:
            self.load()
        try:
            if not self.chat:
                raise Exception("Chat model not loaded")
            chat = self.chat
            with get_openai_callback() as cb:
                result = chat.invoke(value, **kwargs)
                return result
        except Exception as e:
            return None

    def astream(self, value, **kwargs) -> AsyncIterator[BaseMessageChunk] | None:
        if not self.chat:
            self.load()
        try:
            if not self.chat:
                raise Exception("Chat model not loaded")
            chat = self.chat
            with get_openai_callback() as cb:
                result = chat.astream(value, **kwargs)
                return result
        except Exception as e:
            return None
