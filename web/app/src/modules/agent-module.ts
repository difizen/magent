import { ManaModule } from '@difizen/mana-app';

import { AgentBotModule } from './agent-bot/module.js';
import { AxiosClientModule } from './axios-client/module.js';
import { ChatModule } from './chat/module.js';
import { ModelModule } from './model/module.js';

export const AgentModule = ManaModule.create().dependOn(
  ModelModule,
  AgentBotModule,
  AxiosClientModule,
  ChatModule,
);
