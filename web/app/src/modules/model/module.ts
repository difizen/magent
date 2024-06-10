import { ManaModule } from '@difizen/mana-app';

import { ModelManager } from './model-manager.js';
import { Model } from './model.js';
import type { ModelMeta } from './protocol.js';
import { ModelFactory, ModelOption } from './protocol.js';

export const ModelModule = ManaModule.create()
  .register(Model, ModelManager)
  .register({
    token: ModelFactory,
    useFactory: (ctx) => {
      return (meta: ModelMeta) => {
        const child = ctx.container.createChild();
        child.register({ token: ModelOption, useValue: meta });
        return child.get(Model);
      };
    },
  });
