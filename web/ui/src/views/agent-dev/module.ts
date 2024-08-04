import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { AgentView, slot as ChatSlot } from './chat-view.js';
import { AgentDevView, slot as DevSlot } from './dev-view.js';

export const AgentChatModule = ManaModule.create().register(
  AgentView,
  createSlotPreference({
    slot: ChatSlot,
    view: AgentView,
  }),
  AgentDevView,
  createSlotPreference({
    slot: DevSlot,
    view: AgentView,
  }),
);
