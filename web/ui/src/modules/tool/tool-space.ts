import { inject, prop, singleton } from '@difizen/mana-app';

import { ToolManager } from './tool-manager.js';
import type { ToolModel } from './tool-model.js';

@singleton()
export class ToolSpace {
  @inject(ToolManager) toolManager: ToolManager;

  @prop()
  list: ToolModel[] = [];

  @prop()
  loading = false;

  async update() {
    this.loading = true;
    const options = await this.toolManager.getTools();
    this.list = options.map(this.toolManager.getOrCreateTool);
    this.loading = false;
  }
}
