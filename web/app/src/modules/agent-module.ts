import { ManaModule } from '@difizen/mana-app';

import { AgentBotModule } from './agent-bot/module';
import { ModelModule } from './model';

export const AgentModule = ManaModule.create().dependOn(ModelModule, AgentBotModule);
