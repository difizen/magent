import { createViewPreference, ManaModule } from '@difizen/mana-app';

import { KnowledgeModule } from '@/modules/knowledge/module.js';

import { KnowledgeModalContribution } from './create-modal/index.js';
import { KnowledgeUploadView, uploadslot } from './upload-view.js';
import { KnowledgeView, slot } from './view.js';

export const KnowledgePageModule = ManaModule.create()
  .register(
    KnowledgeView,
    createViewPreference({
      slot: slot,
      view: KnowledgeView,
      autoCreate: true,
    }),
    KnowledgeModalContribution,
    KnowledgeUploadView,
    createViewPreference({
      slot: uploadslot,
      view: KnowledgeUploadView,
      autoCreate: true,
    }),
  )
  .dependOn(KnowledgeModule);
