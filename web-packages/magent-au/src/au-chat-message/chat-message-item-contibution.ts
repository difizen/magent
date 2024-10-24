import type { BaseChatMessageItemModel, IChatMessageItem } from '@difizen/magent-chat';
import {
  ChatMessageItemContribution,
  DefaultChatMessageItemModel,
} from '@difizen/magent-chat';
import type { ToAutoFactory } from '@difizen/magent-core';
import { toAutoFactory } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import { AUAgentChatMessageItem } from './ai-message-item.js';
import { PeerChatMessageItem } from './peer-message-item-model.js';
import type { AUChatMessageItemOption } from './protocol.js';

@singleton({ contrib: ChatMessageItemContribution })
export class AUChatMessageItemContribution implements ChatMessageItemContribution {
  @inject(toAutoFactory(AUAgentChatMessageItem))
  agentItemFactory: ToAutoFactory<typeof AUAgentChatMessageItem>;

  @inject(toAutoFactory(PeerChatMessageItem))
  peerItemFactory: ToAutoFactory<typeof PeerChatMessageItem>;

  canHandle = (option: IChatMessageItem) => {
    if (DefaultChatMessageItemModel.isOption(option) && option.sender.type === 'AI') {
      return 10;
    }
    return 0;
  };

  handle = (option: IChatMessageItem): BaseChatMessageItemModel => {
    if (DefaultChatMessageItemModel.isOption(option) && 'planner' in option) {
      if (option['planner'] === 'peer') {
        return this.peerItemFactory(option as AUChatMessageItemOption);
      }
      if (option.sender.type === 'AI') {
        return this.agentItemFactory(option as AUChatMessageItemOption);
      }
    }
    console.error(option);
    throw Error('Cannot handle chat message item option.');
  };
}
