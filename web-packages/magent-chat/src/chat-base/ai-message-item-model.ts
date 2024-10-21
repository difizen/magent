import { autoFactory, AutoFactoryOption } from '@difizen/magent-core';
import { inject, prop } from '@difizen/mana-app';

import type { ChatMessageItemOption } from './chat-message-item-model.js';
import { DefaultChatMessageItemModel } from './chat-message-item-model.js';
import type { ChatEventResult } from './protocol.js';
import { AnswerState } from './protocol.js';

@autoFactory()
export class AIChatMessageItemModel extends DefaultChatMessageItemModel {
  @prop()
  declare state: AnswerState;

  constructor(@inject(AutoFactoryOption) option: ChatMessageItemOption) {
    super(option);
    if (option.content) {
      this.state = AnswerState.SUCCESS;
    } else {
      this.state = AnswerState.WAITING;
    }
  }

  override handleResult(e: ChatEventResult) {
    super.handleResult(e);
    this.state = AnswerState.SUCCESS;
  }
}
