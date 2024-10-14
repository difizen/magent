import { ManaModule } from '@difizen/mana-app';

import { AgentBotModule } from './agent/module.js';
import { ChatMessageModule } from './au-chat-message/module.js';
import { ModelModule } from './model/module.js';
import { PluginModule } from './plugin/module.js';
import { SessionModule } from './session/module.js';
import { ToolModule } from './tool/module.js';

export const AUModule = new ManaModule()
  // 基础数据模块
  .dependOn(
    SessionModule,
    ChatMessageModule,
    ModelModule,
    AgentBotModule,
    ToolModule,
    PluginModule,
  );
