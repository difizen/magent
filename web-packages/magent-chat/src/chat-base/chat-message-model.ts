import { autoFactory, AutoFactoryOption } from '@difizen/magent-core';
import { inject, prop } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { ChatMessageItemManager } from './chat-message-item-manager.js';
import type {
  IChatMessage,
  BaseChatMessageItemModel,
  BaseConversationModel,
  BaseChatMessageSummary,
} from './protocol.js';

export interface ChatMessageOption extends IChatMessage {
  parent: BaseConversationModel;
}

@autoFactory()
export class DefaultChatMessageModel {
  id?: string;

  parent?: BaseConversationModel;

  protected option: ChatMessageOption | IChatMessage;

  protected itemManager: ChatMessageItemManager;

  @prop()
  items: BaseChatMessageItemModel[] = [];

  @prop()
  created?: Dayjs;

  @prop()
  modified?: Dayjs;

  @prop()
  token?: BaseChatMessageSummary;

  constructor(
    @inject(AutoFactoryOption) option: ChatMessageOption,
    @inject(ChatMessageItemManager) itemManager: ChatMessageItemManager,
  ) {
    this.option = option;
    this.id = option.id;
    this.parent = option.parent;
    this.itemManager = itemManager;
    this.created = dayjs(option.created);
    this.modified = dayjs(option.modified);
    this.initMessageItems(option);
  }

  initMessageItems = (option: IChatMessage | ChatMessageOption) => {
    this.items = option.messages.map((opt) => {
      return this.itemManager.createChatMessageItem({ ...opt, parent: this });
    });
  };
}
