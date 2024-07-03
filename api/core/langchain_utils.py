from typing import List, Dict
import json
from langchain.schema.messages import BaseMessage
from langchain_core.prompt_values import StringPromptValue


def get_message_or_prompt_str(message: StringPromptValue | BaseMessage | List[BaseMessage]):
    if isinstance(message, list):
        # type: ignore
        return "\n".join(list(map(lambda m: message_content_to_str(m.content), message)))
    if isinstance(message, BaseMessage):
        return message.content
    return message.text


def message_content_to_str(content: str | Dict | List[str | Dict]) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, dict):
        return json.dumps(content)
    if isinstance(content, list):
        return "\n".join(list(map(lambda m: message_content_to_str(m), content)))


def get_message_str(msg: BaseMessage) -> str:
    return message_content_to_str(msg.content)
