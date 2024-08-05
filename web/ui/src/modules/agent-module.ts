import { ManaModule } from '@difizen/mana-app';

import { AgentBotModule } from './agent/module.js';
import { AxiosClientModule } from './axios-client/module.js';
import { ModelModule } from './model/module.js';
import { ToolModule } from './tool/module.js';

export const AgentModule = ManaModule.create().dependOn(
  ModelModule,
  AgentBotModule,
  AxiosClientModule,
  ToolModule,
);
