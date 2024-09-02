import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { AgentConfigViewModule } from '../agent-config/module.js';

import { AgentFlowView } from './agent-flow-view.js';
import { AgentFlowDevView, slot } from './flow-dev-view.js';
import { ReactFlowThemeContribution } from './react-flow-theme-contribution.js';

export const AgentFlowModule = ManaModule.create()
  .register(
    AgentFlowView,
    AgentFlowDevView,
    ReactFlowThemeContribution,
    createSlotPreference({
      slot: slot,
      view: AgentFlowDevView,
    }),
  )
  .dependOn(AgentConfigViewModule);
