'''Agent manager
'''


from typing import List
from pydantic import BaseModel

from .agent_provider import AgentProvider
from .base import ConfigMeta


class AgentManager(BaseModel):
    '''Agent Manager
    get or create agent from provider by manager
    '''

    providers: List[AgentProvider] = []

    def registe_provider(self, provider: AgentProvider):
        '''add provider'''
        self.providers.append(provider)

    def get_provider(self, config: ConfigMeta) -> AgentProvider:
        '''retrieve the best matching provider'''
        selected_provider = None
        highest_priority = -1

        for provider in self.providers:
            priority = provider.can_handle(config)
            if priority > highest_priority:
                highest_priority = priority
                selected_provider = provider

        if selected_provider is None:
            raise Exception("No suitable provider found")

        return selected_provider


agent_manager = AgentManager()
