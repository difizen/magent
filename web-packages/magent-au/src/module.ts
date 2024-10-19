import { ChatViewModule } from '@difizen/magent-chat';
import { ManaModule } from '@difizen/mana-app';

import { AgentBotModule } from './agent/module.js';
import { ChatMessageModule } from './au-chat-message/module.js';
import { AUCommonModule } from './common/module.js';
import { ModelModule } from './model/module.js';
import { PluginModule } from './plugin/module.js';
import { SessionModule } from './session/module.js';
import { ToolModule } from './tool/module.js';
import { AgentConfigViewModule } from './views/agent-config/module.js';
import { AgentChatModule } from './views/agent-dev/module.js';
import { AgentFlowModule } from './views/agent-flow/module.js';
import { AgentsPageModule } from './views/agents/module.js';
import { BaseLayoutModule } from './views/base-layout/module.js';
import { DebugModule } from './views/debug/module.js';
import { KnowledgePageModule } from './views/knowledge/module.js';
import { PluginPageModule } from './views/plugins/module.js';
import { PortalsModule } from './views/portal-layout/module.js';
import { SessionsViewModule } from './views/sessions/module.js';
import { ToolPageModule } from './views/tools/module.js';

export const AUDataModule = new ManaModule()
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

export const AUModule = new ManaModule()
  .dependOn(AUDataModule)
  .dependOn(
    BaseLayoutModule,
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
    PluginPageModule,
  );
