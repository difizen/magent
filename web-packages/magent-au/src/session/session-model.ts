import type { DefaultChatMessageModel, IChatMessage } from '@difizen/magent-chat';
import { DefaultConversationModel } from '@difizen/magent-chat';
import { autoFactory, AutoFactoryOption, Fetcher } from '@difizen/magent-core';
import { equals } from '@difizen/mana-app';
import { inject, prop } from '@difizen/mana-app';
import dayjs from 'dayjs';

import type { AUChatMessageModel } from '../au-chat-message/chat-message-model.js';
import type { AUChatMessageOption } from '../au-chat-message/protocol.js';

import type { SessionOption } from './protocol.js';
import { SessionOptionType } from './protocol.js';

@autoFactory()
export class SessionModel extends DefaultConversationModel {
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
    if (option.id) {
      this.id = option.id;
    }
    if (option.agentId) {
      this.agentId = option.agentId;
    }
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

  protected override disposeMessage = (msg: DefaultChatMessageModel) => {
    this.messages = this.messages.filter((item) => !equals(item, msg));
  };

  protected override toChatMessageOption(msg: IChatMessage): AUChatMessageOption {
    return {
      ...msg,
      parent: this,
      sessionId: this.id || this.option.id!,
      agentId: this.agentId || this.option.agentId,
    };
  }
}
