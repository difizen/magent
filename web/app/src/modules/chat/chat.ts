import { inject, prop, transient } from '@difizen/mana-app';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';

import type { ChatMessage } from './chat-message.js';
import { ChatMessageManager } from './message-manager.js';
import type { ChatMessageOption, MessageSenderType, MessageType } from './protocol.js';
import { ChatOption } from './protocol.js';

export interface ChatMessageModel {
  id: number;
  sender_id: number;
  sender_type: MessageSenderType;
  message_type: MessageType;
  conversation_id: number;
  content: string;
  created_at: string;
}
export interface ChatModel {
  messages: ChatMessageModel[];
  bot_id: number;
  bot_config_id: number;
  created_by: number;
  created_at: string;
}

const msgToOption = (msg: ChatMessageModel): ChatMessageOption => {
  return {
    senderId: msg.sender_id,
    senderType: msg.sender_type,
    messageType: msg.message_type,
    chatId: msg.conversation_id,
    content: msg.content,
    id: msg.id.toString(),
    createdAt: msg.created_at,
  };
};

@transient()
export class Chat extends AsyncModel<Chat, ChatOption> {
  @inject(AxiosClient) axios: AxiosClient;
  @inject(ChatMessageManager) messageManager: ChatMessageManager;
  option: ChatOption;
  botId: string;
  botConfigId?: string;
  createdBy?: string;

  @prop()
  messages: ChatMessage[] = [];

  constructor(@inject(ChatOption) option: ChatOption) {
    super();
    this.option = option;
    this.botId = option.botId;
  }

  override shouldInitFromMeta(option: ChatOption): boolean {
    return false;
  }
  override fetchInfo = async (option: ChatOption): Promise<void> => {
    const res = await this.axios.get<ChatModel>(`api/v1/conversation/${option.botId}`);
    if (res.status === 200) {
      const model = res.data;
      this.botConfigId = model.bot_config_id.toString();
      this.createdBy = model.created_by.toString();
      this.messages = model.messages.map((option) =>
        this.messageManager.getOrCreateMessage(msgToOption(option)),
      );
    }
  };
}
