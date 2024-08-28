import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/protocol.js';

import { AgentModelFactory } from './protocol.js';
import type {
  AgentModel,
  AgentModelOption,
  AgentModelCreateOption,
} from './protocol.js';

@singleton()
export class AgentManager {
  protected cache: Map<string, AgentModel> = new Map<string, AgentModel>();
  @inject(AgentModelFactory) botFactory: AgentModelFactory;
  @inject(AxiosClient) axios: AxiosClient;

  getAll = async (): Promise<AgentModelOption[]> => {
    const defaultValue: AgentModelOption[] = [];
    const res = await this.axios.get<AgentModelOption[]>(`/api/v1/agents`);
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
    const bot = this.botFactory(option);
    this.cache.set(bot.id, bot);
    return bot;
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
    return await this.axios.post<AgentModelOption[]>(`/api/v1/agents`, option);
  };
  protected doCreateWorkflowAgent = async (option: AgentModelCreateOption) => {
    return await this.axios.post<AgentModelOption[]>(`/api/v1/agents/workflow`, option);
  };
}
