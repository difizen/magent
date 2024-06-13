import { inject, singleton } from '@difizen/mana-app';
import axios from 'axios';
import qs from 'query-string';

import { UserManager } from '../user/index.js';

import type { AgentConfig, AgentConfigOption } from './protocol.js';
import { AgentConfigFactory } from './protocol.js';

@singleton()
export class AgentConfigManager {
  @inject(UserManager) userManager: UserManager;
  @inject(AgentConfigFactory) configFactory: AgentConfigFactory;
  getDraft = async (option: AgentConfigOption): Promise<AgentConfig> => {
    return this.configFactory(option);
  };

  create = async (): Promise<AgentConfig> => {
    const user = await this.userManager.currentReady;
    if (!user) {
      throw new Error('cannot get user info');
    }
    const query = qs.stringify({
      user_id: user.id,
    });
    const res = await axios.post<AgentConfigOption>(`api/v1/agent/configs?${query}`);
    if (res.status !== 200) {
      throw new Error('failed to create agent config');
    }
    return this.configFactory(res.data);
  };
}
