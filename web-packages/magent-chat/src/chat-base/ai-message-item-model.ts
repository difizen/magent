import { autoFactory, AutoFactoryOption } from '@difizen/magent-core';
import { inject, prop } from '@difizen/mana-app';

import type { ChatMessageItemOption } from './chat-message-item-model.js';
import { DefaultChatMessageItemModel } from './chat-message-item-model.js';
import type {
  ChatEventChunk,
  ChatEventError,
  ChatEventResult,
  IChatEvent,
} from './protocol.js';
import { ChatEvent } from './protocol.js';
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

  handleEventData(e: IChatEvent) {
    if (ChatEvent.isChunk(e)) {
      this.appendChunk(e);
    }
    if (ChatEvent.isError(e)) {
      this.handleError(e);
    }
    if (ChatEvent.isResult(e)) {
      this.handleResult(e);
    }
  }

  appendChunk(e: ChatEventChunk) {
    this.state = AnswerState.RECEIVING;
    this.content = `${this.content}${e.output}`;
  }

  handleResult(e: ChatEventResult) {
    this.state = AnswerState.SUCCESS;
    if (e.output) {
      this.content = e.output;
    }
  }

  handleError(e: ChatEventError) {
    this.state = AnswerState.FAIL;
    // {"error": {"error_msg": "The node type is not supported"}, "type": "error"}
    this.error = { message: e.message };
  }
}
