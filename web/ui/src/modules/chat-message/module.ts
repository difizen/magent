import { ManaModule } from '@difizen/mana-app';

import { ChatMessageManager } from './chat-message-manager.js';
import { ChatMessageModel } from './chat-message-model.js';
import { ChatMessageOption } from './protocol.js';
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
);
