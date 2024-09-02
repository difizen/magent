import { ManaModule } from '@difizen/mana-app';

import {
  ToolConfigFactory,
  ToolConfigOption,
  ToolFactory,
  ToolModelOption,
} from './protocol.js';
import { ToolConfigManager } from './tool-config-manager.js';
import { ToolConfig } from './tool-config.js';
import { ToolManager } from './tool-manager.js';
import { ToolModel } from './tool-model.js';
import { ToolsModalContribution } from './tools-modal/index.js';

export const ToolModule = ManaModule.create().register(
  ToolManager,
  ToolModel,
  ToolConfig,
  ToolConfigManager,
  ToolsModalContribution,
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
        child.register({ token: ToolModelOption, useValue: option });
        return child.get(ToolModel);
      };
    },
  },
);
