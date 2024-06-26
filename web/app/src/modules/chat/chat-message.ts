import { inject, prop, transient } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';

import { ChatMessageOption, MessageSenderType, MessageType } from './protocol.js';

@transient()
export class ChatMessage {
  protected axios: AxiosClient;
  option: ChatMessageOption;
  senderId: number;
  senderType?: MessageSenderType;
  messageType?: MessageType;
  chatId: number;
  @prop()
  content: string;
  id: number;
  createdAt?: string;

  constructor(
    @inject(ChatMessageOption) option: ChatMessageOption,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    this.option = option;
    this.axios = axios;
    const {
      senderId,
      senderType = MessageSenderType.HUMAN,
      messageType = MessageType.MARKDOWN,
      chatId,
      content,
      id,
      createdAt,
    } = option;
    this.senderId = senderId;
    this.senderType = senderType;
    this.messageType = messageType;
    this.chatId = chatId;
    this.content = content;
    this.id = id;
    this.createdAt = createdAt;
  }
}
