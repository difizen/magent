import { Deferred, inject, prop, transient } from '@difizen/mana-app';

import { AsyncModel } from '@/common/async-model.js';
import { AxiosClient } from '../axios-client/protocol.js';

import { ToolModelOption, ToolModelType } from './protocol.js';
import { ToolConfigManager } from './tool-config-manager.js';
import type { ToolConfig } from './tool-config.js';

@transient()
export class ToolModel extends AsyncModel<ToolModel, ToolModelOption> {
  axios: AxiosClient;
  configManager: ToolConfigManager;

  id: string;

  @prop()
  nickname: string;
  @prop()
  avatar: string;
  @prop()
  description: string;
  @prop()
  parameters: string[] = [];

  protected draftDeferred = new Deferred<ToolConfig>();

  get draftReady() {
    return this.draftDeferred.promise;
  }

  option: ToolModelOption;

  constructor(
    @inject(ToolModelOption) option: ToolModelOption,
    @inject(ToolConfigManager) configManager: ToolConfigManager,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    super();
    this.option = option;
    this.configManager = configManager;
    this.axios = axios;

    this.id = option.id;
    this.initialize(option);
  }

  shouldInitFromMeta(): boolean {
    return true;
  }

  updateOption(option: ToolModelOption) {
    // TODO:
  }

  protected override fromMeta(option: ToolModelOption = this.option) {
    this.id = option.id;
    this.nickname = option.nickname;
    this.avatar = option.avatar;
    this.description = option.description;
    this.parameters = option.parameters;
    if (ToolModelType.isFullOption(option)) {
      super.fromMeta(option);
    }
  }

  async fetchInfo(option: ToolModelOption = this.option) {
    const res = await this.axios.get<ToolModelOption>(`api/v1/tools/${option.id}`);
    if (res.status === 200) {
      this.fromMeta(res.data);
    }
  }

  toMeta(): ToolModelOption {
    return {
      id: this.id,
      nickname: this.nickname,
      description: this.description,
      avatar: this.avatar,
      parameters: this.parameters,
    };
  }
  toJSON(): string {
    return JSON.stringify(this.toMeta());
  }

  async save(): Promise<boolean> {
    const res = await this.axios.put<number>(`api/v1/tools/${this.id}`, this.toMeta());
    if (res.status === 200) {
      return res.data === 1;
    }
    return false;
  }
}