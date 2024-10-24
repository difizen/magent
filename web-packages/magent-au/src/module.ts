import { ChatViewModule } from '@difizen/magent-chat';
import { ManaModule } from '@difizen/mana-app';

import { AUDataModule } from './data-module.js';
import { AgentConfigViewModule } from './views/agent-config/module.js';
import { AgentDevModule } from './views/agent-dev/module.js';
import { AgentFlowModule } from './views/agent-flow/module.js';
import { AgentsPageModule } from './views/agents/module.js';
import { BaseLayoutModule } from './views/base-layout/module.js';
import { DebugModule } from './views/debug/module.js';
import { KnowledgePageModule } from './views/knowledge/module.js';
import { PluginsPageModule } from './views/plugins/module.js';
import { PortalsModule } from './views/portal-layout/module.js';
import { SessionsViewModule } from './views/sessions/module.js';
import { ToolPageModule } from './views/tools/module.js';

export const AUModule = new ManaModule()
  .dependOn(AUDataModule)
  .dependOn(
    BaseLayoutModule,
    PortalsModule,
    AgentDevModule,
    AgentsPageModule,
    SessionsViewModule,
    ChatViewModule,
    ToolPageModule,
    KnowledgePageModule,
    AgentConfigViewModule,
    PortalsModule,
    AgentFlowModule,
    DebugModule,
    PluginsPageModule,
  );
