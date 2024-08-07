import { Deferred, inject, prop, transient } from '@difizen/mana-app';

import { AsyncModel } from '../../common/async-model.js';
import { AxiosClient } from '../axios-client/index.js';

import { AgentConfigManager } from './agent-config-manager.js';
import type { AgentConfig } from './agent-config.js';
import type { LLMMeta, PromptMeta, PlannerMeta, ToolMeta } from './protocol.js';
import { AgentModelType, AgentModelOption } from './protocol.js';

@transient()
export class AgentModel extends AsyncModel<AgentModel, AgentModelOption> {
  axios: AxiosClient;
  // configManager: AgentConfigManager;

  id: string;

  @prop()
  name?: string;

  @prop()
  avatar?: string;

  @prop()
  description?: string;

  @prop()
  draft?: AgentConfig;

  @prop()
  config?: AgentConfig;

  @prop()
  llm: LLMMeta;

  @prop()
  prompt: PromptMeta;
  memory: string;

  @prop()
  planner?: PlannerMeta;

  @prop()
  openingSpeech?: string;

  @prop()
  tool: ToolMeta[];

  // protected draftDeferred = new Deferred<AgentConfig>();

  // get draftReady() {
  //   return this.draftDeferred.promise;
  // }

  option: AgentModelOption;

  fetching?: Promise<void>;

  constructor(
    @inject(AgentModelOption) option: AgentModelOption,
    @inject(AgentConfigManager) configManager: AgentConfigManager,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    super();
    this.option = option;
    // this.configManager = configManager;
    this.axios = axios;

    this.id = option.id;
    this.initialize(option);
  }

  shouldInitFromMeta(): boolean {
    return true;
  }

  updateOption(option: AgentModelOption) {
    // TODO:
  }

  protected override fromMeta(option: AgentModelOption = this.option) {
    this.id = option.id;
    this.name = option.nickname;
    this.avatar = option.avatar;
    this.description = option.description;

    this.prompt = option.prompt ?? {
      instruction: '',
      introduction: '',
      target: '',
    };
    this.llm = option.llm ?? {
      id: '',
      nickname: '',
      temperature: 0,
      model_name: ['gptx'],
    };
    this.memory = option.memory ?? '';
    this.planner = option.planner ?? {
      id: '',
      nickname: 'string',
    };
    this.tool = option.tool ?? [];
    this.openingSpeech = option.opening_speech;

    if (AgentModelType.isFullOption(option)) {
      super.fromMeta(option);
    }
  }

  protected async doFetchInfo(option: AgentModelOption = this.option) {
    const res = await this.axios.get<AgentModelOption>(`/api/v1/agents/${option.id}`);
    if (res.status === 200) {
      this.fromMeta(res.data);
    }
  }

  async fetchInfo(option: AgentModelOption = this.option, force = false) {
    if (!this.fetching || force) {
      this.fetching = this.doFetchInfo(option);
    }
    return this.fetching;
  }

  toMeta(): AgentModelOption {
    return {
      ...this.option,
      id: this.id,
      nickname: this.name,
      avatar: this.avatar,
      description: this.description,
      prompt: this.prompt,
      llm: this.llm,
      planner: this.planner,
      tool: this.tool,
      memory: this.memory,
      opening_speech: this.openingSpeech,
    };
  }

  toJSON(): string {
    return JSON.stringify(this.toMeta());
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
