import { autoFactory, AutoFactoryOption } from '@difizen/magent-core';
import { inject, prop } from '@difizen/mana-app';
import type { ParsedEvent } from 'eventsource-parser';

import type { ChatMessageItemOption } from './chat-message-item-model.js';
import { DefaultChatMessageItemModel } from './chat-message-item-model.js';
import type { ChatEventChunk } from './protocol.js';
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

  handleEventData(e: ParsedEvent, data: any) {
    if (e.event === 'chunk') {
      this.appendChunk(data as ChatEventChunk);
    }
  }

  appendChunk(e: ChatEventChunk) {
    this.content = `${this.content}${e.output}`;
  }
}
