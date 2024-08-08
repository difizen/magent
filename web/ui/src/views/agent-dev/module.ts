import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { AgentConfigViewModule } from '../agent-config/module.js';

import { AgentView, slot as ChatSlot } from './chat-view.js';
import { DebugContribution } from './debug-contribution.js';
import { AgentDevView, slot as DevSlot } from './dev-view.js';

export const AgentChatModule = ManaModule.create()
  .register(
    AgentView,
    DebugContribution,
    createSlotPreference({
      slot: ChatSlot,
      view: AgentView,
    }),
    AgentDevView,
    createSlotPreference({
      slot: DevSlot,
      view: AgentDevView,
    }),
  )
  .dependOn(AgentConfigViewModule);
