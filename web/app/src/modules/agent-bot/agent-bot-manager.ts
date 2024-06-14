import { inject, singleton } from '@difizen/mana-app';
import qs from 'query-string';

import { AxiosClient } from '../axios-client/index.js';
import { UserManager } from '../user/user-manager.js';

import type { AgentBot, AgentBotMeta, AgentBotOption } from './protocol.js';
import { AgentBotFactory } from './protocol.js';

@singleton()
export class AgentBotManager {
  @inject(AgentBotFactory) botFactory: AgentBotFactory;
  @inject(UserManager) userManager: UserManager;
  @inject(AxiosClient) axios: AxiosClient;

  getMyBots = async (): Promise<Pagination<AgentBotOption>> => {
    const user = await this.userManager.currentReady;
    const defaultValue = { items: [], total: 0, page: 0, size: 0, pages: 0 };
    if (!user) {
      return defaultValue;
    }
    if (!user) {
      return defaultValue;
    }
    const query = qs.stringify({
      page: 1,
      size: 10,
      user_id: user.id,
    });
    const res = await this.axios.get<Pagination>(`api/v1/agent/bots?${query}`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  createBot = async (meta: AgentBotMeta): Promise<AgentBot> => {
    const user = await this.userManager.currentReady;
    if (!user) {
      throw new Error('cannot get user info');
    }
    const query = qs.stringify({
      user_id: user.id,
    });
    const res = await this.axios.post<AgentBotOption>(
      `api/v1/agent/bots?${query}`,
      meta,
    );
    if (res.status !== 200) {
      throw new Error('failed to create agent bot');
    }
    return this.botFactory(res.data);
  };

  getBot = async (options: AgentBotOption): Promise<AgentBot> => {
    return this.botFactory(options);
  };
}
