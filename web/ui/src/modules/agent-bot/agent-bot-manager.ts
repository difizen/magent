import { inject, singleton } from '@difizen/mana-app';
import qs from 'query-string';

import { AxiosClient } from '../axios-client/index.js';

import type { AgentBot, AgentBotMeta, AgentBotOption } from './protocol.js';
import { AgentBotFactory } from './protocol.js';

@singleton()
export class AgentBotManager {
  protected cache: Map<number, AgentBot> = new Map<number, AgentBot>();
  @inject(AgentBotFactory) botFactory: AgentBotFactory;
  @inject(AxiosClient) axios: AxiosClient;

  getMyBots = async (): Promise<Pagination<AgentBotOption>> => {
    const defaultValue = { items: [], total: 0, page: 0, size: 0, pages: 0 };
    const query = qs.stringify({
      page: 1,
      size: 10,
    });
    const res = await this.axios.get<Pagination>(`api/v1/agent/bots?${query}`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  createBot = async (meta: AgentBotMeta): Promise<AgentBot> => {
    const res = await this.axios.post<AgentBotOption>(`api/v1/agent/bots`, meta);
    if (res.status !== 200) {
      throw new Error('failed to create agent bot');
    }
    return this.botFactory(res.data);
  };

  getBot = (option: AgentBotOption): AgentBot => {
    const exist = this.cache.get(option.id);
    if (exist) {
      return exist;
    }
    const bot = this.botFactory(option);
    this.cache.set(bot.id, bot);
    return bot;
  };
}
