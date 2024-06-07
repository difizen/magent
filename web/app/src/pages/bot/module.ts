import {
  HeaderArea,
  HeaderView,
  ManaModule,
  RootSlotId,
  createSlotPreference,
  createViewPreference,
} from '@difizen/mana-app';

import { MagentBaseLayoutView, MagentBaseLayoutSlots } from './base-layout/layout.js';
import { BotConfigView } from './bot-config/index.js';
import { BotLayoutView, BotLayoutSlots } from './bot-layout/layout.js';
import { BotPreviewerView } from './bot-previewer/index.js';
import { MagentBrandView } from './brand/view.js';
import { UserAvatarView } from './avatar-view.js';

export const BotModule = ManaModule.create().register(
  MagentBaseLayoutView,
  MagentBrandView,
  BotLayoutView,
  BotConfigView,
  BotPreviewerView,
  UserAvatarView,
  createSlotPreference({
    slot: RootSlotId,
    view: MagentBaseLayoutView,
  }),
  createSlotPreference({
    slot: MagentBaseLayoutSlots.header,
    view: HeaderView,
  }),
  createSlotPreference({
    slot: MagentBaseLayoutSlots.content,
    view: BotLayoutView,
  }),

  createViewPreference({
    slot: HeaderArea.left,
    view: MagentBrandView,
    autoCreate: true,
  }),
  createViewPreference({
    slot: HeaderArea.right,
    view: UserAvatarView,
    autoCreate: true,
  }),

  createViewPreference({
    slot: BotLayoutSlots.config,
    view: BotConfigView,
    autoCreate: true,
  }),
  createViewPreference({
    slot: BotLayoutSlots.preview,
    view: BotPreviewerView,
    autoCreate: true,
  }),
);
