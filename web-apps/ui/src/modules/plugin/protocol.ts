import { Syringe } from '@difizen/mana-app';

import type { ToolMeta } from '../tool/protocol.js';

import type { PluginModel } from './plugin-model.js';

export interface PluginMeta {
  id: string;
  avatar?: string;
  nickname?: string;
  toolset: ToolMeta[];
  openapi_desc?: string;
}

export const PluginModelOption = Syringe.defineToken('PluginModelOption', {
  multiple: false,
});

export type PluginFactory = (option: PluginMeta) => PluginModel;
export const PluginFactory = Syringe.defineToken('PluginFactory', {
  multiple: false,
});
