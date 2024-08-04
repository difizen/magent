import { inject, transient } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';

import type { LLMMeta, PlannerMeta, PromptMeta, ToolMeta } from './protocol.js';
import { AgentConfigOption } from './protocol.js';

@transient()
export class AgentConfig {
  protected axios: AxiosClient;
  isDraft = true;

  llm?: LLMMeta;
  prompt?: PromptMeta;
  memory?: string;
  planner?: PlannerMeta;
  tool?: ToolMeta[];

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
    this.prompt = option.prompt;
    this.llm = option.llm;
    this.memory = option.memory;
    this.planner = option.planner;
    this.tool = option.tool;
  }
}
