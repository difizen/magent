import { autoFactory, AutoFactoryOption } from '@difizen/magent-core';
import type { Event, Disposable } from '@difizen/mana-app';
import { Deferred, Emitter, inject, prop } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { AIChatMessageItemModel } from './ai-message-item-model.js';
import { ChatMessageItemManager } from './chat-message-item-manager.js';
import type { ChatMessageItemOption } from './chat-message-item-model.js';
import type { ITokenSummary } from './chat-messasge-summary.js';
import { ChatMessageSummaryProvider } from './chat-messasge-summary.js';
import { ChatService } from './chat-service.js';
import type {
  IChatMessage,
  BaseChatMessageItemModel,
  BaseConversationModel,
  BaseChatMessageSummary,
  IChatEvent,
  IChatMessageItem,
} from './protocol.js';
import { ChatEvent } from './protocol.js';
import { ChatProtocol } from './protocol.js';

export interface ChatMessageOption extends IChatMessage {
  parent: BaseConversationModel;
}

@autoFactory()
export class DefaultChatMessageModel implements Disposable {
  @inject(ChatService) protected chatService: ChatService;
  @inject(ChatMessageSummaryProvider)
  protected summaryProvider: ChatMessageSummaryProvider;

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

  @prop()
  recommentQustions?: string[];

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
    setImmediate(() => {
      this.initMessageItems(option);
    });
  }

  protected initMessageItems = <T extends ChatMessageOption>(option: T) => {
    if (ChatProtocol.isChatMessageCreate(option)) {
      this.send(option);
    }
    if (ChatProtocol.isChatMessageRecord(option)) {
      this.updateMeta(option);
    }
  };

  updateMeta<T extends ChatMessageOption>(option: T) {
    this.id = option.id || dayjs().unix().toString();
    if (option.created) {
      this.created = dayjs(option.created);
    }
    if (option.modified) {
      this.modified = dayjs(option.modified);
    }
    if (option.messages && option.messages.length > 0) {
      const items = option.messages.map((item) =>
        this.itemManager.createChatMessageItem(this.toChatMessageItemOption(item)),
      );
      this.items = items;
      this.onMessageItemEmitter.fire(items[items.length - 1]);
    }
  }

  protected createTokenSummary(opt: ITokenSummary) {
    return this.summaryProvider.create(opt);
  }

  protected toChatMessageItemOption(item: IChatMessageItem): ChatMessageItemOption {
    return {
      parent: this,
      content: item.content,
      sender: item.sender,
    };
  }

  protected async send<T extends ChatMessageOption>(option: T) {
    if (!ChatProtocol.isChatMessageCreate(option)) {
      return;
    }
    const { input, stream = true } = option;
    this.sending = true;

    const human = this.itemManager.createChatMessageItem(
      this.toChatMessageItemOption({ sender: { type: 'HUMAN' }, content: input }),
    );

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
  }

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

  protected handleMessageItem(item: IChatMessageItem) {
    const msgItem = this.itemManager.createChatMessageItem(
      this.toChatMessageItemOption(item),
    );
    this.items.push(msgItem);
    this.onMessageItemEmitter.fire(msgItem);
    return msgItem;
  }

  protected handleChatEvent(event: IChatEvent, item: BaseChatMessageItemModel) {
    if (item instanceof AIChatMessageItemModel) {
      if (ChatEvent.isResult(event)) {
        this.updateSummary({});
      }
      item.handleEventData(event);
      this.onMessageItemEmitter.fire(item);
    }
  }

  protected updateSummary(opt: ITokenSummary) {
    if (!this.token) {
      this.token = this.summaryProvider.create(opt);
    } else {
      this.token.fromMeta(opt);
    }
  }

  protected chatStream = async (option: ChatMessageOption) => {
    const { input } = option;
    let current: BaseChatMessageItemModel | undefined = undefined;
    try {
      this.chatService.chatStream(
        { ...option, content: input },
        (item) => {
          current = this.handleMessageItem(item);
        },
        (event: IChatEvent) => {
          if (current) {
            this.handleChatEvent(event, current);
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
