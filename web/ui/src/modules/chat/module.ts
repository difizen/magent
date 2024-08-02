import { ManaModule } from '@difizen/mana-app';

import { ChatMessage } from './chat-message.js';
import { Chat } from './chat.js';
import { ChatManager } from './manager.js';
import { ChatMessageManager } from './message-manager.js';
import {
  ChatFactory,
  ChatMessageFactory,
  ChatMessageOption,
  ChatOption,
} from './protocol.js';

export const ChatModule = ManaModule.create().register(
  ChatMessageManager,
  ChatManager,
  Chat,
  ChatMessage,
  {
    token: ChatMessageFactory,
    useFactory: (ctx) => {
      return (option: ChatMessageOption) => {
        const child = ctx.container.createChild();
        child.register({ token: ChatMessageOption, useValue: option });
        return child.get(ChatMessage);
      };
    },
  },
  {
    token: ChatFactory,
    useFactory: (ctx) => {
      return (option: ChatOption) => {
        const child = ctx.container.createChild();
        child.register({ token: ChatOption, useValue: option });
        return child.get(Chat);
      };
    },
  },
);
