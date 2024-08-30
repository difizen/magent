import { ManaModule } from '@difizen/mana-app';

import { PluginManager } from './plugin-manager.js';
import { OpenAPIPluginModel, PluginModel } from './plugin-model.js';
import type { PluginMeta } from './protocol.js';
import { PluginModelOption } from './protocol.js';
import { PluginFactory } from './protocol.js';

export const PluginModule = ManaModule.create().register(
  PluginModel,
  OpenAPIPluginModel,
  PluginManager,

  {
    token: PluginFactory,
    useFactory: (ctx) => {
      return (option: PluginMeta) => {
        const child = ctx.container.createChild();
        child.register({ token: PluginModelOption, useValue: option });
        if (option.openapi_desc) {
          return child.get(OpenAPIPluginModel);
        }
        return child.get(PluginModel);
      };
    },
  },
);
