import { singleton } from '@difizen/mana-app';
import type { FC } from 'react';

import type {
  DefaultChatMessageItemModel,
  DefaultChatMessageModel,
} from '../chat-base/index.js';
import { AIChatMessageItemModel } from '../chat-base/index.js';

import { AIMessage } from './components/message/ai-message.js';
import { HumanMessage } from './components/message/human-message.js';
import { ChatMessageItemRenderContribution } from './protocol.js';

@singleton({ contrib: ChatMessageItemRenderContribution })
export class DefaultChatMessageItemRenderContribution
  implements ChatMessageItemRenderContribution
{
  canHandle = (option: DefaultChatMessageItemModel) => {
    return 1;
  };

  handle = (
    option: DefaultChatMessageItemModel,
  ): FC<{ message: DefaultChatMessageModel; item: DefaultChatMessageItemModel }> => {
    if (option instanceof AIChatMessageItemModel) {
      return AIMessage;
    }
    return HumanMessage;
  };
}
