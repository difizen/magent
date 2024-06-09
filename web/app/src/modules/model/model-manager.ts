import { inject, singleton } from '@difizen/mana-app';

import { builtinModels } from './built-in-model-meta.js';
import type { Model } from './model.js';
import { ModelFactory } from './protocol.js';

@singleton()
export class ModelManager {
  @inject(ModelFactory) factory: ModelFactory;
  metas = builtinModels;
  models: Model[];

  updateModels = () => {
    this.models = this.metas.map((item) => this.factory(item));
  };
}
