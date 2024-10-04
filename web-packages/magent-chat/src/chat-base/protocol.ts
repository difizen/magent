import type { DefaultChatMessageItemModel } from './chat-message-item-model.js';
import type { DefaultChatMessageModel } from './chat-message-model.js';
import type { DefaultConversationModel } from './conversation-model.js';

export interface IChatMessageItem {
  /**
   * 标识
   */
  id?: number;
  senderId: string;
  content: string;
  created?: string;
  modified?: string;
}

export interface IChatMessage {
  messages: IChatMessageItem[];
  id?: number;
  created?: string;
  modified?: string;
  token?: any;
}

export interface IConversation {
  id?: string;
  created?: string;
  modified?: string;
  messages?: IChatMessage[];
}

export type BaseChatMessageItemModel = DefaultChatMessageItemModel;
export type BaseChatMessageModel = DefaultChatMessageModel;
export type BaseConversationModel = DefaultConversationModel;
