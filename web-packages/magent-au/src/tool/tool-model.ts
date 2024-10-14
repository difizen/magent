import { AsyncModel, Fetcher } from '@difizen/magent-core';
import { Deferred, inject, prop, transient } from '@difizen/mana-app';

import type { ToolMeta } from './protocol.js';
import { ToolModelOption, ToolModelType } from './protocol.js';
import { ToolConfigManager } from './tool-config-manager.js';
import type { ToolConfig } from './tool-config.js';

@transient()
export class ToolModel extends AsyncModel<ToolModel, ToolMeta> {
  fetcher: Fetcher;
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

  @prop()
  openapi_schema?: Record<string, any>;

  protected draftDeferred = new Deferred<ToolConfig>();

  get draftReady() {
    return this.draftDeferred.promise;
  }

  option: ToolMeta;

  constructor(
    @inject(ToolModelOption) option: ToolMeta,
    @inject(ToolConfigManager) configManager: ToolConfigManager,
    @inject(Fetcher) fetcher: Fetcher,
  ) {
    super();
    this.option = option;
    this.configManager = configManager;
    this.fetcher = fetcher;

    this.id = option.id;
    this.initialize(option);
  }

  shouldInitFromMeta(): boolean {
    return true;
  }

  updateOption(option: ToolMeta) {
    this.fromMeta(option);
  }

  protected override fromMeta(option: ToolMeta = this.option) {
    this.id = option.id;
    if (option.nickname) {
      this.nickname = option.nickname;
    }
    if (option.description) {
      this.description = option.description;
    }
    if (option.avatar) {
      this.avatar = option.avatar;
    }
    if (option.parameters && option.parameters?.length > 0) {
      this.parameters = option.parameters;
    }
    if (option.openapi_schema) {
      this.openapi_schema = option.openapi_schema;
    }
    if (ToolModelType.isFullOption(option)) {
      super.fromMeta(option);
    }
  }

  async fetchInfo(option: ToolMeta = this.option) {
    const res = await this.fetcher.get<ToolMeta>(`api/v1/tools/${option.id}`);
    if (res.status === 200) {
      this.fromMeta(res.data);
    }
  }

  toMeta(): ToolMeta {
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
    const res = await this.fetcher.put<number>(
      `api/v1/tools/${this.id}`,
      this.toMeta(),
    );
    if (res.status === 200) {
      return res.data === 1;
    }
    return false;
  }
}
