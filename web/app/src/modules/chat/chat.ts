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
  messageManager: ChatMessageManager;
  axios: AxiosClient;
  option: ChatOption;
  botId: string;
  botConfigId?: string;
  createdBy?: string;

  @prop()
  messages: ChatMessage[] = [];

  constructor(
    @inject(ChatOption) option: ChatOption,
    @inject(AxiosClient) axios: AxiosClient,
    @inject(ChatMessageManager) messageManager: ChatMessageManager,
  ) {
    super();
    this.axios = axios;
    this.messageManager = messageManager;
    this.option = option;
    this.botId = option.botId;
    this.initialize(option);
  }

  override shouldInitFromMeta(option: ChatOption): boolean {
    return false;
  }
  override fetchInfo = async (option: ChatOption): Promise<void> => {
    const { env = 'debug' } = option;
    let url = `api/v1/conversation/${option.botId}`;
    switch (env) {
      case 'debug':
        url = `api/v1/conversation/${option.botId}/debug`;
        break;
      case 'online':
        break;
      default:
        break;
    }
    const res = await this.axios.get<ChatModel>(url);
    if (res.status === 200) {
      const model = res.data;
      this.botConfigId = model.bot_config_id.toString();
      this.createdBy = model.created_by.toString();
      this.messages = model.messages.map(this.getOrCreateMessage);
    }
  };

  protected getOrCreateMessage = (option: ChatMessageModel) => {
    const msg = this.messageManager.getOrCreateMessage(msgToOption(option));
    return msg;
  };
}
