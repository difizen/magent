import { PrioritizedContributionManager } from '@difizen/magent-core';
import type { Contribution } from '@difizen/mana-app';
import { contrib, singleton } from '@difizen/mana-app';

import type { BaseChatMessageItemModel } from '../index.js';

import { ChatMessageItemRenderContribution } from './protocol.js';

@singleton()
export class ChatMessageRender extends PrioritizedContributionManager<
  BaseChatMessageItemModel,
  ChatMessageItemRenderContribution
> {
  @contrib(ChatMessageItemRenderContribution)
  protected contributionProvider: Contribution.Provider<ChatMessageItemRenderContribution>;

  getChatItemRender = <T extends BaseChatMessageItemModel = BaseChatMessageItemModel>(
    option: T,
  ) => {
    const contribution = this.findContribution(option, this.contributionProvider);
    return contribution.handle(option);
  };
}
