import { inject, prop, transient } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { AsyncModel } from '@/common/async-model.js';

import { AxiosClient } from '../axios-client/protocol.js';
import type { KnowledgeModelOption } from '../knowledge/protocol.js';
import { LLMManager } from '../model/llm-manager.js';
import type { LLMModel } from '../model/llm-model.js';
import type { PlannerMeta } from '../planner/protocol.js';
import type { ToolMeta } from '../tool/protocol.js';
import { ToolManager } from '../tool/tool-manager.js';

import { AgentConfigManager } from './agent-config-manager.js';
import type { PromptMeta } from './protocol.js';
import { AgentModelType, AgentModelOption } from './protocol.js';

class Prompt implements PromptMeta {
  @prop()
  introduction = '';
  @prop()
  target = '';
  @prop()
  instruction = '';

  constructor(option?: PromptMeta) {
    if (option) {
      this.introduction = option.introduction;
      this.target = option.target;
      this.instruction = option.instruction;
    }
  }
  toMeta = () => {
    return {
      introduction: this.introduction,
      instruction: this.instruction,
      target: this.target,
    };
  };
}

@transient()
export class AgentModel extends AsyncModel<AgentModel, AgentModelOption> {
  @inject(ToolManager) toolManager: ToolManager;

  axios: AxiosClient;
  // configManager: AgentConfigManager;
  protected llmManager: LLMManager;

  id: string;

  @prop()
  name?: string;

  @prop()
  avatar?: string;

  @prop()
  description?: string;

  @prop()
  llm?: LLMModel;

  @prop()
  prompt?: Prompt;

  memory: string;

  @prop()
  planner?: PlannerMeta;

  @prop()
  openingSpeech?: string;

  @prop()
  tool: ToolMeta[] = [];

  @prop()
  knowledge?: KnowledgeModelOption[];

  @prop()
  mtime?: Dayjs;

  @prop()
  saving?: boolean;

  option: AgentModelOption;

  fetching?: Promise<void>;

  constructor(
    @inject(AgentModelOption) option: AgentModelOption,
    @inject(AgentConfigManager) configManager: AgentConfigManager,
    @inject(LLMManager) llmManager: LLMManager,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    super();
    this.option = option;
    // this.configManager = configManager;
    this.axios = axios;
    this.llmManager = llmManager;

    this.id = option.id;
    this.initialize(option);
  }

  shouldInitFromMeta(): boolean {
    return true;
  }

  protected override fromMeta(option: AgentModelOption = this.option) {
    this.id = option.id;
    this.name = option.nickname;
    this.avatar = option.avatar;
    this.description = option.description;

    this.prompt = option.prompt ? new Prompt(option.prompt) : undefined;
    this.llm = option.llm ? this.llmManager.factory(option.llm) : option.llm;
    this.memory = option.memory ?? '';
    this.planner = option.planner;
    this.knowledge = option.knowledge;
    this.tool = option.tool ?? [];
    this.openingSpeech = option.opening_speech;
    if (option.mtime) {
      this.mtime = dayjs.unix(option.mtime);
    }

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
      prompt: this.prompt?.toMeta(),
      llm: this.llm?.toMeta(),
      planner: this.planner,
      tool: this.tool,
      memory: this.memory,
      opening_speech: this.openingSpeech,
      knowledge: this.knowledge,
    };
  }

  toJSON(): string {
    return JSON.stringify(this.toMeta());
  }

  save = async (): Promise<boolean> => {
    this.saving = true;
    const res = await this.axios.put<number>(
      `/api/v1/agents/${this.id}`,
      this.toMeta(),
    );
    this.saving = false;
    return res.status === 200;
  };

  async fetchKnowdledgeList() {
    try {
      const res = await this.axios.get<KnowledgeModelOption[]>(`/api/v1/knowledge`);
      if (res.status === 200 && res.data?.length) {
        return res.data;
      }
    } catch (e) {
      console.error('获取知识库失败');
    }
    return [
      {
        id: 'string',
        nickname: '测试知识库',
        description: '测试知识库',
      },
    ];
  }
}
