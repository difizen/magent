import { prop, transient } from '@difizen/mana-app';

import type { AgentConfigMeta } from './agent-bot-protocol.js';

@transient()
export class AgentBotConfig {
  id: string;
  botId: string;
  bot: any;

  @prop()
  protected configMeta: AgentConfigMeta;
  protected configStr: string;
}
