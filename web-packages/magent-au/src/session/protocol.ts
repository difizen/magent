import type { ConversationOption } from '@difizen/magent-chat';
import { Syringe } from '@difizen/mana-app';

import type { APIMessage, IAUMessage } from '../au-chat-message/protocol.js';
import { toMessageOption } from '../au-chat-message/protocol.js';

export interface SessionCreate {
  agentId: string;
}
export interface SessionOption extends ConversationOption {
  id: string;
  agentId: string;
  created?: string;
  modified?: string;
  messages?: IAUMessage[];
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
