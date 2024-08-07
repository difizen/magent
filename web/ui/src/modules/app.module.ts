import { ManaModule } from '@difizen/mana-app';

import { AgentConfigViewModule } from '../views/agent-config/index.js';
import { AgentChatModule } from '../views/agent-dev/index.js';
import { AgentsPageModule } from '../views/agents/index.js';
import { ChatViewModule } from '../views/chat/module.js';
import { PortalsModule } from '../views/protal-layout/index.js';
import { SessionsViewModule } from '../views/sessions/module.js';
import { ToolPageModule } from '../views/tool/module.js';

import { AgentBotModule } from './agent/module.js';
import { AxiosClientModule } from './axios-client/module.js';
import { BaseLayoutModule } from './base-layout/module.js';
import { ChatMessageModule } from './chat-message/index.js';
import { ModelModule } from './model/module.js';
import { SessionModule } from './session/index.js';
import { ToolModule } from './tool/module.js';

export const AppBaseModule = new ManaModule()
  // 基础数据模块
  .dependOn(
    BaseLayoutModule,
    SessionModule,
    ChatMessageModule,
    ModelModule,
    AgentBotModule,
    AxiosClientModule,
    ToolModule,
  )
  // 视图模块
  .dependOn(
    PortalsModule,
    AgentChatModule,
    AgentsPageModule,
    SessionsViewModule,
    ChatViewModule,
    ToolPageModule,
    AgentConfigViewModule,
    PortalsModule,
  );

export default AppBaseModule;
