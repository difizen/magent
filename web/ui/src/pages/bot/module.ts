import {
  HeaderArea,
  HeaderView,
  ManaModule,
  RootSlotId,
  createSlotPreference,
  createViewPreference,
} from '@difizen/mana-app';

import { AgentBotApp } from './app.js';
import { UserAvatarView } from './avatar-view.js';
import { MagentBaseLayoutView, MagentBaseLayoutSlots } from './base-layout/layout.js';
import { AgentBotConfigSlots, BotConfigView } from './bot-config/index.js';
import { BotLayoutView, BotLayoutSlots } from './bot-layout/layout.js';
import { BotPersonaView } from './bot-persona/view.js';
import { BotPreviewerView } from './bot-previewer/index.js';
import { BotProvider } from './bot-provider.js';
import { BotSettingView } from './bot-setting/view.js';
import { MagentBrandView } from './brand/view.js';
import { ModelSelectorView } from './model-selector/view.js';

export const BotModule = ManaModule.create().register(
  AgentBotApp,
  MagentBaseLayoutView,
  MagentBrandView,
  BotLayoutView,
  BotConfigView,
  BotPreviewerView,
  BotProvider,
  UserAvatarView,
  ModelSelectorView,
  BotPersonaView,
  BotSettingView,
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
  createSlotPreference({
    slot: AgentBotConfigSlots.headerLeft,
    view: ModelSelectorView,
  }),
  createSlotPreference({
    slot: AgentBotConfigSlots.contentLeft,
    view: BotPersonaView,
  }),
  createSlotPreference({
    slot: AgentBotConfigSlots.contentRight,
    view: BotSettingView,
  }),
);
