import { ManaModule } from '@difizen/mana-app';

import { AgentBotModule } from './agent/module.js';
import { ChatMessageModule } from './au-chat-message/module.js';
import { AUCommonModule } from './common/module.js';
import { ModelModule } from './model/module.js';
import { PluginModule } from './plugin/module.js';
import { SessionModule } from './session/module.js';
import { ToolModule } from './tool/module.js';

export const AUDataModule = new ManaModule('au-data')
  // 基础数据模块
  .dependOn(
    AUCommonModule,
    SessionModule,
    ChatMessageModule,
    ModelModule,
    AgentBotModule,
    ToolModule,
    PluginModule,
  );
