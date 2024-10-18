import { createSlotPreference, ManaModule } from '@difizen/mana-app';
import { AgentModalContribution } from './modal/contribution.js';

import { AgentsView, slot } from './view.js';

export const AgentsPageModule = ManaModule.create().register(
  AgentsView,
  AgentModalContribution,
  createSlotPreference({
    slot: slot,
    view: AgentsView,
  }),
);
