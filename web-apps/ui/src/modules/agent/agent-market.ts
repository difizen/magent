import { inject, prop, singleton } from '@difizen/mana-app';

import { AgentManager } from './agent-manager.js';
import type { AgentModel } from './agent-model.js';

@singleton()
export class AgentMarket {
  @inject(AgentManager) agentManager: AgentManager;

  @prop()
  list: AgentModel[] = [];

  @prop()
  loading = false;

  async update() {
    this.loading = true;
    const options = await this.agentManager.getAll();
    this.list = options.map(this.agentManager.getOrCreate);
    this.loading = false;
  }
}
