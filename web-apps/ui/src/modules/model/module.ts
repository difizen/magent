import { ManaModule } from '@difizen/mana-app';

import { LLMManager } from './llm-manager.js';
import { LLMModel } from './llm-model.js';
import type { ModelMeta } from './protocol.js';
import { LLMModelOption } from './protocol.js';
import { LLMModelFactory } from './protocol.js';

export const ModelModule = ManaModule.create()
  .register(LLMModel, LLMManager)
  .register({
    token: LLMModelFactory,
    useFactory: (ctx) => {
      return (meta: ModelMeta) => {
        const child = ctx.container.createChild();
        child.register({ token: LLMModelOption, useValue: meta });
        return child.get(LLMModel);
      };
    },
  });
