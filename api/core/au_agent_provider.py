'''Langchain Agent Provider'''

from typing import AsyncIterator, List
from langchain.schema.messages import BaseMessage, BaseMessageChunk, SystemMessage, AIMessage, HumanMessage
from langchain.prompts import ChatPromptTemplate

from models.chat import MessageModel, MessageSenderType

from .agent_provider import AgentProvider
from .agent import Agent
from .base import ConfigMeta


from agentuniverse.agent.agent import Agent as AUAgent
from agentuniverse.base.component.component_configer_util import ComponentConfigerUtil
from agentuniverse.base.config.configer import Configer
from agentuniverse.base.config.component_configer.component_configer import (
    ComponentConfiger,
)
from agentuniverse.base.config.component_configer.configers.agent_configer import AgentConfiger
from agentuniverse.base.component.component_enum import ComponentEnum
from agentuniverse.agent.agent_manager import AgentManager
from agentuniverse.agent.output_object import OutputObject
from agentuniverse.base.agentuniverse import AgentUniverse
from agentuniverse.agent.input_object import InputObject
from .task import RequestTask


class DefaultRagAgent(AUAgent):
    def input_keys(self) -> list[str]:
        return ["input"]

    def output_keys(self) -> list[str]:
        return ["output"]

    def parse_input(self, input_object: InputObject, agent_input: dict) -> dict:
        agent_input["input"] = input_object.get_data("input")
        return agent_input

    def parse_result(self, planner_result: dict) -> dict:
        return planner_result


def au_agent_config(chat_id: int, meta: ConfigMeta):
    return {
        "info": {"name": "{}_agent".format(chat_id), "description": ""},
        "profile": {
            "introduction": meta.persona,
            "target": meta.persona,
            "instruction": meta.persona,
            "llm_model": {"name": "default_openai_llm", "model_name": meta.model.key},
        },
        "plan": {"planner": {"name": "rag_planner"}},
        "action": {"tool": ["google_search_tool"]},
        "metadata": {
            "type": "AGENT",
            "module": "magent_test",
            "class": "DefaultRagAgent",
        },
    }


class InMemoryConfiger(Configer):
    def __init__(self, path: str, config: dict = {}):
        super().__init__(path=path)
        """Initialize the ConfigManager
        Args:
            path(str): the path of the configuration file
        Returns:
            None
        """
        self.value = config


class AsyncGeneratorWrapper:
    def __init__(self, generator):
        self._generator = generator

    def __aiter__(self):
        return self

    async def __anext__(self):
        try:
            return next(self._generator)
        except StopIteration:
            raise StopAsyncIteration


def to_message(msg: MessageModel) -> BaseMessage:
    if msg.sender_type == MessageSenderType.AI:
        return AIMessage(content=msg.content)
    if msg.sender_type == MessageSenderType.SYSTEM:
        return SystemMessage(content=msg.content)
    return HumanMessage(content=msg.content)


class RagAgent(Agent):
    """
    Test cases for the rag agent
    """
    chat_id: int

    def setUp(self) -> None:
        configer = InMemoryConfiger(
            config=au_agent_config(self.chat_id, self.meta), path=str(self.id))
        component_manager_clz = ComponentConfigerUtil.get_component_manager_clz_by_type(
            ComponentEnum.AGENT
        )
        configer_clz = ComponentConfigerUtil.get_component_config_clz_by_type(
            ComponentEnum.AGENT
        )
        component_configer = ComponentConfiger().load_by_configer(configer)
        if component_configer.configer is not None:
            configer_instance = configer_clz().load_by_configer(
                component_configer.configer
            )
            if isinstance(configer_instance, AgentConfiger):
                component_instance = DefaultRagAgent().initialize_by_component_configer(  # type: ignore
                    configer_instance
                )
                component_manager_clz().register(
                    component_instance.get_instance_code(), component_instance
                )

    def run(self, agent_name: str, **kwargs):
        """execution"""
        instance: DefaultRagAgent = AgentManager().get_instance_obj(agent_name)
        return instance.run(**kwargs)

    def invoke(
        self,
        config: ConfigMeta,
        chat_id: int,
        history: List[MessageModel],
        message: MessageModel,
        **kwargs,
    ) -> BaseMessage | None:
        raise Exception('not implement')

    def invoke_astream(self,
                       config: ConfigMeta,
                       chat_id: int,
                       history: List[MessageModel],
                       message: MessageModel,
                       **kwargs) -> AsyncIterator[BaseMessageChunk] | None:
        system_msg = SystemMessage(content=config.persona)
        *history_models, question_model = history
        msgs = [to_message(m) for m in history_models]
        prompt = ChatPromptTemplate.from_messages([
            system_msg,
            *msgs,
        ])
        prompt_value = prompt.invoke({})
        input = prompt_value.to_string()
        if self.chat_id is not None:
            agent_name = "{}_agent".format(chat_id)
            task = RequestTask(
                self.run, agent_name=agent_name, input=input)
            return AsyncGeneratorWrapper(task.stream_run())


class AUAgentProvider(AgentProvider):
    '''Langchain Agent Provider'''
    name: str = "custom"

    agent_dict: dict[int, Agent] = {}

    def can_handle(self, config: ConfigMeta) -> int:
        '''Priority of provider for handling agent config'''
        if config.model.key == 'gpt-4':
            return 20
        if config.model.key == 'gpt-4o':
            return 20
        if config.model.key == 'gpt-3.5-turbo':
            return 20
        return -1

    def provide(self, config: ConfigMeta, chat_id: int) -> Agent:
        """get suitable agent"""
        exist = self.agent_dict.get(chat_id)
        if exist is not None:
            return exist
        agent = RagAgent(meta=config, chat_id=chat_id)
        agent.setUp()
        self.agent_dict[chat_id] = agent
        return agent


AgentUniverse().start(config_path="/workspaces/magent/api/config.toml")
au_agent_provider = AUAgentProvider()
