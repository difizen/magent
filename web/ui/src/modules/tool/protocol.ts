import { Syringe } from '@difizen/mana-app';

import type { ToolConfig } from './tool-config.js';
import type { Tool } from './tool.js';

// export interface ToolConfigInfo {
//   pluginOpenapiDesc: string;
//   [key: string]: any;
// }

export const ToolConfigOption = Syringe.defineToken('ToolConfigOption', {
  multiple: false,
});

export interface ToolConfigOption {
  id: number;
  plugin_id: number;
  plugin_openapi_desc: string;
  is_draft?: boolean;
  apis?: number[];
}

export type ToolConfigFactory = (options: ToolConfigOption) => ToolConfig;
export const ToolConfigFactory = Syringe.defineToken('ToolConfigFactory', {
  multiple: false,
});

export const ToolConfigType = {
  isOption(data?: Record<string, any>): data is ToolConfigOption {
    return !!(data && 'id' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return (
      ToolConfigType.isOption(data) &&
      'plugin_id' in data &&
      'plugin_openapi_desc' in data
    );
  },
};

export type { Tool } from './tool.js';

export interface ToolMeta {
  name: string;
  plugin_type: number;
  avatar?: string;
  description?: string;
}

export interface ToolOption extends Partial<ToolMeta> {
  id: number;
  draft?: ToolConfigOption | null;
}

export const ToolOption = Syringe.defineToken('ToolOption', {
  multiple: false,
});

export type ToolFactory = (options: ToolOption) => Tool;
export const ToolFactory = Syringe.defineToken('ToolFactory', {
  multiple: false,
});

export const ToolType = {
  isOption(data?: Record<string, any>): data is ToolOption {
    return !!(data && 'id' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return ToolType.isOption(data) && 'name' in data;
  },
};

export const ToolInstance = Syringe.defineToken('ToolInstance', {
  multiple: false,
});
