import { ChatService } from '@difizen/magent-chat';
import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { LangchainChatService } from './langchain-chat-service.js';
import { LangchainChatView, slot } from './view.js';

export const LangchainChatViewModule = ManaModule.create().register(
  LangchainChatService,
  {
    token: ChatService,
    useClass: LangchainChatService,
  },
  LangchainChatView,
  createSlotPreference({ slot: slot, view: LangchainChatView }),
);
