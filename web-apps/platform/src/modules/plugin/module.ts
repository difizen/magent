import { ManaModule } from '@difizen/mana-app';

import { Plugin } from './plugin.js';
import {
  PluginConfigFactory,
  PluginConfigOption,
  PluginFactory,
  PluginOption,
} from './protocol.js';
import { PluginManager } from './plugin-manager.js';
import { PluginConfig } from './plugin-config.js';
import { PluginConfigManager } from './plugin-config-manager.js';

export const PluginModule = ManaModule.create().register(
  PluginManager,
  Plugin,
  PluginConfig,
  PluginConfigManager,
  {
    token: PluginConfigFactory,
    useFactory: (ctx) => {
      return (option: PluginConfigOption) => {
        const child = ctx.container.createChild();
        child.register({ token: PluginConfigOption, useValue: option });
        return child.get(PluginConfig);
      };
    },
  },
  {
    token: PluginFactory,
    useFactory: (ctx) => {
      return (option: any) => {
        const child = ctx.container.createChild();
        child.register({ token: PluginOption, useValue: option });
        return child.get(Plugin);
      };
    },
  },
);
