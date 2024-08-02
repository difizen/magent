import {
  createSlotPreference,
  createViewPreference,
  HeaderArea,
  HeaderView,
  ManaModule,
  RootSlotId,
} from '@difizen/mana-app';

import { MagentBrandView } from './brand/view.js';
import { GithubLinkView } from './github/view.js';
import { MagentBaseLayoutSlots, MagentBaseLayoutView, slot } from './layout.js';

export const BaseLayoutModule = ManaModule.create().register(
  MagentBaseLayoutView,
  MagentBrandView,
  GithubLinkView,

  createSlotPreference({
    slot: MagentBaseLayoutSlots.header,
    view: HeaderView,
  }),
  createSlotPreference({
    slot: RootSlotId,
    view: MagentBaseLayoutView,
  }),

  createSlotPreference({
    slot: slot,
    view: MagentBaseLayoutView,
  }),

  createViewPreference({
    slot: HeaderArea.left,
    view: MagentBrandView,
    autoCreate: true,
  }),
  createViewPreference({
    slot: HeaderArea.right,
    view: GithubLinkView,
    autoCreate: true,
  }),
);
