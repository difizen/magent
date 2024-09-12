import { Syringe } from '@difizen/mana-app';

import type { ChatMessage } from './chat-message.js';
import type { Chat } from './chat.js';

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

export enum MessageSenderType {
  AI = 'ai',
  HUMAN = 'human',
  SYSTEM = 'system',
}

export enum MessageType {
  MARKDOWN = 'markdown',
  TEXT = 'text',
}

export interface ChatMessageCreate {
  sender_id: number;
  sender_type?: MessageSenderType;
  message_type?: MessageType;
  chat_id: number;
  content: string;
}

export interface ChatOption {
  botId: number;
  userId: number;
  env?: 'debug' | 'online';
}
export const ChatOption = Syringe.defineToken('ChatOption');
export type ChatFactory = (option: ChatOption) => Chat;
export const ChatFactory = Syringe.defineToken('ChatFactory');

export interface ChatMessageModel extends ChatMessageCreate {
  id: number;
  sender_type: MessageSenderType;
  message_type: MessageType;
  created_at: string;
  complete?: boolean;
}
export interface ChatMessageOption {
  id: number;
  senderType: MessageSenderType;
  messageType: MessageType;
  createdAt: string;
  senderId: number;
  chatId: number;
  content: string;
  complete?: boolean;
}

export const ChatMessageOption = Syringe.defineToken('ChatMessageOption');
export type ChatMessageFactory = (option: ChatMessageOption) => ChatMessage;
export const ChatMessageFactory = Syringe.defineToken('ChatMessageFactory');

export const ChatMessageType = {
  isOption(data?: Record<string, any>): data is ChatMessageOption {
    return !!(data && 'content' in data && 'senderId' in data && 'chatId' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return ChatMessageType.isOption(data) && 'id' in data;
  },
};

export type { ChatMessage } from './chat-message.js';
export type { Chat } from './chat.js';

export const ChatInstance = Syringe.defineToken('ChatInstance', { multiple: false });

export interface ChatEventChunk {
  message_id: number;
  chunk: string;
}
