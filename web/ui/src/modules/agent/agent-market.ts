import { inject, prop, singleton } from '@difizen/mana-app';

import { AgentManager } from './agent-manager.js';
import type { AgentModel } from './agent-model.js';

@singleton()
export class AgentMarket {
  @inject(AgentManager) agentManager: AgentManager;

  @prop()
  list: AgentModel[] = [];

  async update() {
    const options = await this.agentManager.getAgents();
    this.list = options.map(this.agentManager.getOrCreateAgent);
  }
}
