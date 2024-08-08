import { ManaModule } from '@difizen/mana-app';

import { ToolManager, ToolModel } from '../tool/index.js';

import { AgentConfigManager } from './agent-config-manager.js';
import { AgentConfig } from './agent-config.js';
import { AgentManager } from './agent-manager.js';
import { AgentMarket } from './agent-market.js';
import { AgentModel } from './agent-model.js';
import {
  AgentModelFactory,
  AgentModelOption,
  AgentConfigFactory,
  AgentConfigOption,
} from './protocol.js';

export const AgentBotModule = ManaModule.create().register(
  AgentManager,
  AgentModel,
  AgentConfig,
  AgentConfigManager,
  AgentMarket,
  {
    token: AgentConfigFactory,
    useFactory: (ctx) => {
      return (option: AgentConfigOption) => {
        const child = ctx.container.createChild();
        child.register({ token: AgentConfigOption, useValue: option });
        return child.get(AgentConfig);
      };
    },
  },
  AgentModel,
  AgentManager,
  {
    token: AgentModelFactory,
    useFactory: (ctx) => {
      return (option: any) => {
        const child = ctx.container.createChild();
        child.register({ token: AgentModelOption, useValue: option });
        return child.get(AgentModel);
      };
    },
  },
);
