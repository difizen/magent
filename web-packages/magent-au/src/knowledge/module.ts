import { ManaModule } from '@difizen/mana-app';

import { KnowledgeManager } from './knowledge-manager.js';
import { KnowledgeModel } from './knowledge-model.js';
import { KnowledgeSpace } from './knowledge-space.js';
import { KnowledgeModelFactory, KnowledgeModelOption } from './protocol.js';

export const KnowledgeModule = ManaModule.create().register(
  KnowledgeManager,
  KnowledgeSpace,
  KnowledgeModel,
  {
    token: KnowledgeModelFactory,
    useFactory: (ctx) => {
      return (option: any) => {
        const child = ctx.container.createChild();
        child.register({ token: KnowledgeModelOption, useValue: option });
        return child.get(KnowledgeModel);
      };
    },
  },
);
