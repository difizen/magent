/* eslint-disable no-unused-vars */
import type {
  ChatEventChunk,
  ChatEventDone,
  ChatEventError,
  ChatMessageItemOption,
  IChatEvent,
  IChatMessage,
} from '@difizen/magent-chat';
import type { ChatMessageOption, IChatMessageItem } from '@difizen/magent-chat';

export type { AUChatMessageModel } from './chat-message-model.js';

export type MessageSender = 'AI' | 'HUMAN';
export type MessageType = string;

export interface AUMessageCreate extends ChatMessageOption {
  sessionId: string;
  agentId: string;
  input: string;
  stream?: boolean;
}

export interface StepContent {
  currentStep: number; // 0-4
  roundStartsAt: number; // 0-4
  planningContent: string;
  executingContent: ChatEventStepQA[];
  expressingContent: string;
  reviewingContent: string;
}

export interface IAUMessage extends IChatMessage {
  sessionId: string;
  agentId: string;
}

export interface AUMessageOption extends ChatMessageOption {
  sessionId: string;
  agentId: string;
}

export const AUChatMessageType = {
  isCreate(data?: Record<string, any>): data is AUMessageCreate {
    return typeof data === 'object' && 'input' in data && !('id' in data);
  },
  isMessageOption(data?: Record<string, any>): data is AUMessageOption {
    return typeof data === 'object' && 'id' in data && 'messages' in data;
  },
};
export type AUChatMessageOption = AUMessageCreate | AUMessageOption;

export interface APIContentItem {
  type: 'human' | 'ai';
  content: string;
  gmt_created: string;
  gmt_modified: string;
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
export const toMessageItem = (item: APIContentItem): IChatMessageItem => {
  return {
    sender: { type: item.type === 'ai' ? 'AI' : 'HUMAN' },
    content: item.content,
  };
};

export const toMessageOption = (msg: APIMessage, agentId: string): IAUMessage => {
  let items = [];
  if (msg.content) {
    items = JSON.parse(msg.content);
  }
  return {
    id: msg.message_id?.toString() || msg.id?.toString(),
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

export interface AUChatMessageItemOption extends ChatMessageItemOption {
  created?: string;
  planner?: string;
  agentId: string;
}

export interface ChainItem {
  source: string;
  type: string;
}

export interface ChatTokenUsage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}
export interface ChatEventResult extends IChatEvent {
  response_time: number;
  message_id: number;
  session_id: string;
  output: string;
  start_time: string;
  end_time: string;
  invocation_chain: ChainItem[];
  token_usage: ChatTokenUsage;
  type: 'result';
}
export interface ChatEventStep {
  agent_id: string;
  output: (string | ChatEventStepQA)[] | string;
  type: 'steps';
}

export interface ChatEventStepQA {
  input: string;
  output: string;
}

export const AUChatEvent = {
  isResult: (e: IChatEvent): e is ChatEventResult => {
    return !!e && e.type === 'result';
  },
  isStep: (e: IChatEvent): e is ChatEventStep => {
    return !!e && e.type === 'steps';
  },
  format: (
    e: string,
    data: any,
  ):
    | ChatEventResult
    | ChatEventStep
    | ChatEventChunk
    | ChatEventError
    | ChatEventDone => {
    switch (e) {
      case 'chunk':
        return { ...data, type: 'chunk' };
      case 'result':
        return { ...data, type: 'result' };
      case 'steps':
        return { ...data, type: 'steps' };
      case 'error':
        return { ...data, type: 'error' };
      case 'done':
        return { ...data, type: 'done' };
    }
    return data;
  },
};
