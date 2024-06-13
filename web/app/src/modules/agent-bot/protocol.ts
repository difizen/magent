import { Syringe } from '@difizen/mana-app';

import type { AgentBot } from './agent-bot.js';
import type { AgentConfig } from './agent-config.js';

export interface AgentConfigToolMeta {
  key: string;
  [key: string]: any;
}
export interface AgentConfigDatasetMeta {
  key: string;
  [key: string]: any;
}
export interface AgentConfigModelMeta {
  key: string;
  [key: string]: any;
}
export interface AgentConfigMeta {
  persona: string;
  tools: AgentConfigToolMeta[];
  datasets: AgentConfigDatasetMeta[];
  model: AgentConfigModelMeta;
  [key: string]: any;
}

export type { AgentConfig } from './agent-config.js';

export const AgentConfigOption = Syringe.defineToken('AgentConfigOption', {
  multiple: false,
});

export interface AgentConfigOption {
  id: number;
  status?: AgentConfigStatus;
  config?: Partial<AgentConfigMeta>;
}

export type AgentConfigFactory = (options: AgentConfigOption) => AgentConfig;
export const AgentConfigFactory = Syringe.defineToken('AgentConfigFactory', {
  multiple: false,
});

export const AgentConfigType = {
  isOption(data?: Record<string, any>): data is AgentConfigOption {
    return !!(data && 'id' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return AgentBotType.isOption(data) && 'config' in data;
  },
};

export type { AgentBot } from './agent-bot.js';

export interface AgentBotMeta {
  name: string;
  avatar: string;
}

export interface AgentBotOption extends Partial<AgentBotMeta> {
  id: number;
  draft?: number;
}

export const AgentBotOption = Syringe.defineToken('AgentBotOption', {
  multiple: false,
});

export type AgentBotFactory = (options: AgentBotOption) => AgentBot;
export const AgentBotFactory = Syringe.defineToken('AgentConfigFactory', {
  multiple: false,
});

export const AgentBotType = {
  isOption(data?: Record<string, any>): data is AgentBotOption {
    return !!(data && 'id' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return AgentBotType.isOption(data) && 'name' in data && 'avatar' in data;
  },
};

export type AgentConfigStatus = 'draft' | 'publish';
