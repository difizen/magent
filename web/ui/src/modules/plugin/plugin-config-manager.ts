import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';

import type { PluginConfig } from './plugin-config.js';
import { PluginConfigFactory, type PluginConfigOption } from './protocol.js';

@singleton()
export class PluginConfigManager {
  @inject(AxiosClient) axios: AxiosClient;
  @inject(PluginConfigFactory) configFactory: PluginConfigFactory;
  getDraft = async (option: PluginConfigOption): Promise<PluginConfig> => {
    return this.configFactory(option);
  };

  create = (option: PluginConfigOption): PluginConfig => {
    return this.configFactory(option);
  };
}
