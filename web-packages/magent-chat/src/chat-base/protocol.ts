import type { PrioritizedContribution } from '@difizen/magent-core';
import { Syringe } from '@difizen/mana-app';

import type { DefaultChatMessageItemModel } from './chat-message-item-model.js';
import type { DefaultChatMessageModel } from './chat-message-model.js';
import type { DefaultChatMessageSummary } from './chat-messasge-summary.js';
import type { DefaultConversationModel } from './conversation-model.js';

export interface IChatMessageSender {
  id?: string;
  type: 'HUMAN' | 'AI';
}

export interface IChatMessageItem {
  /**
   * 唯一标识
   */
  id?: string;
  sender: IChatMessageSender;
  content: string;
  created?: string;
  modified?: string;

  [key: string]: any;
}

export interface IChatMessage {
  id?: string;
  messages: IChatMessageItem[];
  created?: string;
  modified?: string;
  token?: any;

  [key: string]: any;
}

export interface IConversation {
  id?: string;
  created?: string;
  modified?: string;
  messages?: IChatMessage[];

  [key: string]: any;
}

export type BaseChatMessageItemModel = DefaultChatMessageItemModel;
export type BaseChatMessageModel = DefaultChatMessageModel;
export type BaseConversationModel = DefaultConversationModel;
export type BaseChatMessageSummary = DefaultChatMessageSummary;

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

export type ChatMessageItemContribution<
  O extends IChatMessageItem = IChatMessageItem,
  T extends BaseChatMessageItemModel = BaseChatMessageItemModel,
> = PrioritizedContribution<O, T>;

export const ChatMessageItemContribution = Syringe.defineToken(
  'ChatMessageItemContribution',
);

export interface IChatEvent {
  type: string;
  [key: string]: any;
}
export interface ChatEventChunk extends IChatEvent {
  output: string;
  type: 'token';
  [key: string]: any;
}

export interface ErrorMessage {
  message: string;
}

export interface ChatEventError extends IChatEvent, ErrorMessage {
  type: 'error';
}

export interface ConversationOption extends IConversation {
  id: string;
}

export const ConversationOption = {
  is(data?: Record<string, any>): data is ConversationOption {
    return !!(data && 'id' in data);
  },
  isFull(data?: Record<string, any>): data is ConversationOption {
    return !!(data && 'id' in data && 'messages' in data);
  },
};
