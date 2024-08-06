import { Syringe } from '@difizen/mana-app';

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
  message_id: number;
  chunk: string;
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
    id: msg.message_id,
    sessionId: msg.session_id,
    agentId,
    messages: items.map(toMessageItem),
    created: msg.gmt_created,
    modified: msg.gmt_modified,
  };
};
