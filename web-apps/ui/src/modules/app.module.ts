import { ManaModule } from '@difizen/mana-app';

import { AgentConfigViewModule } from '@/views/agent-config/module.js';
import { AgentChatModule } from '@/views/agent-dev/module.js';
import { AgentFlowModule } from '@/views/agent-flow/module.js';
import { AgentsPageModule } from '@/views/agents/module.js';
import { ChatViewModule } from '@/views/chat/module.js';
import { DebugModule } from '@/views/debug/module.js';
import { KnowledgePageModule } from '@/views/knowledge/module.js';
import { PortalsModule } from '@/views/protal-layout/module.js';
import { SessionsViewModule } from '@/views/sessions/module.js';
import { ToolPageModule } from '@/views/tools/module.js';

import { AgentBotModule } from './agent/module.js';
import { AxiosClientModule } from './axios-client/module.js';
import { BaseLayoutModule } from './base-layout/module.js';
import { ChatMessageModule } from './chat-message/module.js';
import { ModelModule } from './model/module.js';
import { SessionModule } from './session/module.js';
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
    KnowledgePageModule,
    AgentConfigViewModule,
    PortalsModule,
    AgentFlowModule,
    DebugModule,
  );

export default AppBaseModule;
