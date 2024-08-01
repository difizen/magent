import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';

import type { AgentConfig, AgentConfigOption } from './protocol.js';
import { AgentConfigFactory } from './protocol.js';

@singleton()
export class AgentConfigManager {
  @inject(AxiosClient) axios: AxiosClient;
  @inject(AgentConfigFactory) configFactory: AgentConfigFactory;
  getDraft = async (option: AgentConfigOption): Promise<AgentConfig> => {
    return this.configFactory(option);
  };

  create = (option: AgentConfigOption): AgentConfig => {
    return this.configFactory(option);
  };
}
