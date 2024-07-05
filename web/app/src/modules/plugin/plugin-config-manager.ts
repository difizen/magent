import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';
import { UserManager } from '../user/index.js';
import { PluginConfigFactory, type PluginConfigOption } from './protocol.js';
import type { PluginConfig } from './plugin-config.js';

@singleton()
export class PluginConfigManager {
  @inject(UserManager) userManager: UserManager;
  @inject(AxiosClient) axios: AxiosClient;
  @inject(PluginConfigFactory) configFactory: PluginConfigFactory;
  getDraft = async (option: PluginConfigOption): Promise<PluginConfig> => {
    return this.configFactory(option);
  };

  create = (option: PluginConfigOption): PluginConfig => {
    return this.configFactory(option);
  };
}
