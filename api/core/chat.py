from typing import List

from langchain.schema.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage
from pydantic import BaseModel
from models.agent_config import AgentConfigModel
from models.chat import MessageModel, MessageSenderType
from .chat_executor import chat_object_manager


class ModelMeta(BaseModel):
    key: str


class ConfigMeta(BaseModel):
    persona: str
    model: ModelMeta


def get_config_meta(agent_config: AgentConfigModel) -> ConfigMeta:
    if agent_config.config is None:
        raise Exception('cannot get config meta')
    return ConfigMeta.model_validate(agent_config.config)


def to_message(msg: MessageModel) -> BaseMessage:
    if msg.sender_type == MessageSenderType.AI:
        return AIMessage(content=msg.content)
    if msg.sender_type == MessageSenderType.SYSTEM:
        return SystemMessage(content=msg.content)
    return HumanMessage(content=msg.content)


def chat(agent_config: AgentConfigModel, chat_id: int, history: List[MessageModel], message: MessageModel):
    config = get_config_meta(agent_config)
    system_msg = SystemMessage(content=config.persona)
    msgs = [to_message(m) for m in history]
    msgs.insert(0, system_msg)
    executor = chat_object_manager.get_executor(config.model.key)
    answer = executor.run(msgs)
    return answer
