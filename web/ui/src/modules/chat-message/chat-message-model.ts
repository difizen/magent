import type { Disposable, Event } from '@difizen/mana-app';
import { Emitter } from '@difizen/mana-app';
import { inject, prop, transient } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { AxiosClient } from '../axios-client/index.js';

import type {
  APIMessage,
  MessageCreate,
  MessageItem,
  MessageOption,
} from './protocol.js';
import { ChatMessageType } from './protocol.js';
import { ChatMessageOption } from './protocol.js';

@transient()
export class ChatMessageModel implements Disposable {
  protected axios: AxiosClient;
  option: ChatMessageOption;

  id?: number;
  agentId: string;
  sessionId: string;

  @prop()
  messages: MessageItem[] = [];
  @prop()
  created?: Dayjs;

  @prop()
  modified?: Dayjs;

  @prop()
  complete?: boolean = true;

  @prop()
  sending?: boolean = false;

  disposed = false;
  onDispose: Event<void>;
  protected onDisposeEmitter = new Emitter<void>();

  constructor(
    @inject(ChatMessageOption) option: ChatMessageOption,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    this.option = option;
    this.axios = axios;
    if (ChatMessageType.isCreate(option)) {
      this.send(option);
    }
    if (ChatMessageType.isMessageOption(option)) {
      this.updateMeta(option);
    }
  }

  dispose = (): void => {
    this.disposed = true;
    this.onDisposeEmitter.fire();
  };

  updateMeta = (option: MessageOption) => {
    this.id = option.id;
    this.agentId = option.agentId;
    this.sessionId = option.sessionId;
    this.messages = option.messages;
    if (option.created) {
      this.created = dayjs(option.created);
    }
    if (option.modified) {
      this.modified = dayjs(option.modified);
    }
  };

  send = async (option: MessageCreate) => {
    this.sending = true;

    const opt: MessageOption = {
      ...option,
      messages: [
        {
          senderType: 'HUMAN',
          content: option.input,
        },
      ],
    };

    this.updateMeta(opt);

    const res = await this.axios.post<APIMessage>(
      `/api/v1/agents/${option.agentId}/chat`,
      {
        agent_id: option.agentId,
        session_id: option.sessionId,
        input: option.input,
      },
    );
    if (res.status === 200) {
      const data = res.data;
      this.id = data.message_id;
      this.created = dayjs(data.gmt_created);
      this.modified = dayjs(data.gmt_modified);
      if (res.data.output) {
        this.messages.push({
          senderType: 'AI',
          content: res.data.output,
        });
      }
    }
    this.sending = false;
  };
}
