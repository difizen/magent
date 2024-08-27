import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/protocol.js';

import { ToolConfigFactory, type ToolConfigOption } from './protocol.js';
import type { ToolConfig } from './tool-config.js';

@singleton()
export class ToolConfigManager {
  @inject(AxiosClient) axios: AxiosClient;
  @inject(ToolConfigFactory) configFactory: ToolConfigFactory;
  getDraft = async (option: ToolConfigOption): Promise<ToolConfig> => {
    return this.configFactory(option);
  };

  create = (option: ToolConfigOption): ToolConfig => {
    return this.configFactory(option);
  };
}
