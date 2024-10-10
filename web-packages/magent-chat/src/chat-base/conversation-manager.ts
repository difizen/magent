import type { ToAutoFactory } from '@difizen/magent-core';
import { toAutoFactory } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import { DefaultConversationModel } from './conversation-model.js';
import type { BaseConversationModel } from './protocol.js';
import type { ConversationOption } from './protocol.js';

@singleton()
export class ConversationManager {
  protected option: any;
  protected cache: Map<string, BaseConversationModel> = new Map<
    string,
    BaseConversationModel
  >();

  @inject(toAutoFactory(DefaultConversationModel))
  factory: ToAutoFactory<typeof DefaultConversationModel>;

  getOrCreate = (option: ConversationOption): BaseConversationModel => {
    const currentOption = option;
    if (!currentOption.id) {
      throw new Error('Missing id property in conversation option');
    }
    const exist = this.cache.get(currentOption.id);
    if (exist) {
      return exist;
    }
    const conversation = this.factory(currentOption);
    conversation.onDispose(() => {
      this.cache.delete(currentOption.id);
    });
    this.cache.set(currentOption.id, conversation);
    return conversation;
  };
}
