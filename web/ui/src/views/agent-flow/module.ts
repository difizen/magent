import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { AgentConfigViewModule } from '../agent-config/module.js';

import { AgentFlowView } from './agent-flow-view.js';
import { AgentFlowDevView, slot } from './flow-dev-view.js';

export const AgentFlowModule = ManaModule.create()
  .register(
    AgentFlowView,
    AgentFlowDevView,
    createSlotPreference({
      slot: slot,
      view: AgentFlowDevView,
    }),
  )
  .dependOn(AgentConfigViewModule);
