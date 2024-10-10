import { PrioritizedContributionManager } from '@difizen/magent-core';
import type { Contribution } from '@difizen/mana-app';
import { contrib, singleton } from '@difizen/mana-app';

import type { ChatMessageItemOption } from './chat-message-item-model.js';
import { ChatMessageItemContribution } from './protocol.js';

@singleton()
export class ChatMessageItemManager extends PrioritizedContributionManager<
  ChatMessageItemOption,
  ChatMessageItemContribution
> {
  @contrib(ChatMessageItemContribution)
  protected contributionProvider: Contribution.Provider<ChatMessageItemContribution>;

  createChatMessageItem = <T extends ChatMessageItemOption = ChatMessageItemOption>(
    option: T,
  ) => {
    const contribution = this.findContribution(option, this.contributionProvider);
    return contribution.handle(option);
  };
}
