import { AIChatMessageItemModel } from '@difizen/magent-chat';
import { autoFactory, AutoFactoryOption, Fetcher } from '@difizen/magent-core';
import { Deferred, inject, prop } from '@difizen/mana-app';
import type { ParsedEvent } from 'eventsource-parser';

import { AgentManager } from '../agent/agent-manager.js';
import type { AgentModel } from '../agent/agent-model.js';

import type {
  ChatEventChunk,
  ChatEventError,
  ChatEventResult,
  ChatEventStep,
  AUChatMessageItemOption,
} from './protocol.js';
import { AnswerState } from './protocol.js';

@autoFactory()
export class AUAgentChatMessageItem extends AIChatMessageItemModel {
  protected agentManager: AgentManager;
  agentReady: Promise<AgentModel>;
  protected agentDeferred: Deferred<AgentModel> = new Deferred<AgentModel>();

  @prop()
  agent?: AgentModel;

  @prop()
  declare state: AnswerState;

  constructor(
    @inject(AutoFactoryOption) option: AUChatMessageItemOption,
    @inject(Fetcher) fetcher: Fetcher,
    @inject(AgentManager) agentManager: AgentManager,
  ) {
    super(option);
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
  };

  protected getAgent = async () => {
    const agent = await this.agentManager.getOrCreate({ id: this.option['agentId'] });
    this.agent = agent;
    this.agent.fetchInfo();
    this.agentDeferred.resolve(agent);
  };

  override handleEventData(e: ParsedEvent, data: any) {
    if (e.event === 'chunk') {
      this.appendChunk(data as ChatEventChunk);
    }

    if (e.event === 'result') {
      this.handleResult(data as ChatEventResult);
    }

    if (e.event === 'steps') {
      this.handleSteps(data as ChatEventStep);
    }

    if (e.event === 'error') {
      this.handleError(data as ChatEventError);
    }
  }

  override appendChunk(e: ChatEventChunk) {
    this.content = `${this.content}${e.output}`;
  }

  handleError(e: ChatEventError) {
    // {"error": {"error_msg": "The node type is not supported"}, "type": "error"}
    this.error = { message: e.error.error_msg };
  }

  handleSteps(e: ChatEventStep) {
    // if (e.agent_id === this.agent?.id) {
    //   this.content = this.content + `${e.output}`;
    // }
  }

  handleResult(e: ChatEventResult) {
    this.content = e.output;
  }
}
