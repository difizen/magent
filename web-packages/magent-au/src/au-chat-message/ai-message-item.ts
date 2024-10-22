import type { ChatEventChunk, ChatEventError, IChatEvent } from '@difizen/magent-chat';
import { ChatEvent } from '@difizen/magent-chat';
import { AIChatMessageItemModel } from '@difizen/magent-chat';
import { autoFactory, AutoFactoryOption, Fetcher } from '@difizen/magent-core';
import { Deferred, inject, prop } from '@difizen/mana-app';

import { AgentManager } from '../agent/agent-manager.js';
import type { AgentModel } from '../agent/agent-model.js';

import type {
  ChatEventResult,
  ChatEventStep,
  AUChatMessageItemOption,
} from './protocol.js';
import { AUChatEvent } from './protocol.js';
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

  override handleEventData(e: IChatEvent) {
    if (ChatEvent.isChunk(e)) {
      this.appendChunk(e as ChatEventChunk);
    }

    if (AUChatEvent.isResult(e)) {
      this.handleResult(e as ChatEventResult);
    }

    if (AUChatEvent.isStep(e)) {
      this.handleSteps(e as ChatEventStep);
    }

    if (ChatEvent.isError(e)) {
      this.handleError(e as ChatEventError);
    }
  }

  override appendChunk(e: ChatEventChunk) {
    this.content = `${this.content}${e.output}`;
  }

  handleSteps(e: ChatEventStep) {
    //
  }
}
