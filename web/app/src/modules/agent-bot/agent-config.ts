import { inject, prop, transient } from '@difizen/mana-app';

import type { AgentConfigModelMeta } from './protocol';
import { AgentConfigOption } from './protocol';

@transient()
export class AgentConfig {
  id: string;
  botId: string;

  @prop()
  persona?: string;

  @prop()
  model?: AgentConfigModelMeta;

  option: any;

  constructor(@inject(AgentConfigOption) option: AgentConfigOption) {
    this.option = option;
    this.id = option.id;
    this.botId = option.botId;
    this.persona = option.persona;
    this.model = option.model;
  }
}
