import type { Disposable, Event } from '@difizen/mana-app';
import { Emitter } from '@difizen/mana-app';
import { inject, prop, transient } from '@difizen/mana-app';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';
import { ChatMessageManager } from '../chat-message/chat-message-manager.js';
import type { ChatMessageModel, MessageCreate } from '../chat-message/protocol.js';

import type { APISession } from './protocol.js';
import { SessionOption, SessionOptionType, toSessionOption } from './protocol.js';

@transient()
export class SessionModel
  extends AsyncModel<SessionModel, SessionOption>
  implements Disposable
{
  chatMessage: ChatMessageManager;
  axios: AxiosClient;
  id?: string;
  agentId: string;
  protected created?: string;
  protected modified?: string;
  option: SessionOption;

  disposed = false;
  onDispose: Event<void>;
  protected onDisposeEmitter = new Emitter<void>();

  @prop()
  messages: ChatMessageModel[] = [];

  constructor(
    @inject(SessionOption) option: SessionOption,
    @inject(AxiosClient) axios: AxiosClient,
    @inject(ChatMessageManager) chatMessage: ChatMessageManager,
  ) {
    super();
    this.onDispose = this.onDisposeEmitter.event;
    this.option = option;
    this.axios = axios;
    this.chatMessage = chatMessage;
    this.initialize(option);
  }

  dispose = (): void => {
    this.disposed = true;
    this.onDisposeEmitter.fire();
  };

  shouldInitFromMeta(option: SessionOption): boolean {
    return SessionOptionType.isFullOption(option);
  }

  fetchInfo = async (option: SessionOption): Promise<void> => {
    const res = await this.axios.get<APISession>(`/api/v1/agents/${option.id}`);
    if (res.status === 200) {
      this.fromMeta(toSessionOption(res.data));
    }
  };

  protected override fromMeta(option: SessionOption = this.option) {
    this.id = option.id;
    this.agentId = option.agentId;
    this.created = option.created;
    this.modified = option.modified;

    this.messages =
      option.messages?.map((opt) => this.chatMessage.createMessage(opt)) || [];
    super.fromMeta(option);
  }

  chat(msg: MessageCreate) {
    const message = this.chatMessage.createMessage(msg);
    this.messages.push(message);
  }
}
