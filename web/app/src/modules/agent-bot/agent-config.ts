import { inject, prop, transient } from '@difizen/mana-app';
import axios from 'axios';
import qs from 'query-string';

import { AsyncModel } from '../../common/async-model.js';
import { UserManager } from '../user/index.js';

import type {
  AgentConfigMeta,
  AgentConfigModelMeta,
  AgentConfigStatus,
} from './protocol.js';
import { AgentConfigOption, AgentConfigType } from './protocol.js';

@transient()
export class AgentConfig extends AsyncModel<AgentConfig, AgentConfigOption> {
  @inject(UserManager) userManager: UserManager;
  id: number;

  status: AgentConfigStatus = 'draft';

  @prop()
  persona?: string;

  @prop()
  model?: AgentConfigModelMeta;

  @prop()
  config?: AgentConfigMeta;

  option?: AgentConfigOption;

  constructor(@inject(AgentConfigOption) option: AgentConfigOption) {
    super();
    this.option = option;
    this.id = option.id;
    this.initialize(option);
  }

  override shouldInitFromMeta(option: AgentConfigOption): boolean {
    return AgentConfigType.isFullOption(option);
  }

  protected override fromMeta(option: AgentConfigOption): void {
    this.id = option.id;
    this.status = option.status || 'draft';
    this.persona = option.config?.persona;
    this.model = option.config?.model;
    // TODO: tools & datasets
    super.fromMeta(option);
  }

  override async fetchInfo(option: AgentConfigOption): Promise<void> {
    const res = await axios.get<AgentConfigOption>(`api/v1/agent/configs/${option.id}`);
    if (res.status === 200) {
      if (this.shouldInitFromMeta(res.data)) {
        this.fromMeta(res.data);
      }
    }
  }

  toMeta(): AgentConfigOption {
    return {
      id: this.id,
      status: this.status,
      config: {
        ...(this.config || {}),
        persona: this.persona,
      },
    };
  }

  async save(): Promise<boolean> {
    const user = await this.userManager.currentReady;
    if (!user) {
      throw new Error('cannot get user info');
    }
    const query = qs.stringify({
      user_id: user.id,
    });
    const res = await axios.put<number>(
      `api/v1/agent/configs/${this.id}?${query}`,
      this.toMeta(),
    );
    if (res.status === 200) {
      return res.data === 1;
    }
    return false;
  }
}
