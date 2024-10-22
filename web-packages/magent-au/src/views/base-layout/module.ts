import {
  createSlotPreference,
  createViewPreference,
  HeaderArea,
  HeaderView,
  ManaModule,
  RootSlotId,
} from '@difizen/mana-app';

import { AUViewCommonModule } from '../common/module.js';

import { MagentGoBackView } from './back/view.js';
import { MagentBrandView } from './brand/view.js';
import { GithubLinkView } from './github/view.js';
import { MagentBaseLayoutSlots, MagentBaseLayoutView, slot } from './layout.js';
import { MagentMainTitleView } from './title/view.js';
import { MagentMainToolbarView } from './toolbar/index.js';

export const BaseLayoutModule = ManaModule.create()
  .register(
    MagentGoBackView,
    MagentMainTitleView,
    MagentBaseLayoutView,
    MagentBrandView,
    GithubLinkView,
    MagentMainToolbarView,

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
      slot: HeaderArea.left,
      view: MagentMainTitleView,
      autoCreate: true,
    }),
    createViewPreference({
      slot: HeaderArea.right,
      view: MagentMainToolbarView,
      autoCreate: true,
      openOptions: {
        order: 'b_toolbar',
      },
    }),
    createViewPreference({
      slot: HeaderArea.right,
      view: GithubLinkView,
      autoCreate: true,
      openOptions: {
        order: 'a_github',
      },
    }),
  )
  .dependOn(AUViewCommonModule);
