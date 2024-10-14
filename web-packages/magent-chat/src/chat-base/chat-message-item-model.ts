import { autoFactory, AutoFactoryOption } from '@difizen/magent-core';
import { inject, prop } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { QuestionState } from './protocol.js';
import type {
  IChatMessageItem,
  IChatMessageSender,
  BaseChatMessageModel,
  AnswerState,
  ErrorMessage,
} from './protocol.js';

export interface ChatMessageItemOption extends IChatMessageItem {
  parent: BaseChatMessageModel;
}

@autoFactory()
export class DefaultChatMessageItemModel {
  static isOption = (option: IChatMessageItem): option is ChatMessageItemOption => {
    return !!option && 'parent' in option;
  };

  id?: string;
  sender: IChatMessageSender;

  option: ChatMessageItemOption;

  protected parent: BaseChatMessageModel;

  @prop()
  protected _content: string;
  get content(): string {
    return this._content;
  }
  set content(v) {
    this._content = v;
  }

  @prop()
  created?: Dayjs;

  @prop()
  modified?: Dayjs;

  @prop()
  error?: ErrorMessage;

  @prop()
  state: QuestionState | AnswerState;

  constructor(@inject(AutoFactoryOption) option: ChatMessageItemOption) {
    this.option = option;
    this.id = option.id;
    this.parent = option.parent;
    this.created = dayjs(option.created);
    this.modified = dayjs(option.modified);
    this.sender = option.sender;
    this.content = option.content;
  }
}

@autoFactory()
export class HumanChatMessageItemModel extends DefaultChatMessageItemModel {
  @prop()
  declare state: QuestionState;

  constructor(@inject(AutoFactoryOption) option: ChatMessageItemOption) {
    super(option);
    if (option.content) {
      this.state = QuestionState.SUCCESS;
    } else {
      this.state = QuestionState.SENDING;
    }
  }
}
