import { Fetcher } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import { DefaultAgentConfigOptions } from './agent-config.js';
import type { AgentConfig, AgentConfigOption } from './protocol.js';
import { AgentConfigFactory } from './protocol.js';

@singleton()
export class AgentConfigManager {
  @inject(AgentConfigFactory) configFactory: AgentConfigFactory;
  @inject(Fetcher) fetcher: Fetcher;

  async getConfigOption({ id }: { id: string }) {
    const res = await this.fetcher.get<AgentConfigOption>(`/api/v1/agents/${id}`);
    if (res.status === 200) {
      return res.data;
    }
    throw new Error('get config option failed');
  }

  create({ id }: { id: string }): AgentConfig {
    this.getConfigOption({ id: id });
    return this.configFactory(DefaultAgentConfigOptions);
  }
}
