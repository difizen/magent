import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { AgentsView, slot } from './view.js';

export const AgentsPageModule = ManaModule.create().register(
  AgentsView,
  createSlotPreference({
    slot: slot,
    view: AgentsView,
  }),
);
