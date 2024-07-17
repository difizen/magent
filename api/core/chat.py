from typing import List

from langchain.schema.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage
from models.agent_config import AgentConfigModel
from models.chat import MessageModel, MessageSenderType
from .agent_manager import agent_manager
from .base import ConfigMeta

from .langchain_agent_provider import langchain_agent_provider
from .au_agent_provider import au_agent_provider

agent_manager.registe_provider(langchain_agent_provider)
agent_manager.registe_provider(au_agent_provider)


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
    provider = agent_manager.get_provider(config)
    agent = provider.provide(config, chat_id)
    answer = agent.invoke(config, chat_id, history, message)
    return answer


def chat_stream(agent_config: AgentConfigModel, chat_id: int, history: List[MessageModel], message: MessageModel):
    config = get_config_meta(agent_config)
    system_msg = SystemMessage(content=config.persona)
    msgs = [to_message(m) for m in history]
    msgs.insert(0, system_msg)
    provider = agent_manager.get_provider(config)
    agent = provider.provide(config, chat_id)
    answer = agent.invoke_astream(config, chat_id, history, message)
    return answer
