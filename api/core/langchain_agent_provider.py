'''Langchain Agent Provider'''

from typing import AsyncIterator, List
from langchain_core.runnables import Runnable
from langchain.schema.messages import BaseMessage, BaseMessageChunk, SystemMessage, AIMessage, HumanMessage
from langchain.agents import create_tool_calling_agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.callbacks.manager import get_openai_callback
from langchain_community.chat_models.openai import ChatOpenAI

from core.api_tool import ApiTool
from db import get_session
from models.chat import MessageModel, MessageSenderType
from services.plugin import PluginAPIService

from .agent_provider import AgentProvider
from .agent import Agent
from .base import ConfigMeta


def to_message(msg: MessageModel) -> BaseMessage:
    if msg.sender_type == MessageSenderType.AI:
        return AIMessage(content=msg.content)
    if msg.sender_type == MessageSenderType.SYSTEM:
        return SystemMessage(content=msg.content)
    return HumanMessage(content=msg.content)


class ToolCallingAgent(Agent):
    def invoke(
        self,
        config: ConfigMeta,
        chat_id: int,
        history: List[MessageModel],
        message: MessageModel,
        **kwargs,
    ) -> BaseMessage | None:
        """Chat with agent"""
        llm = ChatOpenAI(model=config.model.key)
        api_id = config.plugins[0]['api']
        with get_session() as session:
            plugin_api_model = PluginAPIService.get_by_id(api_id, session)
            api_tool = ApiTool(plugin_api_model=plugin_api_model)
            print('api_tool_invoke', api_tool._invoke(
                {"search_query": "deep learning"}))
        tools = []
        system_msg = SystemMessage(content=config.persona)
        msgs = [to_message(m) for m in history]
        msgs.insert(0, system_msg)
        try:
            with get_openai_callback() as cb:
                result = llm.invoke(msgs)
                return result
        except Exception as e:
            return None

    def invoke_astream(self,
                       config: ConfigMeta,
                       chat_id: int,
                       history: List[MessageModel],
                       message: MessageModel,
                       **kwargs) -> AsyncIterator[BaseMessageChunk] | None:
        system_msg = SystemMessage(content=config.persona)
        *history_models, question_model = history
        msgs = [to_message(m) for m in history_models]
        llm = ChatOpenAI(model="gpt-3.5-turbo-0125", temperature=0)
        for plugin in config.plugins:
            print('plugin_agent', plugin)
        # b = [{'id': x['key']} for plugin in config.plugins]
        tools = []
        prompt = ChatPromptTemplate.from_messages([
            system_msg,
            *msgs,
            ("human", "{input}"),
            MessagesPlaceholder(
                variable_name="tools", optional=True),
            MessagesPlaceholder(
                variable_name="tool_names", optional=True),
            MessagesPlaceholder(
                variable_name="agent_scratchpad", optional=True),
        ])
        agent = create_tool_calling_agent(llm, tools, prompt)
        try:
            with get_openai_callback() as cb:
                result = agent.astream({"input": message.content})
                return result
        except Exception as e:
            return None


class LLMChat(Agent):
    '''LLM Chat'''

    # agent: Optional[Runnable] = None

    def create_llm_chat(self, model: str) -> Runnable:
        return ChatOpenAI(model=model)

    def create_rag_chain(self) -> Runnable:
        raise Exception('not implement')

    def create_tool_calling(self,
                            config: ConfigMeta,
                            history: List[MessageModel],
                            ) -> Runnable:
        system_msg = SystemMessage(content=config.persona)
        *history_models, question_model = history
        msgs = [to_message(m) for m in history_models]
        llm = ChatOpenAI(model="gpt-3.5-turbo-0125", temperature=0)
        tools = []
        prompt = ChatPromptTemplate.from_messages([
            system_msg,
            *msgs,
            ("human", "{input}"),
            MessagesPlaceholder(
                variable_name="tools", optional=True),
            MessagesPlaceholder(
                variable_name="tool_names", optional=True),
            MessagesPlaceholder(
                variable_name="agent_scratchpad", optional=True),
        ])
        return create_tool_calling_agent(llm, tools, prompt)

    def invoke(
        self,
        config: ConfigMeta,
        chat_id: int,
        history: List[MessageModel],
        message: MessageModel,
        **kwargs,
    ) -> BaseMessage | None:
        """Chat with agent"""
        llm = ChatOpenAI(model=config.model.key)
        system_msg = SystemMessage(content=config.persona)
        msgs = [to_message(m) for m in history]
        msgs.insert(0, system_msg)
        try:
            with get_openai_callback() as cb:
                result = llm.invoke(msgs)
                return result
        except Exception as e:
            return None

    def invoke_astream(self,
                       config: ConfigMeta,
                       chat_id: int,
                       history: List[MessageModel],
                       message: MessageModel,
                       **kwargs) -> AsyncIterator[BaseMessageChunk] | None:
        """Chat with agent and get answer via stream"""
        llm = ChatOpenAI(model=config.model.key)
        system_msg = SystemMessage(content=config.persona)
        msgs = [to_message(m) for m in history]
        msgs.insert(0, system_msg)
        try:
            with get_openai_callback() as cb:
                result = llm.astream(msgs)
                return result
        except Exception as e:
            return None


class LangchainAgentProvider(AgentProvider):
    '''Langchain Agent Provider'''
    name: str = "custom"

    def can_handle(self, config: ConfigMeta) -> int:
        '''Priority of provider for handling agent config'''
        if config.model.key == 'gpt-4':
            return 30
        if config.model.key == 'gpt-4o':
            return 30
        if config.model.key == 'gpt-3.5-turbo':
            return 30
        return -1

    def provide(self, config: ConfigMeta, chat_id: int) -> Agent:
        """get suitable agent"""
        if len(config.plugins) > 0:
            return ToolCallingAgent(meta=config)
        return LLMChat(meta=config)


langchain_agent_provider = LangchainAgentProvider()
