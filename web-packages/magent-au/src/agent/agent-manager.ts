import { Fetcher } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import { AgentModelFactory } from './protocol.js';
import type {
  AgentModel,
  AgentModelOption,
  AgentModelCreateOption,
} from './protocol.js';

@singleton()
export class AgentManager {
  protected cache: Map<string, AgentModel> = new Map<string, AgentModel>();
  @inject(AgentModelFactory) factory: AgentModelFactory;
  @inject(Fetcher) fetcher: Fetcher;

  getAll = async (): Promise<AgentModelOption[]> => {
    const defaultValue: AgentModelOption[] = [];
    const res = await this.fetcher.get<AgentModelOption[]>(`/api/v1/agents`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  getOrCreate = (option: AgentModelOption): AgentModel => {
    const exist = this.cache.get(option.id);
    if (exist) {
      return exist;
    }
    const agent = this.factory(option);
    this.cache.set(agent.id, agent);
    return agent;
  };

  create = async (option: AgentModelCreateOption) => {
    let res;
    if (option.planner.id === 'workflow_planner') {
      res = await this.doCreateWorkflowAgent(option);
    } else {
      res = await this.doCreateNormalAgent(option);
    }
    return res;
  };

  protected doCreateNormalAgent = async (option: AgentModelCreateOption) => {
    return await this.fetcher.post<AgentModelOption[]>(`/api/v1/agents`, option);
  };
  protected doCreateWorkflowAgent = async (option: AgentModelCreateOption) => {
    return await this.fetcher.post<AgentModelOption[]>(
      `/api/v1/agents/workflow`,
      option,
    );
  };
}
