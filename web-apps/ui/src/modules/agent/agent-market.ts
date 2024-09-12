import { inject, prop, singleton } from '@difizen/mana-app';

import { AgentManager } from './agent-manager.js';
import type { AgentModel } from './agent-model.js';
import type { AgentModelOption } from './protocol.js';

@singleton()
export class AgentMarket {
  agentManager: AgentManager;

  @prop()
  list: AgentModel[] = [];

  @prop()
  loading = false;

  protected fetching?: Promise<AgentModelOption[]>;

  constructor(@inject(AgentManager) agentManager: AgentManager) {
    this.agentManager = agentManager;
    this.update();
  }

  async update() {
    this.loading = true;
    if (this.fetching) {
      return this.fetching;
    } else {
      this.fetching = this.agentManager.getAll();
    }
    this.fetching
      .then(() => {
        return (this.fetching = undefined);
      })
      .catch(console.error);
    const options = await this.fetching;
    this.list = options.map(this.agentManager.getOrCreate);
    this.loading = false;
    return options;
  }
}
