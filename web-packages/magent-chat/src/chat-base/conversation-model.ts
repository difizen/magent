import { AutoFactoryOption } from '@difizen/magent-core';
import { AsyncModel } from '@difizen/magent-core';
import { autoFactory } from '@difizen/magent-core';
import type { Event, Disposable } from '@difizen/mana-app';
import { equals } from '@difizen/mana-app';
import { DisposableCollection, Emitter, inject, prop } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { ChatMessageManager } from './chat-message-manager.js';
import type { ChatMessageOption } from './chat-message-model.js';
import { ChatService } from './chat-service.js';
import type {
  BaseChatMessageItemModel,
  BaseChatMessageModel,
  IChatMessage,
} from './protocol.js';
import { ConversationOption } from './protocol.js';

@autoFactory()
export class DefaultConversationModel
  extends AsyncModel<DefaultConversationModel, ConversationOption>
  implements Disposable
{
  @inject(ChatMessageManager)
  protected messageManager: ChatMessageManager;

  @inject(ChatService) protected chatService: ChatService;

  protected option: ConversationOption;

  protected toDispose = new DisposableCollection();

  disposed = false;

  protected onDisposeEmitter = new Emitter<void>();
  get onDispose(): Event<void> {
    return this.onDisposeEmitter.event;
  }

  protected onMessageEmitter = new Emitter<BaseChatMessageItemModel>();
  get onMessage(): Event<BaseChatMessageItemModel> {
    return this.onMessageEmitter.event;
  }

  id?: string;

  @prop()
  created?: Dayjs;

  @prop()
  modified?: Dayjs;

  @prop()
  messages: BaseChatMessageModel[] = [];

  @prop()
  protected _title: string;

  get title(): string {
    return this._title;
  }
  set title(v: string) {
    this._title = v;
  }

  get previewTitle(): string {
    if (this.messages && this.messages.length > 0) {
      const items = this.messages[0].items;
      if (items.length > 0) {
        return items[0].content;
      }
    }
    return '[新会话]';
  }

  constructor(@inject(AutoFactoryOption) option: ConversationOption) {
    super();
    this.option = option;
    this.initialize(option);
  }

  shouldInitFromMeta(option: ConversationOption): boolean {
    return ConversationOption.isFull(option);
  }

  protected override fromMeta(option: ConversationOption = this.option) {
    this.id = option.id;
    this.created = dayjs(option.created);
    this.modified = dayjs(option.modified);

    this.messages =
      option.messages?.map((opt) =>
        this.messageManager.getOrCreate({ ...opt, parent: this }),
      ) || [];
    super.fromMeta(option);
  }

  async fetchInfo(option: ConversationOption): Promise<void> {
    const options = await this.chatService.getConversation(option);
    if (options) {
      this.fromMeta(options);
    }
  }

  dispose = (): void => {
    this.disposed = true;
    this.onDisposeEmitter.fire();
    this.toDispose.dispose();
  };

  protected toChatMessageOption(msg: IChatMessage): ChatMessageOption {
    return {
      ...msg,
      parent: this,
    };
  }

  protected disposeMessage = (msg: BaseChatMessageModel) => {
    this.messages = this.messages.filter((item) => !equals(item, msg));
  };

  sendMessage = (msg: IChatMessage) => {
    const message = this.messageManager.getOrCreate(this.toChatMessageOption(msg));
    const toDispose = message.onMessageItem((e) => {
      this.onMessageEmitter.fire(e);
    });
    this.toDispose.push(toDispose);
    message.onDispose(() => {
      toDispose.dispose();
      this.disposeMessage(message);
    });
    this.messages.push(message);
  };
}
