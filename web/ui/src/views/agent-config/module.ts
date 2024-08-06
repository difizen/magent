import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { AgentBotModule } from '../../modules/agent/module.js';

import { AgentConfigView, slot } from './view.js';

export const AgentConfigPageModule = ManaModule.create().register(
  AgentConfigView,
  createSlotPreference({
    slot: slot,
    view: AgentConfigView,
  }),
);
