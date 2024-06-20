from typing import List
from langchain.schema.messages import BaseMessage
from langchain_core.prompt_values import StringPromptValue


def get_message_str(message: StringPromptValue | BaseMessage | List[BaseMessage]):
    if isinstance(message, list):
        return "\n".join(list(map(lambda m: m.content, message)))  # type: ignore
    if isinstance(message, BaseMessage):
        return message.content
    return message.text
