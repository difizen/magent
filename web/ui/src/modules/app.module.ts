import { ManaModule } from '@difizen/mana-app';

import { AgentsPageModule } from '../views/agents/module.js';
import { PortalsModule } from '../views/protal-layout/index.js';

import { AgentModule } from './agent-module.js';
import { BaseLayoutModule } from './base-layout/module.js';

export const AppBaseModule = new ManaModule().dependOn(
  BaseLayoutModule,
  AgentModule,
  PortalsModule,
  AgentsPageModule,
);

export default AppBaseModule;
