import { Deferred, inject, prop, transient } from '@difizen/mana-app';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';

import { PluginConfigManager } from './plugin-config-manager.js';
import type { PluginConfig } from './plugin-config.js';
import { PluginOption, PluginType } from './protocol.js';
import type { PluginConfigOption } from './protocol.js';

@transient()
export class Plugin extends AsyncModel<Plugin, PluginOption> {
  axios: AxiosClient;
  configManager: PluginConfigManager;

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
  draft?: PluginConfig;

  protected draftDeferred = new Deferred<PluginConfig>();

  get draftReady() {
    return this.draftDeferred.promise;
  }

  option: PluginOption;

  constructor(
    @inject(PluginOption) option: PluginOption,
    @inject(PluginConfigManager) configManager: PluginConfigManager,
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

  shouldInitFromMeta(option: PluginOption = this.option): boolean {
    return PluginType.isFullOption(option);
  }

  async ensureDraft(
    option: PluginOption = this.option,
  ): Promise<PluginConfig | undefined> {
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

  protected override fromMeta(option: PluginOption = this.option) {
    this.id = option.id;
    this.pluginType = option.plugin_type!;
    this.name = option.name!;
    this.avatar = option.avatar;
    this.description = option.description;
    super.fromMeta(option);
  }

  async fetchInfo(option: PluginOption = this.option) {
    const res = await this.axios.get<PluginOption>(`api/v1/plugins/${option.id}`);
    if (res.status === 200) {
      if (this.shouldInitFromMeta(res.data)) {
        this.fromMeta(res.data);
      }
    }
  }

  async fetchDraftInfo(option: PluginOption = this.option) {
    const res = await this.axios.get<PluginConfigOption>(
      `api/v1/plugins/${option.id}/draft`,
    );
    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  }

  toMeta(): PluginOption {
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
