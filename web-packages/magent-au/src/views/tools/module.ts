import { createViewPreference, ManaModule } from '@difizen/mana-app';

import { ToolSpace } from '../../tool/tool-space.js';

import { ToolsView, slot } from './view.js';

export const ToolPageModule = ManaModule.create().register(
  ToolsView,
  ToolSpace,
  createViewPreference({
    slot: slot,
    view: ToolsView,
    autoCreate: true,
  }),
);
