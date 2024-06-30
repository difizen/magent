import { inject, prop, transient } from '@difizen/mana-app';
import type { ParsedEvent } from 'eventsource-parser/stream';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import type { RefObject } from 'react';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';
import { UserManager } from '../user/user-manager.js';

import type { ChatMessage } from './chat-message.js';
import { ChatMessageManager } from './message-manager.js';
import type {
  ChatEventChunk,
  ChatMessageCreate,
  ChatMessageModel,
  ChatMessageOption,
} from './protocol.js';
import { ChatMessageType, ChatOption } from './protocol.js';

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

const msgModelToOption = (msg: ChatMessageModel): ChatMessageOption => {
  return {
    senderId: msg.sender_id,
    senderType: msg.sender_type,
    messageType: msg.message_type,
    chatId: msg.chat_id,
    content: msg.content,
    id: msg.id,
    createdAt: msg.created_at,
    complete: msg.complete,
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

  @prop()
  showToBottomBtn = false;

  protected processingChunk?: ChatMessage;

  /**
   * A container DOM node for messages,
   * making it convenient for scroll control and other functions.
   */
  protected messageListRef?: RefObject<HTMLDivElement>;

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
    setImmediate(() => this.scrollToBottom(true));
  };

  protected getOrCreateMessage = (
    modelOrOption: ChatMessageModel | ChatMessageOption,
  ) => {
    let option: ChatMessageOption;
    if (ChatMessageType.isOption(modelOrOption)) {
      option = modelOrOption;
    } else {
      option = msgModelToOption(modelOrOption);
    }
    const msg = this.messageManager.getOrCreateMessage(option);
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
    setImmediate(this.scrollToBottom);
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
    const url = `api/v1/chats/${this.id!}/messages`;
    const res = await this.axios.post<ReadableStream<Uint8Array>>(url, msg, {
      headers: {
        Accept: 'text/event-stream',
      },
      responseType: 'stream',
      adapter: 'fetch',
    });
    if (res.status === 200) {
      const stream = res.data;
      const reader = stream
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .getReader();

      let alreayDone = false;
      while (!alreayDone) {
        const { value, done } = await reader.read();
        if (done) {
          alreayDone = true;
          break;
        }
        this.handleChatEvent(value);
      }
      if (this.processingChunk) {
        this.processingChunk.complete = true;
        this.processingChunk = undefined;
      }
      return;
    }
  };

  protected handleChatEvent = (e: ParsedEvent | undefined) => {
    if (!e) {
      return;
    }
    try {
      if (e.event === 'message') {
        const newMessageModel: ChatMessageModel = JSON.parse(e.data);
        const message = this.getOrCreateMessage(newMessageModel);
        this.messages = [...this.messages, message];
        setImmediate(() => this.scrollToBottom(true, false));
      }

      if (e.event === 'chunk') {
        const chunk: ChatEventChunk = JSON.parse(e.data);
        const msg = this.messages.find((item) => item.id === chunk.message_id);
        if (msg) {
          this.processingChunk = msg;
          msg.appendChunk(chunk);
          setImmediate(() => this.scrollToBottom(true, false));
        }
      }
    } catch (e) {
      console.warn('[chat] recerved server send event', event);
      console.error(e);
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

  scrollToBottom = (immediately = false, smoothly = true) => {
    const dom = this.messageListRef?.current;
    if (!dom) {
      return;
    }
    const top = dom.scrollHeight - dom.clientHeight;

    // immdiately scroll to bottom
    if (immediately) {
      dom.scrollTop = top;
      return;
    }
    // smoothly scroll to bottom
    dom.scrollTo({
      top,
      behavior: smoothly ? 'smooth' : 'instant',
    });
  };

  onScroll = () => {
    const dom = this.messageListRef?.current;
    if (!dom) {
      return;
    }
    const bottomToTop = dom.scrollTop + dom.clientHeight;
    if (dom.scrollHeight - bottomToTop < 120) {
      this.showToBottomBtn = false;
    } else {
      this.showToBottomBtn = true;
    }
  };

  setMessageListContainer = (domRef: RefObject<HTMLDivElement>) => {
    this.messageListRef = domRef;
  };
}
