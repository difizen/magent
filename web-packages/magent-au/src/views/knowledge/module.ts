import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { KnowledgeModule } from '../../knowledge/module.js';

import { KnowledgeModalContribution } from './create-modal/index.js';
import { KnowledgeUploadView, uploadslot } from './upload-view.js';
import { KnowledgeView, slot } from './view.js';

export const KnowledgePageModule = ManaModule.create()
  .register(
    KnowledgeView,
    createSlotPreference({
      slot: slot,
      view: KnowledgeView,
    }),
    KnowledgeModalContribution,
    KnowledgeUploadView,
    createSlotPreference({
      slot: uploadslot,
      view: KnowledgeUploadView,
    }),
  )
  .dependOn(KnowledgeModule);
