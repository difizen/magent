import type { ToAutoFactory } from '@difizen/magent-core';
import { toAutoFactory } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import { AIChatMessageItemModel } from './ai-message-item-model.js';
import type { ChatMessageItemOption } from './chat-message-item-model.js';
import {
  DefaultChatMessageItemModel,
  HumanChatMessageItemModel,
} from './chat-message-item-model.js';
import type { BaseChatMessageItemModel, IChatMessageItem } from './protocol.js';
import { ChatMessageItemContribution } from './protocol.js';

@singleton({ contrib: ChatMessageItemContribution })
export class DefaultChatMessageItemContribution implements ChatMessageItemContribution {
  @inject(toAutoFactory(AIChatMessageItemModel))
  aiChatMessageItemFactory: ToAutoFactory<typeof AIChatMessageItemModel>;

  @inject(toAutoFactory(HumanChatMessageItemModel))
  humanChatMessageItemFactory: ToAutoFactory<typeof HumanChatMessageItemModel>;

  @inject(toAutoFactory(DefaultChatMessageItemModel))
  defaultChatMessageItemFactory: ToAutoFactory<typeof DefaultChatMessageItemModel>;

  canHandle = (option: IChatMessageItem) => {
    if (DefaultChatMessageItemModel.isOption(option)) {
      return 1;
    }
    return 0;
  };

  handle = (option: IChatMessageItem): BaseChatMessageItemModel => {
    if (DefaultChatMessageItemModel.isOption(option)) {
      if (option.sender.type === 'AI') {
        return this.aiChatMessageItemFactory(option);
      }
      return this.humanChatMessageItemFactory(option);
    }
    return this.defaultChatMessageItemFactory(option as ChatMessageItemOption);
  };
}
