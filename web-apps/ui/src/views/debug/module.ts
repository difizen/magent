import { ManaModule } from '@difizen/mana-app';

import { AgentConfigViewModule } from '../agent-config/module.js';

import { DebugDrawerContribution } from './debug-drawer-contribution.js';

export const DebugModule = ManaModule.create()
  .register(DebugDrawerContribution)
  .dependOn(AgentConfigViewModule);
