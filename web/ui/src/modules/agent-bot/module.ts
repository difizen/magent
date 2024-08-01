import { ManaModule } from '@difizen/mana-app';

import { AgentBotManager } from './agent-bot-manager.js';
import { AgentBot } from './agent-bot.js';
import { AgentConfigManager } from './agent-config-manager.js';
import { AgentConfig } from './agent-config.js';
import {
  AgentBotFactory,
  AgentBotOption,
  AgentConfigFactory,
  AgentConfigOption,
} from './protocol.js';

export const AgentBotModule = ManaModule.create().register(
  AgentBotManager,
  AgentBot,
  AgentConfig,
  AgentConfigManager,
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
  AgentBot,
  AgentBotManager,
  {
    token: AgentBotFactory,
    useFactory: (ctx) => {
      return (option: any) => {
        const child = ctx.container.createChild();
        child.register({ token: AgentBotOption, useValue: option });
        return child.get(AgentBot);
      };
    },
  },
);
