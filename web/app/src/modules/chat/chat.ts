import { inject, prop, transient } from '@difizen/mana-app';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';
import { UserManager } from '../user/user-manager.js';

import type { ChatMessage } from './chat-message.js';
import { ChatMessageManager } from './message-manager.js';
import type {
  ChatMessageCreate,
  ChatMessageModel,
  ChatMessageOption,
} from './protocol.js';
import { ChatOption } from './protocol.js';

export interface ChatReply {
  reply: ChatMessageModel[];
  send: ChatMessageModel;
}

export interface ChatModel {
  id: number;
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
    chatId: msg.chat_id,
    content: msg.content,
    id: msg.id,
    createdAt: msg.created_at,
  };
};

@transient()
export class Chat extends AsyncModel<Chat, ChatOption> {
  @inject(UserManager) userManager: UserManager;
  id?: number;
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
    let url = `api/v1/chats/with_bot/${option.botId}/online`;
    switch (env) {
      case 'debug':
        url = `api/v1/chats/with_bot/${option.botId}/debug`;
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
      this.id = model.id;
    }
  };

  protected getOrCreateMessage = (option: ChatMessageModel) => {
    const msg = this.messageManager.getOrCreateMessage(msgToOption(option));
    return msg;
  };

  sendMessage = async (msgContent: string) => {
    if (!this.id) {
      return;
    }
    const user = await this.userManager.currentReady;
    const msg: ChatMessageCreate = {
      sender_id: parseInt(user.id, 10),
      chat_id: this.id,
      content: msgContent,
    };
    return this.doSendMessage(msg);
  };

  protected doSendMessage = async (msg: ChatMessageCreate) => {
    const url = `api/v1/chats/${this.id!}/messages`;
    const res = await this.axios.post<ChatReply>(url, msg);
    if (res.status === 200) {
      const model = res.data;
      const send = this.getOrCreateMessage(model.send);
      const replys = model.reply.map(this.getOrCreateMessage);
      this.messages = [...this.messages, send, ...replys];
    }
  };

  sendMessageStream = async (msgContent: string) => {
    if (!this.id) {
      return;
    }
    const user = await this.userManager.currentReady;
    const msg: ChatMessageCreate = {
      sender_id: parseInt(user.id, 10),
      chat_id: this.id,
      content: msgContent,
    };
    return this.doSendMessageStream(msg);
  };

  protected doSendMessageStream = async (msg: ChatMessageCreate) => {
    const url = `api/v1/chats/${this.id!}/messages/stream`;
    const res = await this.axios.post(url, msg, { responseType: 'stream' });
    if (res.status === 200) {
      const stream = res.data;
      // stream.on('data', (data) => {
      //   console.log(data);
      // });

      // stream.on('end', () => {
      //   console.log('stream done');
      // });
    }
  };

  clear = async () => {
    if (!this.id) {
      return;
    }
    const url = `api/v1/chats/${this.id!}/messages`;
    const res = await this.axios.delete<number>(url);
    if (res.status === 200) {
      this.messages = [];
      return true;
    }
    return false;
  };
}
