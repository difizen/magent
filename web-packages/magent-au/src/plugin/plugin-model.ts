import { Fetcher } from '@difizen/magent-core';
import { inject, transient } from '@difizen/mana-app';

import { ComponentModel } from '../component-model/component-model.js';
import { ToolManager } from '../tool/tool-manager.js';
import type { ToolModel } from '../tool/tool-model.js';

import type { PluginMeta } from './protocol.js';
import { PluginModelOption } from './protocol.js';

@transient()
export class PluginModel extends ComponentModel<PluginModel, PluginMeta> {
  protected fetcher: Fetcher;
  protected toolManager: ToolManager;

  option: PluginMeta;
  toolset: ToolModel[] = [];

  constructor(
    @inject(PluginModelOption) option: PluginMeta,
    @inject(ToolManager) toolManager: ToolManager,
    @inject(Fetcher) fetcher: Fetcher,
  ) {
    super();
    this.option = option;
    this.toolManager = toolManager;
    this.fetcher = fetcher;

    this.id = option.id;
    this.initialize(option);
  }
  shouldInitFromMeta(option: PluginMeta): boolean {
    return true;
  }
  fetchInfo(option: PluginMeta): Promise<void> {
    throw new Error('Method not implemented.');
  }

  protected override fromMeta(option: PluginMeta): void {
    super.fromMeta(option);
    this.toolset = option.toolset.map(this.toolManager.getOrCreate);
  }
  override toMeta = (): PluginMeta => {
    return {
      ...super.toMeta(),
      toolset: this.toolset.map((item) => item.toMeta()),
    };
  };
}

@transient()
export class OpenAPIPluginModel extends PluginModel {
  openapi_desc?: string;

  get openapiDesc(): string | undefined {
    return this.openapi_desc;
  }
  set openapiDesc(v: string | undefined) {
    this.openapi_desc = v;
  }

  protected override fromMeta(option: PluginMeta): void {
    super.fromMeta(option);
    this.toolset = option.toolset.map(this.toolManager.getOrCreate);
    this.openapi_desc = option.openapi_desc;
  }
  override toMeta = (): PluginMeta => {
    return {
      ...super.toMeta(),
      toolset: this.toolset.map((item) => item.toMeta()),
      openapi_desc: this.openapiDesc,
    };
  };
}
