import { inject, singleton } from '@difizen/mana-app';

import type { AgentConfig } from './protocol.js';
import { AgentConfigFactory } from './protocol.js';

@singleton()
export class AgentConfigManager {
  @inject(AgentConfigFactory) configFactory: AgentConfigFactory;
  getDraft = async (): Promise<AgentConfig> => {
    return this.configFactory({});
  };
}
