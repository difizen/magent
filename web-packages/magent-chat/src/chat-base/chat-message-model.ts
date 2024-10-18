import { autoFactory, AutoFactoryOption } from '@difizen/magent-core';
import type { Event, Disposable } from '@difizen/mana-app';
import { Deferred, Emitter, inject, prop } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { ChatMessageItemManager } from './chat-message-item-manager.js';
import { ChatService } from './chat-service.js';
import type {
  IChatMessage,
  BaseChatMessageItemModel,
  BaseConversationModel,
  BaseChatMessageSummary,
  IChatEvent,
  IChatMessageItem,
} from './protocol.js';

export interface ChatMessageOption extends IChatMessage {
  parent: BaseConversationModel;
}

@autoFactory()
export class DefaultChatMessageModel implements Disposable {
  @inject(ChatService) protected chatService: ChatService;

  protected _id: string | undefined;
  get id(): string | undefined {
    return this._id;
  }
  set id(v: string | undefined) {
    this._id = v;
    this.readyDeferred.resolve(this);
  }

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

  @prop()
  sending = false;

  get ready(): Promise<DefaultChatMessageModel> {
    return this.readyDeferred.promise;
  }

  protected onMessageItemEmitter = new Emitter<BaseChatMessageItemModel>();
  get onMessageItem(): Event<BaseChatMessageItemModel> {
    return this.onMessageItemEmitter.event;
  }

  protected onDisposeEmitter = new Emitter<void>();

  disposed = false;
  get onDispose(): Event<void> {
    return this.onDisposeEmitter.event;
  }

  protected readyDeferred: Deferred<DefaultChatMessageModel> =
    new Deferred<DefaultChatMessageModel>();

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

  protected initMessageItems = (option: IChatMessage | ChatMessageOption) => {
    this.items = option.messages.map((opt) => {
      return this.itemManager.createChatMessageItem({ ...opt, parent: this });
    });
  };

  updateMeta = <T extends ChatMessageOption>(option: T) => {
    this.id = option.id || dayjs().unix().toString();
    if (option.created) {
      this.created = dayjs(option.created);
    }
    if (option.modified) {
      this.modified = dayjs(option.modified);
    }
    if (option.messages && option.messages.length > 0) {
      const items = option.messages.map((item) =>
        this.itemManager.createChatMessageItem({
          parent: this,
          content: item.content,
          sender: item.sender,
          created: item.sender.type === 'AI' ? option.modified : option.created,
        }),
      );
      this.items = items;
      this.onMessageItemEmitter.fire(items[items.length - 1]);
    }
  };

  protected sendMessage = async (option: ChatMessageOption) => {
    const { input, stream = true } = option;
    this.sending = true;

    const human = this.itemManager.createChatMessageItem({
      parent: this,
      sender: { type: 'HUMAN' },
      content: input,
    });

    const opt: ChatMessageOption = {
      ...option,
      messages: [human.option],
    };

    this.updateMeta(opt);
    if (!stream) {
      await this.chat(option);
    } else {
      await this.chatStream(option);
    }
    this.sending = false;
  };

  protected chat = async (option: ChatMessageOption) => {
    const { input } = option;
    try {
      const items = await this.chatService.chat({ input });
      items.forEach((item) => {
        this.handleMessageItem(item);
      });
    } catch (e) {
      console.error('Error ocurred during chat.', e);
    }
  };

  protected handleMessageItem = (item: IChatMessageItem) => {
    const msgItem = this.itemManager.createChatMessageItem({
      ...item,
      parent: this,
    });
    this.items.push(msgItem);
    this.onMessageItemEmitter.fire(msgItem);
    return msgItem;
  };

  protected chatStream = async (option: ChatMessageOption) => {
    const { input } = option;
    let current: BaseChatMessageItemModel | undefined = undefined;
    try {
      this.chatService.chatStream(
        { input },
        (item) => {
          current = this.handleMessageItem(item);
        },
        (event: IChatEvent) => {
          if (current) {
            current.handleEventData(event);
          }
        },
      );
    } catch (e) {
      console.error('Error ocurred during stream chat.', e);
    }
  };

  dispose = (): void => {
    this.disposed = true;
    this.onDisposeEmitter.fire();
  };
}
