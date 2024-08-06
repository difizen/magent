import { inject, prop, transient } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { AxiosClient } from '../axios-client/index.js';

import { ChatMessageItemOption, AnswerState } from './protocol.js';
import type { ChatEventChunk, QuestionState, MessageSender } from './protocol.js';

@transient()
export class ChatMessageItem {
  protected axios: AxiosClient;
  option: ChatMessageItemOption;

  senderType?: MessageSender;

  @prop()
  content: string;
  id: number;

  created?: Dayjs;

  @prop()
  state: QuestionState | AnswerState;

  constructor(
    @inject(ChatMessageItemOption) option: ChatMessageItemOption,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    this.option = option;
    this.axios = axios;
    const { senderType = 'HUMAN', content } = option;
    this.senderType = senderType;
    this.content = content;
    if (option.created) {
      this.created = dayjs(option.created);
    }
  }
}

@transient()
export class HumanChatMessageItem extends ChatMessageItem {
  @prop()
  declare state: QuestionState;
}

@transient()
export class AIChatMessageItem extends ChatMessageItem {
  @prop()
  declare state: AnswerState;

  constructor(
    @inject(ChatMessageItemOption) option: ChatMessageItemOption,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    super(option, axios);
    if (option.content) {
      this.state = AnswerState.SUCCESS;
    } else {
      this.state = AnswerState.WAITING;
    }
  }

  appendChunk(e: ChatEventChunk) {
    this.content = `${this.content}${e.output}`;
  }
}
