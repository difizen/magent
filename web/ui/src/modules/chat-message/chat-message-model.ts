import { inject, prop, transient } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';

import { AxiosClient } from '../axios-client/index.js';

import type { MessageCreate, MessageItem, MessageOption } from './protocol.js';
import { ChatMessageType } from './protocol.js';
import { ChatMessageOption } from './protocol.js';

@transient()
export class ChatMessageModel {
  protected axios: AxiosClient;
  option: ChatMessageOption;

  id: number;
  agentId: string;
  sessionId: string;
  @prop()
  messages: MessageItem[];
  @prop()
  created?: Dayjs;

  @prop()
  modified?: Dayjs;
  @prop()
  complete?: boolean = true;

  @prop()
  sending?: boolean = false;

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

  updateMeta = (option: MessageOption) => {
    this.id = option.id;
    this.agentId = option.agentId;
    this.sessionId = option.sessionId;
    this.messages = option.messages;
  };

  send = async (option: MessageCreate) => {
    this.sending = true;
    const res = await this.axios.post<MessageOption>(
      `/api/v1/agents/${option.agentId}/chat`,
      option,
    );
    if (res.data.id) {
      this.updateMeta(res.data);
    }
    this.sending = false;
  };
}
