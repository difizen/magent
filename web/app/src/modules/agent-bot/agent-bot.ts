import { inject, prop, transient } from '@difizen/mana-app';

import { AgentConfigManager } from './agent-config-manager.js';
import type { AgentConfig } from './agent-config.js';
import { AgentBotOption } from './protocol.js';

@transient()
export class AgentBot {
  configManager: AgentConfigManager;

  @prop()
  name: string;
  @prop()
  avatar?: string;

  @prop()
  draft?: AgentConfig;

  option: any;

  constructor(
    @inject(AgentBotOption) option: any,
    @inject(AgentConfigManager) configManager: AgentConfigManager,
  ) {
    this.option = option;
    this.configManager = configManager;
    this.configManager
      .getDraft()
      .then((config) => {
        this.draft = config;
        return;
      })
      .catch(console.error);
  }
}
