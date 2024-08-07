import {
  createSlotPreference,
  createViewPreference,
  HeaderArea,
  HeaderView,
  ManaModule,
  RootSlotId,
} from '@difizen/mana-app';

import { MagentGoBackView } from './back/view.js';
import { MagentBrandView } from './brand/view.js';
import { GithubLinkView } from './github/view.js';
import { MagentBaseLayoutSlots, MagentBaseLayoutView, slot } from './layout.js';
import { MainView } from './main-view.js';

export const BaseLayoutModule = ManaModule.create().register(
  MainView,

  MagentGoBackView,
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
    view: MagentGoBackView,
    autoCreate: true,
    openOptions: {
      order: 'a-go-back',
    },
  }),
  createViewPreference({
    slot: HeaderArea.left,
    view: MagentBrandView,
    autoCreate: true,
    openOptions: {
      order: 'b-brand',
    },
  }),
  createViewPreference({
    slot: HeaderArea.right,
    view: GithubLinkView,
    autoCreate: true,
  }),
);
