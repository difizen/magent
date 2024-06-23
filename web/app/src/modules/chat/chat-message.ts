import { inject, prop, transient } from '@difizen/mana-app';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';

import {
  ChatMessageType,
  type ChatMessageOption,
  type MessageSenderType,
  type MessageType,
} from './protocol.js';

@transient()
export class ChatMessage extends AsyncModel<ChatMessage, ChatMessageOption> {
  @inject(AxiosClient) axios: AxiosClient;

  senderId: number;
  senderType?: MessageSenderType;
  messageType?: MessageType;
  chatId: number;
  @prop()
  content: string;
  id: number;
  createdAt: string;

  override shouldInitFromMeta(option: ChatMessageOption): boolean {
    return ChatMessageType.isFullOption(option);
  }
  override fetchInfo(option: ChatMessageOption): Promise<void> {
    throw new Error('not implement');
  }
}
