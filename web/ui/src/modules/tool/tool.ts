import { Deferred, inject, prop, transient } from '@difizen/mana-app';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';

import { ToolOption, ToolType } from './protocol.js';
import type { ToolConfigOption } from './protocol.js';
import { ToolConfigManager } from './tool-config-manager.js';
import type { ToolConfig } from './tool-config.js';

@transient()
export class Tool extends AsyncModel<Tool, ToolOption> {
  axios: AxiosClient;
  configManager: ToolConfigManager;

  id: number;

  @prop()
  name: string;
  @prop()
  pluginType: number;
  @prop()
  avatar?: string;
  @prop()
  description?: string;

  @prop()
  draft?: ToolConfig;

  protected draftDeferred = new Deferred<ToolConfig>();

  get draftReady() {
    return this.draftDeferred.promise;
  }

  option: ToolOption;

  constructor(
    @inject(ToolOption) option: ToolOption,
    @inject(ToolConfigManager) configManager: ToolConfigManager,
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

  shouldInitFromMeta(option: ToolOption = this.option): boolean {
    return ToolType.isFullOption(option);
  }

  async ensureDraft(
    option: ToolOption = this.option,
  ): Promise<ToolConfig | undefined> {
    await this.ready;
    if (this.draft) {
      return this.draft;
    }
    let draftConfig = option.draft;
    if (!draftConfig) {
      draftConfig = await this.fetchDraftInfo(option);
    }
    if (draftConfig) {
      this.draft = this.configManager.create(draftConfig);
      this.draftDeferred.resolve(this.draft);
    }
    return this.draft;
  }

  protected override fromMeta(option: ToolOption = this.option) {
    this.id = option.id;
    this.pluginType = option.plugin_type!;
    this.name = option.name!;
    this.avatar = option.avatar;
    this.description = option.description;
    super.fromMeta(option);
  }

  async fetchInfo(option: ToolOption = this.option) {
    const res = await this.axios.get<ToolOption>(`api/v1/plugins/${option.id}`);
    if (res.status === 200) {
      if (this.shouldInitFromMeta(res.data)) {
        this.fromMeta(res.data);
      }
    }
  }

  async fetchDraftInfo(option: ToolOption = this.option) {
    const res = await this.axios.get<ToolConfigOption>(
      `api/v1/plugins/${option.id}/draft`,
    );
    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  }

  toMeta(): ToolOption {
    return {
      id: this.id,
      plugin_type: this.pluginType,
      description: this.description,
      name: this.name,
      avatar: this.avatar,
    };
  }

  async save(): Promise<boolean> {
    const res = await this.axios.put<number>(
      `api/v1/plugins/${this.id}`,
      this.toMeta(),
    );
    if (res.status === 200) {
      return res.data === 1;
    }
    return false;
  }
}
