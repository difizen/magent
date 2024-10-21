import type { DefaultChatMessageModel } from '@difizen/magent-chat';
import { DefaultConversationModel } from '@difizen/magent-chat';
import type { ToAutoFactory } from '@difizen/magent-core';
import {
  autoFactory,
  AutoFactoryOption,
  Fetcher,
  toAutoFactory,
} from '@difizen/magent-core';
import { equals } from '@difizen/mana-app';
import { inject, prop } from '@difizen/mana-app';
import dayjs from 'dayjs';

import { AUChatMessageModel } from '../au-chat-message/chat-message-model.js';
// import type { AUMessageCreate } from '../au-chat-message/protocol.js';

import type { SessionOption } from './protocol.js';
import { SessionOptionType } from './protocol.js';

@autoFactory()
export class SessionModel extends DefaultConversationModel {
  @inject(toAutoFactory(AUChatMessageModel))
  declare messageFactory: ToAutoFactory<typeof DefaultChatMessageModel>;

  fetcher: Fetcher;
  agentId: string;

  override option: SessionOption;

  @prop()
  override messages: AUChatMessageModel[] = [];

  get gmtCreate() {
    return dayjs(this.created);
  }

  get gmtModified() {
    return dayjs(this.modified);
  }

  constructor(
    @inject(AutoFactoryOption) option: SessionOption,
    @inject(Fetcher) fetcher: Fetcher,
  ) {
    super(option);
    this.option = option;
    this.fetcher = fetcher;
    this.initialize(option);
  }

  override shouldInitFromMeta(option: SessionOption): boolean {
    return SessionOptionType.isFullOption(option);
  }

  override fetchInfo = async (option: SessionOption): Promise<void> => {
    console.warn('fetch session model info not implemented');
  };

  protected override fromMeta(option: SessionOption = this.option) {
    this.agentId = option.agentId;
    super.fromMeta(option);
  }

  protected disposeMessage = (msg: AUChatMessageModel) => {
    this.messages = this.messages.filter((item) => !equals(item, msg));
  };
}
