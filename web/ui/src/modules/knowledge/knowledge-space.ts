import { inject, prop, singleton } from '@difizen/mana-app';

import { KnowledgeManager } from './knowledge-manager.js';
import type { KnowledgeModel } from './knowledge-model.js';

@singleton()
export class KnowledgeSpace {
  @inject(KnowledgeManager) manager: KnowledgeManager;

  @prop()
  list: KnowledgeModel[] = [];

  @prop()
  loading = false;

  async update() {
    this.loading = true;
    const options = await this.manager.getKnowledge();
    this.list = options.map(this.manager.getOrCreateKnowledge);
    this.loading = false;
  }
}
