import { prop, transient } from '@difizen/mana-app';

import type { AgentBotConfig } from './agent-bot-config';

@transient()
export class AgentBot {
  @prop()
  name: string;
  @prop()
  avatar?: string;
  @prop()
  config: AgentBotConfig;
}
