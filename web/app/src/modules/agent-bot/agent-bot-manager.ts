import { inject, singleton } from '@difizen/mana-app';

import type { AgentBot } from './protocol.js';
import { AgentBotFactory } from './protocol.js';

@singleton()
export class AgentBotManager {
  @inject(AgentBotFactory) botFactory: AgentBotFactory;
  getBot = async (options: any): Promise<AgentBot> => {
    return this.botFactory(options);
  };
}
