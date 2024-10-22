import { AsyncModel, Fetcher } from '@difizen/magent-core';
import { Emitter, inject, prop, transient } from '@difizen/mana-app';
import debounce from 'lodash.debounce';

import { ToolConfigOption, ToolConfigType } from './protocol.js';

@transient()
export class ToolConfig extends AsyncModel<ToolConfig, ToolConfigOption> {
  protected fetcher: Fetcher;
  id: number;

  pluginId: number;

  apis?: number[] = [];

  isDraft = true;

  protected onChanagedEmitter = new Emitter<ToolConfig>();

  get onChanged() {
    return this.onChanagedEmitter.event;
  }

  @prop()
  protected _pluginOpenapiDesc: string;

  get pluginOpenapiDesc() {
    return this._pluginOpenapiDesc;
  }
  set pluginOpenapiDesc(v: string) {
    this._pluginOpenapiDesc = v;
    this.changed();
  }

  // @prop()
  // config?: ToolConfigInfo;

  option?: ToolConfigOption;

  constructor(
    @inject(ToolConfigOption) option: ToolConfigOption,
    @inject(Fetcher) fetcher: Fetcher,
  ) {
    super();
    this.option = option;
    this.id = option.id;
    this.fetcher = fetcher;

    this.initialize(option);
  }

  override shouldInitFromMeta(option: ToolConfigOption): boolean {
    return ToolConfigType.isFullOption(option);
  }

  protected override fromMeta(option: ToolConfigOption): void {
    this.id = option.id;
    this.pluginId = option.plugin_id;
    this.isDraft = option.is_draft || true;
    this.apis = option.apis;
    this._pluginOpenapiDesc = option.plugin_openapi_desc;
    super.fromMeta(option);
  }

  override async fetchInfo(option: ToolConfigOption): Promise<void> {
    const res = await this.fetcher.get<ToolConfigOption>(
      `api/v1/plugins/configs/${option.id}`,
    );
    if (res.status === 200) {
      if (this.shouldInitFromMeta(res.data)) {
        this.fromMeta(res.data);
      }
    }
  }

  toMeta(): ToolConfigOption {
    return {
      id: this.id,
      plugin_id: this.pluginId,
      is_draft: this.isDraft,
      plugin_openapi_desc: this.pluginOpenapiDesc,
      apis: this.apis,
    };
  }

  protected deferSave: (meta?: ToolConfigOption) => Promise<boolean> | undefined =
    debounce(this.save.bind(this), 500);

  protected changed = () => {
    this.onChanagedEmitter.fire(this);
    this.deferSave();
  };

  async save(meta = this.toMeta()): Promise<boolean> {
    const res = await this.fetcher.put<number>(
      `api/v1/plugins/configs/${this.id}`,
      meta,
    );
    if (res.status === 200) {
      return res.data === 1;
    }
    return false;
  }
}
