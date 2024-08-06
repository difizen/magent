import { inject, prop, transient } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';

import type { LLMMeta, PlannerMeta, PromptMeta, ToolMeta } from './protocol.js';
import { AgentConfigOption } from './protocol.js';

export const DefaultAgentConfigOptions: AgentConfigOption = {
  knowledge: [],
};

@transient()
export class AgentConfig {
  protected axios: AxiosClient;
  isDraft = true;

  @prop()
  llm: LLMMeta;

  @prop()
  prompt: PromptMeta;
  memory: string;
  planner: PlannerMeta;

  @prop()
  tool: ToolMeta[];

  option: AgentConfigOption;

  constructor(
    @inject(AgentConfigOption) option: AgentConfigOption,
    @inject(AxiosClient) axios: AxiosClient,
  ) {
    this.option = option;
    this.axios = axios;

    this.fromMeta(option);
  }

  protected fromMeta(option: AgentConfigOption = this.option) {
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
  }
}
