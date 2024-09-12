import { Syringe } from '@difizen/mana-app';

import type { ToolConfig } from './tool-config.js';
import type { ToolModel } from './tool-model.js';

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

export type { ToolModel } from './tool-model.js';

export interface ToolMeta {
  id: string;
  nickname: string;
  avatar?: string;
  description?: string;
  parameters?: string[];
  openapi_schema?: Record<string, any>;
}

export interface OpenAPIToolMeta extends ToolMeta {
  openapi_schema: Record<string, any>;
}

export const ToolModelOption = Syringe.defineToken('ToolModelOption', {
  multiple: false,
});

export type ToolFactory = (options: ToolMeta) => ToolModel;
export const ToolFactory = Syringe.defineToken('ToolFactory', {
  multiple: false,
});

export const ToolModelType = {
  isOption(data?: Record<string, any>): data is ToolMeta {
    return !!(data && 'id' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return ToolModelType.isOption(data) && 'name' in data;
  },
};

export const ToolInstance = Syringe.defineToken('ToolInstance', {
  multiple: false,
});

export const ToolsModalId = 'tool.modal';
