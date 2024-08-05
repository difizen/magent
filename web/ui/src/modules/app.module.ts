import { ManaModule } from '@difizen/mana-app';

import { AgentChatModule } from '../views/agent-dev/index.js';
import { AgentsPageModule } from '../views/agents/index.js';
import { ChatViewModule } from '../views/chat/module.js';
import { PortalsModule } from '../views/protal-layout/index.js';
import { SessionsViewModule } from '../views/sessions/module.js';
import { ToolPageModule } from '../views/tool/module.js';

import { AgentModule } from './agent-module.js';
import { BaseLayoutModule } from './base-layout/module.js';
import { ChatMessageModule } from './chat-message/index.js';
import { SessionModule } from './session/index.js';

export const AppBaseModule = new ManaModule().dependOn(
  BaseLayoutModule,
  AgentModule,
  SessionModule,
  ChatMessageModule,

  PortalsModule,
  AgentsPageModule,
  AgentChatModule,
  SessionsViewModule,
  ChatViewModule,
  ToolPageModule,
);

export default AppBaseModule;
