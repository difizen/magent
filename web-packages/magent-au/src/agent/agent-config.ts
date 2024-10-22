import { Fetcher } from '@difizen/magent-core';
import { inject, prop, transient } from '@difizen/mana-app';

import type { LLMMeta } from '../model/protocol.js';
import type { PlannerMeta } from '../planner/protocol.js';
import { ToolManager } from '../tool/tool-manager.js';
import type { ToolModel } from '../tool/tool-model.js';

import type { PromptMeta } from './protocol.js';
import { AgentConfigOption } from './protocol.js';

export const DefaultAgentConfigOptions: AgentConfigOption = {
  knowledge: [],
};

@transient()
export class AgentConfig {
  protected fetcher: Fetcher;
  protected toolManager: ToolManager;
  isDraft = true;

  @prop()
  llm?: LLMMeta;

  @prop()
  prompt?: PromptMeta;
  memory: string;
  planner: PlannerMeta;

  @prop()
  tool: ToolModel[];

  option: AgentConfigOption;

  constructor(
    @inject(AgentConfigOption) option: AgentConfigOption,
    @inject(Fetcher) fetcher: Fetcher,
    @inject(ToolManager) toolManager: ToolManager,
  ) {
    this.option = option;
    this.fetcher = fetcher;
    this.toolManager = toolManager;

    this.fromMeta(option);
  }

  protected fromMeta(option: AgentConfigOption = this.option) {
    this.prompt = option.prompt;
    this.llm = option.llm;
    this.memory = option.memory ?? '';
    this.planner = option.planner ?? {
      id: '',
      nickname: 'string',
    };
    this.tool = option.tool?.map((item) => this.toolManager.getOrCreate(item)) ?? [];
  }
}
