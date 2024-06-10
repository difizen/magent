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
  persona?: string;
  tools?: AgentConfigToolMeta[];
  datasets?: AgentConfigDatasetMeta[];
  model?: AgentConfigModelMeta;
  [key: string]: any;
}

export type { AgentConfig } from './agent-config.js';

export const AgentConfigOption = Syringe.defineToken('AgentConfigOption', {
  multiple: false,
});

export interface AgentConfigOption extends AgentConfigMeta {
  id: string;
  botId: string;
}

export type AgentConfigFactory = (options: AgentConfigMeta) => AgentConfig;
export const AgentConfigFactory = Syringe.defineToken('AgentConfigFactory', {
  multiple: false,
});

export type { AgentBot } from './agent-bot.js';

export const AgentBotOption = Syringe.defineToken('AgentBotOption', {
  multiple: false,
});

export type AgentBotFactory = (options: any) => AgentBot;
export const AgentBotFactory = Syringe.defineToken('AgentConfigFactory', {
  multiple: false,
});
