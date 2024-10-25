/* eslint-disable no-unused-vars */
import type { PrioritizedContribution } from '@difizen/magent-core';
import { Syringe } from '@difizen/mana-app';

import type { DefaultChatMessageItemModel } from './chat-message-item-model.js';
import type { DefaultChatMessageModel } from './chat-message-model.js';
import type { DefaultChatMessageSummary } from './chat-messasge-summary.js';
import type { DefaultConversationModel } from './conversation-model.js';

export interface IChatMessageSender {
  id?: string;
  type: 'HUMAN' | 'AI';
  avatar?: string;
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

export interface IChatMessageCreate {
  id: string;
  input: string;
  stream?: boolean;
  [key: string]: any;
}

export interface IChatMessageRecord {
  id: string;
  created?: string;
  messages: IChatMessageItem[];
  modified?: string;
  token?: any;
  stream?: boolean;
  [key: string]: any;
}
export interface IChatMessage {
  id?: string;
  created?: string;
  input?: string;
  messages?: IChatMessageItem[];
  modified?: string;
  stream?: boolean;
  token?: any;
  [key: string]: any;
}
export const ChatProtocol = {
  isChatMessageCreate: (data: IChatMessage): data is IChatMessageCreate => {
    return !!data && !('id' in data) && 'input' in data;
  },
  isChatMessageRecord: (data: IChatMessage): data is IChatMessageRecord => {
    return !!data && 'id' in data && 'messages' in data;
  },
};

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
  type: 'chunk';
  [key: string]: any;
}

export interface ErrorMessage {
  message: string;
}

export interface ChatEventError extends IChatEvent, ErrorMessage {
  type: 'error';
}

export interface ChatEventDone extends IChatEvent {
  type: 'done';
}
export interface ChatEventResult extends IChatEvent {
  output: string;
  type: 'result';
}

export const ChatEvent = {
  isChunk: (event: IChatEvent): event is ChatEventChunk => {
    return !!event && event.type === 'chunk';
  },
  isError: (event: IChatEvent): event is ChatEventError => {
    return !!event && event.type === 'error';
  },

  isResult: (e: IChatEvent): e is ChatEventResult => {
    return !!e && e.type === 'result';
  },
  isDone: (event: IChatEvent): event is ChatEventDone => {
    return !!event && event.type === 'done';
  },

  format: (
    e: string,
    data: any,
  ): ChatEventResult | ChatEventChunk | ChatEventError | ChatEventDone => {
    switch (e) {
      case 'chunk':
        return { ...data, type: 'chunk' };
      case 'result':
        return { ...data, type: 'result' };
      case 'error':
        return { ...data, type: 'error' };
      case 'done':
        return { ...data, type: 'done' };
    }
    return data;
  },
};

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
