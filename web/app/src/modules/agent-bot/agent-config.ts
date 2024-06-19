import { Emitter, inject, prop, transient } from '@difizen/mana-app';
import debounce from 'lodash.debounce';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';

import type { AgentConfigInfo, AgentConfigModelMeta } from './protocol.js';
import { AgentConfigOption, AgentConfigType } from './protocol.js';

@transient()
export class AgentConfig extends AsyncModel<AgentConfig, AgentConfigOption> {
  protected axios: AxiosClient;
  id: number;

  bot_id: number;

  is_draft = true;

  protected onChanagedEmitter = new Emitter<AgentConfig>();

  get onChanged() {
    return this.onChanagedEmitter.event;
  }

  @prop()
  protected _persona?: string;

  get persona() {
    return this._persona;
  }
  set persona(v: string | undefined) {
    this._persona = v;
    this.changed();
  }

  @prop()
  protected _model?: AgentConfigModelMeta;
  get model() {
    return this._model;
  }
  set model(v: AgentConfigModelMeta | undefined) {
    this._model = v;
    this.changed();
  }

  @prop()
  config?: AgentConfigInfo;

  option?: AgentConfigOption;

  constructor(
    @inject(AgentConfigOption) option: AgentConfigOption,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    super();
    this.option = option;
    this.id = option.id;
    this.axios = axios;

    this.initialize(option);
  }

  override shouldInitFromMeta(option: AgentConfigOption): boolean {
    return AgentConfigType.isFullOption(option);
  }

  protected override fromMeta(option: AgentConfigOption): void {
    this.id = option.id;
    this.bot_id = option.bot_id;
    this.is_draft = option.is_draft || true;
    this._persona = option.config?.persona;
    this._model = option.config?.model;
    // TODO: tools & datasets
    super.fromMeta(option);
  }

  override async fetchInfo(option: AgentConfigOption): Promise<void> {
    const res = await this.axios.get<AgentConfigOption>(
      `api/v1/agent/configs/${option.id}`,
    );
    if (res.status === 200) {
      if (this.shouldInitFromMeta(res.data)) {
        this.fromMeta(res.data);
      }
    }
  }

  toMeta(): AgentConfigOption {
    return {
      id: this.id,
      bot_id: this.bot_id,
      is_draft: this.is_draft,
      config: {
        ...(this.config || {}),
        persona: this.persona,
        model: this.model,
      },
    };
  }

  protected deferSave: (meta?: AgentConfigOption) => Promise<boolean> | undefined =
    debounce(this.save.bind(this), 500);

  protected changed = () => {
    this.onChanagedEmitter.fire(this);
    this.deferSave();
  };

  async save(meta = this.toMeta()): Promise<boolean> {
    const res = await this.axios.put<number>(`api/v1/agent/configs/${this.id}`, meta);
    if (res.status === 200) {
      return res.data === 1;
    }
    return false;
  }
}
