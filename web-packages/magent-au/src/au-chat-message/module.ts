import { ChatModule, DefaultChatMessageModel } from '@difizen/magent-chat';
import { ManaModule } from '@difizen/mana-app';

import { AUAgentChatMessageItem } from './ai-message-item.js';
import { AUChatMessageModel } from './chat-message-model.js';
import { PeerChatMessageItem } from './peer-message-item-model.js';

export const ChatMessageModule = ManaModule.create()
  .register(
    AUChatMessageModel,
    {
      token: DefaultChatMessageModel,
      useClass: AUChatMessageModel,
    },
    AUAgentChatMessageItem,
    PeerChatMessageItem,
  )
  .dependOn(ChatModule);
