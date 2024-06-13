import { inject, prop, singleton } from '@difizen/mana-app';

import { defaultAgentBotMeta } from '../../constant/default.js';
import type { AgentBot } from '../../modules/agent-bot/index.js';
import { AgentBotManager } from '../../modules/agent-bot/index.js';

@singleton()
export class BotProvider {
  @inject(AgentBotManager) agentBotManager: AgentBotManager;

  @prop()
  current?: AgentBot;

  @prop()
  loading = false;

  async init(botId: number) {
    this.loading = true;
    if (!botId) {
      const page = await this.agentBotManager.getMyBots();
      const meta = page.items[0];
      if (!meta) {
        this.current = await this.agentBotManager.createBot(defaultAgentBotMeta);
      } else {
        this.current = await this.agentBotManager.getBot(meta);
      }
    } else {
      this.current = await this.agentBotManager.getBot({ id: botId });
    }
    this.loading = false;
  }
}
