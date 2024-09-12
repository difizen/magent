import { ManaModule } from '@difizen/mana-app';

import { LLMManager } from './llm-manager.js';
import { LLMModel, LLMProvider } from './llm-model.js';
import { LLMProviderManager } from './llm-provider-manager.js';
import type { LLMMeta, LLMProviderMeta } from './protocol.js';
import { LLMProviderFactory, LLMProviderOption } from './protocol.js';
import { LLMModelOption } from './protocol.js';
import { LLMModelFactory } from './protocol.js';

export const ModelModule = ManaModule.create().register(
  LLMProvider,
  LLMProviderManager,
  LLMModel,
  LLMManager,
  {
    token: LLMModelFactory,
    useFactory: (ctx) => {
      return (meta: LLMMeta) => {
        const child = ctx.container.createChild();
        child.register({ token: LLMModelOption, useValue: meta });
        return child.get(LLMModel);
      };
    },
  },
  {
    token: LLMProviderFactory,
    useFactory: (ctx) => {
      return (meta: LLMProviderMeta) => {
        const child = ctx.container.createChild();
        child.register({ token: LLMProviderOption, useValue: meta });
        return child.get(LLMProvider);
      };
    },
  },
);
