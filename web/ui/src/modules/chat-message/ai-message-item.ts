import { Deferred, inject, prop, transient } from '@difizen/mana-app';

import { AgentManager } from '../agent/agent-manager.js';
import type { AgentModel } from '../agent/agent-model.js';
import { AxiosClient } from '../axios-client/protocol.js';

import { ChatMessageItem } from './chat-message-item.js';
import type { ChatEventChunk, ChatEventResult, ChatEventStep } from './protocol.js';
import { AnswerState, ChatMessageItemOption } from './protocol.js';

@transient()
export class AIChatMessageItem extends ChatMessageItem {
  protected agentManager: AgentManager;
  agentReady: Promise<AgentModel>;
  protected agentDeferred: Deferred<AgentModel> = new Deferred<AgentModel>();

  @prop()
  agent?: AgentModel;

  @prop()
  declare state: AnswerState;

  constructor(
    @inject(ChatMessageItemOption) option: ChatMessageItemOption,
    @inject(AxiosClient) axios: AxiosClient,
    @inject(AgentManager) agentManager: AgentManager,
  ) {
    super(option, axios);
    this.agentManager = agentManager;
    this.agentReady = this.agentDeferred.promise;
    if (option.content) {
      this.state = AnswerState.SUCCESS;
    } else {
      this.state = AnswerState.WAITING;
    }
    this.initialize();
  }

  initialize = async () => {
    await this.getAgent();
    if (!this.agent) {
      throw new Error('Cannot access agent');
    }
    await this.agent.ready;
    if (!this.agent.planner?.members) {
      throw new Error('Missing PEER member');
    }
  };

  protected getAgent = async () => {
    const agent = await this.agentManager.getOrCreateAgent({ id: this.option.agentId });
    this.agent = agent;
    this.agent.fetchInfo();
    this.agentDeferred.resolve(agent);
  };

  appendChunk(e: ChatEventChunk) {
    this.content = `${this.content}${e.output}`;
  }
  handleSteps(e: ChatEventStep) {
    // if (e.agent_id === this.agent?.id) {
    //   this.content = this.content + `${e.output}`;
    // }
  }

  handleResult(e: ChatEventResult) {
    // this.content = e.output;
  }
}
