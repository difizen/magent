import { inject, prop, transient } from '@difizen/mana-app';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';

import { AgentConfigManager } from './agent-config-manager.js';
import type { AgentConfig } from './agent-config.js';
import type { AgentConfigOption } from './protocol.js';
import { AgentBotOption, AgentBotType } from './protocol.js';

@transient()
export class AgentBot extends AsyncModel<AgentBot, AgentBotOption> {
  axios: AxiosClient;
  configManager: AgentConfigManager;

  id: number;

  @prop()
  name: string;
  @prop()
  avatar?: string;

  @prop()
  draft?: AgentConfig;

  option: AgentBotOption;

  constructor(
    @inject(AgentBotOption) option: AgentBotOption,
    @inject(AgentConfigManager) configManager: AgentConfigManager,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    super();
    this.option = option;
    this.configManager = configManager;
    this.axios = axios;

    this.id = option.id;
    this.initialize(option);
    this.ensureDraft(option);
  }

  shouldInitFromMeta(option: AgentBotOption): boolean {
    return AgentBotType.isFullOption(option);
  }

  async ensureDraft(option: AgentBotOption): Promise<AgentConfig | undefined> {
    await this.ready;
    let draftConfig = option.draft;
    if (!this.option.draft) {
      draftConfig = await this.fetchDraftInfo(option);
    }
    if (draftConfig) {
      this.draft = this.configManager.create(draftConfig);
    }
    return this.draft;
  }

  protected override fromMeta(option: AgentBotOption) {
    this.id = option.id;
    this.name = option.name!;
    this.avatar = option.avatar!;
    super.fromMeta(option);
  }

  async fetchInfo(option: AgentBotOption) {
    const res = await this.axios.get<AgentBotOption>(`api/v1/agent/bots/${option.id}`);
    if (res.status === 200) {
      if (this.shouldInitFromMeta(res.data)) {
        this.fromMeta(res.data);
      }
    }
  }

  async fetchDraftInfo(option: AgentBotOption) {
    const res = await this.axios.get<AgentConfigOption>(
      `api/v1/agent/bots/${option.id}/draft`,
    );
    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  }

  toMeta(): AgentBotOption {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
    };
  }

  async save(): Promise<boolean> {
    const res = await this.axios.put<number>(
      `api/v1/agent/bots/${this.id}`,
      this.toMeta(),
    );
    if (res.status === 200) {
      return res.data === 1;
    }
    return false;
  }
}
