import { inject, singleton } from '@difizen/mana-app';

import type { AgentConfig, AgentConfigOption } from './protocol.js';
import { AgentConfigFactory } from './protocol.js';

@singleton()
export class AgentConfigManager {
  @inject(AgentConfigFactory) configFactory: AgentConfigFactory;
  create = (option: AgentConfigOption): AgentConfig => {
    return this.configFactory(option);
  };
}
