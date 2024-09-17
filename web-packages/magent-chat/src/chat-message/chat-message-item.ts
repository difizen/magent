import { inject, prop, transient } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { AxiosClient } from '../axios-client/protocol.js';

import { ChatMessageItemOption } from './protocol.js';
import type { QuestionState, MessageSender, AnswerState } from './protocol.js';

@transient()
export class ChatMessageItem {
  protected axios: AxiosClient;
  option: ChatMessageItemOption;

  senderType?: MessageSender;

  @prop()
  protected _content: string;
  get content(): string {
    return this._content;
  }
  set content(v) {
    this._content = v;
  }

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
