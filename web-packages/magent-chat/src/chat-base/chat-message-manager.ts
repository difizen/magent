import type { ToAutoFactory } from '@difizen/magent-core';
import { PrioritizedContributionManager, toAutoFactory } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import type { ChatMessageItemOption } from './chat-message-item-model.js';
import type { ChatMessageOption } from './chat-message-model.js';
import { DefaultChatMessageModel } from './chat-message-model.js';
import type { BaseChatMessageModel, ChatMessageItemContribution } from './protocol.js';

@singleton()
export class ChatMessageManager extends PrioritizedContributionManager<
  ChatMessageItemOption,
  ChatMessageItemContribution
> {
  protected cache: Map<string, BaseChatMessageModel> = new Map<
    string,
    BaseChatMessageModel
  >();

  @inject(toAutoFactory(DefaultChatMessageModel))
  factory: ToAutoFactory<typeof DefaultChatMessageModel>;

  getOrCreate = <T extends ChatMessageOption = ChatMessageOption>(option: T) => {
    const currentOption = option;
    if (currentOption.id) {
      const exist = this.cache.get(currentOption.id);
      if (exist) {
        return exist;
      }
    }
    const message = this.factory(currentOption);
    message.ready
      .then((data) => {
        if (data.id) {
          this.cache.set(data.id, message);
        }
        return;
      })
      .catch(console.error);
    return message;
  };
}
