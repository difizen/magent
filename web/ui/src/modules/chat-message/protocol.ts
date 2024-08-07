import { Syringe } from '@difizen/mana-app';

import type { ChatMessageItem } from './chat-message-item.js';
import type { ChatMessageModel } from './chat-message-model.js';

export type { ChatMessageModel } from './chat-message-model.js';

export type MessageSender = 'AI' | 'HUMAN';
export type MessageType = string;

export interface MessageCreate {
  sessionId: string;
  agentId: string;
  input: string;
  stream?: boolean;
}

export interface MessageItem {
  senderType?: MessageSender;
  content: string;
}

export interface MessageOption {
  id?: number;
  sessionId: string;
  agentId: string;
  messages: MessageItem[];
  created?: string;
  modified?: string;
}

export const ChatMessageType = {
  isCreate(data?: Record<string, any>): data is MessageCreate {
    return typeof data === 'object' && 'input' in data && !('id' in data);
  },
  isMessageOption(data?: Record<string, any>): data is MessageOption {
    return typeof data === 'object' && 'id' in data && 'messages' in data;
  },
};
export type ChatMessageOption = MessageCreate | MessageOption;
export const ChatMessageOption = Syringe.defineToken('ChatMessageOption', {
  multiple: false,
});

export type ChatMessageFactory = (option: ChatMessageOption) => ChatMessageModel;
export const ChatMessageFactory = Syringe.defineToken('ChatMessageFactory', {
  multiple: false,
});

export interface ChatEventChunk {
  agent_id: string;
  output: string;
  type: 'token';
}

export interface APIContentItem {
  type: 'human' | 'ai';
  content: string;
}
export interface APIMessage {
  message_id: number;
  output?: string;
  content: string;
  gmt_created: string;
  gmt_modified: string;
  id: number;
  session_id: string;
}
export const toMessageItem = (item: APIContentItem): MessageItem => {
  return {
    senderType: item.type === 'ai' ? 'AI' : 'HUMAN',
    content: item.content,
  };
};

export const toMessageOption = (msg: APIMessage, agentId: string): MessageOption => {
  let items = [];
  if (msg.content) {
    items = JSON.parse(msg.content);
  }
  return {
    id: msg.message_id || msg.id,
    sessionId: msg.session_id,
    agentId,
    messages: items.map(toMessageItem),
    created: msg.gmt_created,
    modified: msg.gmt_modified,
  };
};

export enum QuestionState {
  SENDING = 'sending', // 发送中
  VALIDATING = 'validating', // 验证中
  FAIL = 'fail', // 发送失败
  SUCCESS = 'success', // 发送完成
}

// 接收消息状态
export enum AnswerState {
  WAITING = 'waiting', // 等待
  RECEIVING = 'receiving', // 接收中
  FAIL = 'fail', // 发送失败
  SUCCESS = 'success', // 发送完成
}

export interface ChatMessageItemOption extends MessageItem {
  created?: string;
}
export const ChatMessageItemOption = Syringe.defineToken('ChatMessageItemOption', {
  multiple: false,
});

export type ChatMessageItemFactory = (option: ChatMessageItemOption) => ChatMessageItem;
export const ChatMessageItemFactory = Syringe.defineToken('ChatMessageItemFactory', {
  multiple: false,
});
