import { createViewPreference, ManaModule } from '@difizen/mana-app';

import { ToolsView, slot } from './view.js';

export const ToolPageModule = ManaModule.create().register(
  ToolsView,
  createViewPreference({
    slot: slot,
    view: ToolsView,
    autoCreate: true,
  }),
);
