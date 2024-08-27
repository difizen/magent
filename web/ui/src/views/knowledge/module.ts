import { createViewPreference, ManaModule } from '@difizen/mana-app';

import { KnowledgeModule } from '@/modules/knowledge/module.js';

import { KnowledgeView, slot } from './view.js';

export const KnowledgePageModule = ManaModule.create()
  .register(
    KnowledgeView,
    createViewPreference({
      slot: slot,
      view: KnowledgeView,
      autoCreate: true,
    }),
  )
  .dependOn(KnowledgeModule);
