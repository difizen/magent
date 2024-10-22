import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { AgentChatView, slot as ChatSlot } from '../agent-chat/chat-view.js';
import { AUViewCommonModule } from '../common/module.js';
import { SessionsViewModule } from '../sessions/module.js';

export const AgentChatModule = ManaModule.create('AgentChatModule')
  .register(
    AgentChatView,
    createSlotPreference({
      slot: ChatSlot,
      view: AgentChatView,
    }),
  )
  .dependOn(SessionsViewModule, AUViewCommonModule);
