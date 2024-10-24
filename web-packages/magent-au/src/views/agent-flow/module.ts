import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { AgentConfigViewModule } from '../agent-config/module.js';
import { AUViewCommonModule } from '../common/module.js';
import { SessionsViewModule } from '../sessions/module.js';

import { AgentFlowView } from './agent-flow-view.js';
import { AgentFlowDevView, AgentFlowDevSlot } from './flow-dev-view.js';
import { ReactFlowThemeContribution } from './react-flow-theme-contribution.js';
import { AgentFlowMainToolbarContribution } from './toolbar.js';

export const AgentFlowModule = ManaModule.create()
  .register(
    AgentFlowView,
    AgentFlowDevView,
    ReactFlowThemeContribution,
    AgentFlowMainToolbarContribution,
    createSlotPreference({
      slot: AgentFlowDevSlot,
      view: AgentFlowDevView,
    }),
  )
  .dependOn(AgentConfigViewModule, AUViewCommonModule, SessionsViewModule);
