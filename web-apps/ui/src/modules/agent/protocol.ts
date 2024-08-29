import { Syringe } from '@difizen/mana-app';

import type { LLMMeta } from '../model/protocol.js';
import type { ToolMeta } from '../tool/protocol.js';

import type { AgentConfig } from './agent-config.js';
import type { AgentModel } from './agent-model.js';

export type { AgentConfig } from './agent-config.js';

export interface PlannerMeta {
  id: string;
  nickname: string;
  members?: AgentModelOption[];
}
export interface PromptMeta {
  introduction: string;
  target: string;
  instruction: string;
}

export interface AgentConfigOption {
  opening_speech?: string;
  llm?: LLMMeta;
  prompt?: PromptMeta;
  memory?: string;
  planner?: PlannerMeta;
  tool?: ToolMeta[];
  knowledge: any[];
}
export const AgentConfigOption = Syringe.defineToken('AgentConfigOption', {
  multiple: false,
});

export type AgentConfigFactory = (options: AgentConfigOption) => AgentConfig;
export const AgentConfigFactory = Syringe.defineToken('AgentConfigFactory', {
  multiple: false,
});

export const PromptMetaType = {
  is(data?: null | Record<string, any>): data is PromptMeta {
    return !!(
      data &&
      'introduction' in data &&
      'target' in data &&
      'instruction' in data
    );
  },
};

export const AgentConfigType = {
  isOption(data?: Record<string, any>): data is AgentConfigOption {
    return !!(data && 'id' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return (
      AgentModelType.isOption(data) &&
      'prompt' in data &&
      typeof data['prompt'] === 'object' &&
      PromptMetaType.is(data['prompt'])
    );
  },
};

export type { AgentModel } from './agent-model.js';

export interface AgentModelOption {
  description?: string;
  avatar?: string;
  nickname?: string;
  id: string;
  opening_speech?: string;
  llm?: LLMMeta;
  prompt?: PromptMeta;
  memory?: string;
  planner?: PlannerMeta;
  tool?: ToolMeta[];
  knowledge?: any[];
}

export const AgentModelOption = Syringe.defineToken('AgentBotOption', {
  multiple: false,
});

export type AgentModelFactory = (options: AgentModelOption) => AgentModel;
export const AgentModelFactory = Syringe.defineToken('AgentModelFactory', {
  multiple: false,
});

export interface AgentModelCreateOption {
  description?: string;
  avatar?: string;
  nickname?: string;
  planner: Partial<PlannerMeta>;
  llm?: Partial<LLMMeta>;
  prompt?: Partial<PromptMeta>;
  id: string;
}

export const AgentModelType = {
  isOption(data?: Record<string, any>): data is AgentModelOption {
    return !!(data && 'id' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return AgentModelType.isOption(data) && 'nickname' in data && 'planner' in data;
  },
};

export const AgentInstance = Syringe.defineToken('AgentInstance', { multiple: false });
