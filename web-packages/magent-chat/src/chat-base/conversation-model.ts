import type { ToAutoFactory } from '@difizen/magent-core';
import { AutoFactoryOption } from '@difizen/magent-core';
import { AsyncModel } from '@difizen/magent-core';
import { autoFactory, toAutoFactory } from '@difizen/magent-core';
import type { Event, Disposable } from '@difizen/mana-app';
import { DisposableCollection, Emitter, inject, prop } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';

import { DefaultChatMessageModel } from './chat-message-model.js';
import { ChatService } from './chat-service.js';
import type { BaseChatMessageModel, IChatMessageItem } from './protocol.js';
import { ConversationOption } from './protocol.js';

@autoFactory()
export class DefaultConversationModel
  extends AsyncModel<DefaultConversationModel, ConversationOption>
  implements Disposable
{
  @inject(toAutoFactory(DefaultChatMessageModel))
  protected messageFactory: ToAutoFactory<typeof DefaultChatMessageModel>;

  @inject(ChatService) protected chatService: ChatService;

  disposed = false;
  onDispose: Event<void>;

  protected option: ConversationOption;

  protected toDispose = new DisposableCollection();
  protected onDisposeEmitter = new Emitter<void>();

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
      const items = this.messages[0].messages;
      if (items.length > 0) {
        return items[0].content;
      }
    }
    return '[新会话]';
  }

  constructor(@inject(AutoFactoryOption) option: ConversationOption) {
    super();
    this.option = option;
  }

  shouldInitFromMeta(option: ConversationOption): boolean {
    return ConversationOption.is(option);
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

  sendMessage = (msg: any) => {
    const message = this.messageFactory({ ...msg, parent: this });
    this.messages.push(message);
  };
}
