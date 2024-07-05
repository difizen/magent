import { Emitter, inject, prop, transient } from '@difizen/mana-app';
import debounce from 'lodash.debounce';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';

import { PluginConfigOption, PluginConfigType } from './protocol.js';
import {} from './protocol.js';

@transient()
export class PluginConfig extends AsyncModel<PluginConfig, PluginConfigOption> {
  protected axios: AxiosClient;
  id: number;

  pluginId: number;

  isDraft = true;

  protected onChanagedEmitter = new Emitter<PluginConfig>();

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
  // config?: PluginConfigInfo;

  option?: PluginConfigOption;

  constructor(
    @inject(PluginConfigOption) option: PluginConfigOption,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    super();
    this.option = option;
    this.id = option.id;
    this.axios = axios;

    this.initialize(option);
  }

  override shouldInitFromMeta(option: PluginConfigOption): boolean {
    return PluginConfigType.isFullOption(option);
  }

  protected override fromMeta(option: PluginConfigOption): void {
    this.id = option.id;
    this.pluginId = option.plugin_id;
    this.isDraft = option.is_draft || true;
    this._pluginOpenapiDesc = option.plugin_openapi_desc;
    super.fromMeta(option);
  }

  override async fetchInfo(option: PluginConfigOption): Promise<void> {
    const res = await this.axios.get<PluginConfigOption>(
      `api/v1/plugins/configs/${option.id}`,
    );
    if (res.status === 200) {
      if (this.shouldInitFromMeta(res.data)) {
        this.fromMeta(res.data);
      }
    }
  }

  toMeta(): PluginConfigOption {
    return {
      id: this.id,
      plugin_id: this.pluginId,
      is_draft: this.isDraft,
      plugin_openapi_desc: this.pluginOpenapiDesc,
    };
  }

  protected deferSave: (meta?: PluginConfigOption) => Promise<boolean> | undefined =
    debounce(this.save.bind(this), 500);

  protected changed = () => {
    this.onChanagedEmitter.fire(this);
    this.deferSave();
  };

  async save(meta = this.toMeta()): Promise<boolean> {
    const res = await this.axios.put<number>(`api/v1/plugins/configs/${this.id}`, meta);
    if (res.status === 200) {
      return res.data === 1;
    }
    return false;
  }
}
