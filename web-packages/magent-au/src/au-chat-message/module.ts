import { ChatModule, ChatService, DefaultChatMessageModel } from '@difizen/magent-chat';
import { ManaModule } from '@difizen/mana-app';

import { AUAgentChatMessageItem } from './ai-message-item.js';
import { AUChatMessageItemContribution } from './chat-message-item-contibution.js';
import { AUChatMessageModel } from './chat-message-model.js';
import { AUChatService } from './chat-service.js';
import { AUChatView } from './chat-view.js';
import { PeerChatMessageItem } from './peer-message-item-model.js';

export const ChatMessageModule = ManaModule.create()
  .register(
    AUChatView,
    AUChatMessageModel,
    {
      token: DefaultChatMessageModel,
      useClass: AUChatMessageModel,
    },
    AUAgentChatMessageItem,
    PeerChatMessageItem,
    AUChatService,
    {
      token: ChatService,
      useDynamic: (ctx) => ctx.container.get(AUChatService),
    },
    AUChatMessageItemContribution,
  )
  .dependOn(ChatModule);
