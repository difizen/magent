import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { AgentChatModule } from '../agent-chat/module.js';
import { AgentConfigViewModule } from '../agent-config/module.js';

import { AgentDevView, AgentDevSlot as DevSlot } from './dev-view.js';

export const AgentDevModule = ManaModule.create()
  .register(
    AgentDevView,
    createSlotPreference({
      slot: DevSlot,
      view: AgentDevView,
    }),
  )
  .dependOn(AgentConfigViewModule, AgentChatModule);
