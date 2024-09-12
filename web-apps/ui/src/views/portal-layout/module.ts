import { createSlotPreference, ManaModule } from '@difizen/mana-app';

import { PortalLayoutView, slot } from './view.js';

export const PortalsModule = ManaModule.create().register(
  PortalLayoutView,
  createSlotPreference({
    slot: slot,
    view: PortalLayoutView,
  }),
);
