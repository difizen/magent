import { ManaModule } from '@difizen/mana-app';

import {
  AIChatMessageItem,
  ChatMessageItem,
  HumanChatMessageItem,
} from './chat-message-item.js';
import { ChatMessageManager } from './chat-message-manager.js';
import { ChatMessageModel } from './chat-message-model.js';
import { PeerChatMessageItem } from './peer-message-item-model.js';
import { ChatMessageItemOption } from './protocol.js';
import { ChatMessageItemFactory, ChatMessageOption } from './protocol.js';
import { ChatMessageFactory } from './protocol.js';

export const ChatMessageModule = ManaModule.create().register(
  ChatMessageModel,
  ChatMessageManager,
  {
    token: ChatMessageFactory,
    useFactory: (ctx) => {
      return (option: ChatMessageOption) => {
        const child = ctx.container.createChild();
        child.register({ token: ChatMessageOption, useValue: option });
        return child.get(ChatMessageModel);
      };
    },
  },
  ChatMessageItem,
  HumanChatMessageItem,
  AIChatMessageItem,
  PeerChatMessageItem,
  {
    token: ChatMessageItemFactory,
    useFactory: (ctx) => {
      return (option: ChatMessageItemOption) => {
        const child = ctx.container.createChild();
        child.register({ token: ChatMessageItemOption, useValue: option });
        if (option.senderType === 'AI') {
          if (option.planner === 'peer_planner') {
            return child.get(PeerChatMessageItem);
          }
          return child.get(AIChatMessageItem);
        }
        return child.get(HumanChatMessageItem);
      };
    },
  },
);
