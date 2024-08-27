import { Syringe } from '@difizen/mana-app';

import type { APIMessage, ChatMessageOption } from '../chat-message/protocol.js';
import { toMessageOption } from '../chat-message/protocol.js';

import type { SessionModel } from './session-model.js';

export const SessionOption = Syringe.defineToken('SessionOption', { multiple: false });

export interface SessionCreate {
  agentId: string;
}
export interface SessionOption {
  id: string;
  agentId: string;
  created?: string;
  modified?: string;
  messages?: ChatMessageOption[];
}

export const SessionOptionType = {
  isOption(data?: Record<string, any>): data is SessionOption {
    return !!(data && 'agentId' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return SessionOptionType.isOption(data) && 'id' in data && 'messages' in data;
  },
};

export type { SessionModel } from './session-model.js';
export const SessionFactory = Syringe.defineToken('SessionFactory', {
  multiple: false,
});
export type SessionFactory = (option: SessionOption) => SessionModel;

export const SessionInstance = Syringe.defineToken('SessionInstance', {
  multiple: false,
});

export interface APISession {
  agent_id: string;
  gmt_created: string;
  gmt_modified: string;
  id: string;
  messages: APIMessage[];
}

export const toSessionOption = (item: APISession): SessionOption => {
  return {
    id: item.id,
    agentId: item.agent_id,
    created: item.gmt_created,
    modified: item.gmt_modified,
    messages: item.messages.map((i) => toMessageOption(i, item.agent_id)),
  };
};
