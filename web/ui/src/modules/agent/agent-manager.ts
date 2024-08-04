import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';

import { AgentModelFactory } from './protocol.js';
import type { AgentModel, AgentModelOption } from './protocol.js';

@singleton()
export class AgentManager {
  protected cache: Map<string, AgentModel> = new Map<string, AgentModel>();
  @inject(AgentModelFactory) botFactory: AgentModelFactory;
  @inject(AxiosClient) axios: AxiosClient;

  getAgents = async (): Promise<AgentModelOption[]> => {
    const defaultValue: AgentModelOption[] = [];
    const res = await this.axios.get<AgentModelOption[]>(`/api/v1/agents`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  getOrCreateAgent = (option: AgentModelOption): AgentModel => {
    const exist = this.cache.get(option.id);
    if (exist) {
      return exist;
    }
    const bot = this.botFactory(option);
    this.cache.set(bot.id, bot);
    return bot;
  };
}
