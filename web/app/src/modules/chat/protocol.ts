import { Syringe } from '@difizen/mana-app';

import type { ChatMessage } from './chat-message.js';
import type { Chat } from './chat.js';

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
  senderId: number;
  senderType?: MessageSenderType;
  messageType?: MessageType;
  chatId: number;
  content: string;
}

export interface ChatOption {
  botId: string;
  userId: string;
  env?: 'debug' | 'online';
}
export const ChatOption = Syringe.defineToken('ChatOption');
export type ChatFactory = (option: ChatOption) => Chat;
export const ChatFactory = Syringe.defineToken('ChatFactory');

export interface ChatMessageOption extends ChatMessageCreate {
  id: string;
  createdAt?: string;
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
