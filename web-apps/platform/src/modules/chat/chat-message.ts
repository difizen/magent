import { inject, prop, transient } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { AxiosClient } from '../axios-client/index.js';
import { UserManager } from '../user/user-manager.js';
import type { User } from '../user/user.js';

import type { AnswerState, ChatEventChunk, QuestionState } from './protocol.js';
import { ChatMessageOption, MessageSenderType, MessageType } from './protocol.js';

@transient()
export class ChatMessage {
  protected axios: AxiosClient;
  protected userManager: UserManager;
  option: ChatMessageOption;
  senderId: number;
  senderType?: MessageSenderType;
  messageType?: MessageType;
  chatId: number;
  @prop()
  content: string;
  id: number;
  createdAt?: Dayjs;
  @prop()
  complete?: boolean = true;

  @prop()
  state: QuestionState | AnswerState;

  @prop()
  sender?: User;

  constructor(
    @inject(ChatMessageOption) option: ChatMessageOption,
    @inject(AxiosClient) axios: AxiosClient,
    @inject(UserManager) userManager: UserManager,
  ) {
    this.option = option;
    this.axios = axios;
    this.userManager = userManager;
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
    this.createdAt = dayjs(createdAt);
    if (option.complete !== undefined) {
      this.complete = !!option.complete;
    }
    this.getSender();
  }

  protected getSender() {
    if (this.senderType === MessageSenderType.HUMAN && this.senderId) {
      this.sender = this.userManager.getOrCreate({ id: this.senderId.toString() });
    }
  }

  appendChunk(e: ChatEventChunk) {
    this.content = `${this.content}${e.chunk}`;
  }
}
