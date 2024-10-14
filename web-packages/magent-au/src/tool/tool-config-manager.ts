import { Fetcher } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import { ToolConfigFactory, type ToolConfigOption } from './protocol.js';
import type { ToolConfig } from './tool-config.js';

@singleton()
export class ToolConfigManager {
  @inject(Fetcher) fetcher: Fetcher;
  @inject(ToolConfigFactory) configFactory: ToolConfigFactory;
  getDraft = async (option: ToolConfigOption): Promise<ToolConfig> => {
    return this.configFactory(option);
  };

  create = (option: ToolConfigOption): ToolConfig => {
    return this.configFactory(option);
  };
}
