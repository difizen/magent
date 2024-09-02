import { ManaModule } from '@difizen/mana-app';

import { KnowledgeModalContribution } from './knowledge-modal/index.js';
import { AgentConfigView } from './view.js';

export const AgentConfigViewModule = ManaModule.create().register(
  AgentConfigView,
  KnowledgeModalContribution,
);
