import { inject, prop, singleton } from '@difizen/mana-app';

import type { AgentBot } from '../../modules/agent-bot/index.js';
import { AgentBotManager } from '../../modules/agent-bot/index.js';

@singleton()
export class BotProvider {
  @inject(AgentBotManager) agentBotManager: AgentBotManager;

  @prop()
  current?: AgentBot;

  @prop()
  loading = false;

  async init() {
    this.loading = true;
    this.current = await this.agentBotManager.getBot({});
    this.loading = false;
  }
}
