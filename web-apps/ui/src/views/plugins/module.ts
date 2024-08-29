import {
  createSlotPreference,
  createViewPreference,
  ManaModule,
} from '@difizen/mana-app';

import { PluginModalContribution } from './modal/contribution.js';
import { PluginsView, slot } from './view.js';

export const PluginPageModule = ManaModule.create().register(
  PluginsView,
  PluginModalContribution,
  createSlotPreference({
    slot: slot,
    view: PluginsView,
  }),
);
