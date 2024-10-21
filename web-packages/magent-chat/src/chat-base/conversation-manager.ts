import type { ToAutoFactory } from '@difizen/magent-core';
import { toAutoFactory } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import { DefaultConversationModel } from './conversation-model.js';
import type { BaseConversationModel } from './protocol.js';
import type { ConversationOption } from './protocol.js';

@singleton()
export class ConversationManager<
  T extends BaseConversationModel = BaseConversationModel,
> {
  protected option: any;
  protected cache: Map<string, T> = new Map<string, T>();
  protected factory: ToAutoFactory<typeof DefaultConversationModel>;

  constructor(
    @inject(toAutoFactory(DefaultConversationModel))
    modelFactory: ToAutoFactory<typeof DefaultConversationModel>,
  ) {
    this.factory = modelFactory;
  }

  getOrCreate<O extends ConversationOption = ConversationOption>(option: O): T {
    const currentOption = option;
    if (!currentOption.id) {
      throw new Error('Missing id property in conversation option');
    }
    const exist = this.cache.get(currentOption.id);
    if (exist) {
      return exist;
    }
    const conversation = this.factory(currentOption) as T;
    conversation.onDispose(() => {
      this.cache.delete(currentOption.id);
    });
    this.cache.set(currentOption.id, conversation);
    return conversation;
  }
}
