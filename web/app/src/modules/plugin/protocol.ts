import { Syringe } from '@difizen/mana-app';

import type { PluginConfig } from './plugin-config.js';
import type { Plugin } from './plugin.js';

// export interface PluginConfigInfo {
//   pluginOpenapiDesc: string;
//   [key: string]: any;
// }

export const PluginConfigOption = Syringe.defineToken('PluginConfigOption', {
  multiple: false,
});

export interface PluginConfigOption {
  id: number;
  plugin_id: number;
  plugin_openapi_desc: string;
  is_draft?: boolean;
}

export type PluginConfigFactory = (options: PluginConfigOption) => PluginConfig;
export const PluginConfigFactory = Syringe.defineToken('PluginConfigFactory', {
  multiple: false,
});

export const PluginConfigType = {
  isOption(data?: Record<string, any>): data is PluginConfigOption {
    return !!(data && 'id' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return (
      PluginConfigType.isOption(data) &&
      'plugin_id' in data &&
      'plugin_openapi_desc' in data
    );
  },
};

export type { Plugin } from './plugin.js';

export interface PluginMeta {
  name: string;
  plugin_type: number;
  avatar?: string;
  description?: string;
}

export interface PluginOption extends Partial<PluginMeta> {
  id: number;
  draft?: PluginConfigOption | null;
}

export const PluginOption = Syringe.defineToken('PluginOption', {
  multiple: false,
});

export type PluginFactory = (options: PluginOption) => Plugin;
export const PluginFactory = Syringe.defineToken('PluginFactory', {
  multiple: false,
});

export const PluginType = {
  isOption(data?: Record<string, any>): data is PluginOption {
    return !!(data && 'id' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return PluginType.isOption(data) && 'name' in data;
  },
};

export const PluginInstance = Syringe.defineToken('PluginInstance', {
  multiple: false,
});
