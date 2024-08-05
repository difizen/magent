import { ManaModule } from '@difizen/mana-app';

import {
  ToolConfigFactory,
  ToolConfigOption,
  ToolFactory,
  ToolOption,
} from './protocol.js';
import { ToolConfigManager } from './tool-config-manager.js';
import { ToolConfig } from './tool-config.js';
import { ToolManager } from './tool-manager.js';
import { Tool } from './tool.js';

export const ToolModule = ManaModule.create().register(
  ToolManager,
  Tool,
  ToolConfig,
  ToolConfigManager,
  {
    token: ToolConfigFactory,
    useFactory: (ctx) => {
      return (option: ToolConfigOption) => {
        const child = ctx.container.createChild();
        child.register({ token: ToolConfigOption, useValue: option });
        return child.get(ToolConfig);
      };
    },
  },
  {
    token: ToolFactory,
    useFactory: (ctx) => {
      return (option: any) => {
        const child = ctx.container.createChild();
        child.register({ token: ToolOption, useValue: option });
        return child.get(Tool);
      };
    },
  },
);
