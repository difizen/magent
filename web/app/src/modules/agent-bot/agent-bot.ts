import { inject, prop, transient } from '@difizen/mana-app';
import qs from 'query-string';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';
import { UserManager } from '../user/index.js';

import { AgentConfigManager } from './agent-config-manager.js';
import type { AgentConfig } from './agent-config.js';
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

  draftConfigId?: number;

  option: any;

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
    this.ensureDraft();
  }

  shouldInitFromMeta(option: AgentBotOption): boolean {
    return AgentBotType.isFullOption(option);
  }

  async ensureDraft(): Promise<AgentConfig> {
    await this.ready;
    let config: AgentConfig;
    if (this.draftConfigId) {
      config = await this.configManager.getDraft({ id: this.draftConfigId });
    } else {
      config = await this.configManager.create();
      this.draftConfigId = config.id;
      await this.save();
    }
    this.draft = config;
    return config;
  }

  protected override fromMeta(option: AgentBotOption) {
    this.id = option.id;
    this.name = option.name!;
    this.avatar = option.avatar!;
    this.draftConfigId = option.draft;
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

  toMeta(): AgentBotOption {
    return {
      id: this.id,
      draft: this.draftConfigId,
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
