import { Deferred, inject, prop, transient } from '@difizen/mana-app';
import type { ParsedEvent } from 'eventsource-parser';

import { AgentManager } from '../agent/agent-manager.js';
import type { AgentModel } from '../agent/agent-model.js';
import { AxiosClient } from '../axios-client/protocol.js';

import { ChatMessageItem } from './chat-message-item.js';
import type {
  ChatErrorInfo,
  ChatEventChunk,
  ChatEventError,
  ChatEventResult,
  ChatEventStep,
} from './protocol.js';
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

  @prop()
  error: ChatErrorInfo;

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
  };

  protected getAgent = async () => {
    const agent = await this.agentManager.getOrCreate({ id: this.option.agentId });
    this.agent = agent;
    this.agent.fetchInfo();
    this.agentDeferred.resolve(agent);
  };

  handleEventData(e: ParsedEvent, data: any) {
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

  appendChunk(e: ChatEventChunk) {
    this.state = AnswerState.RECEIVING;
    this.content = `${this.content}${e.output}`;
  }

  handleError(e: ChatEventError) {
    this.state = AnswerState.FAIL;

    // {"error": {"error_msg": "The node type is not supported"}, "type": "error"}
    this.error = e.error;
  }

  handleSteps(e: ChatEventStep) {
    // if (e.agent_id === this.agent?.id) {
    //   this.content = this.content + `${e.output}`;
    // }
  }

  handleResult(e: ChatEventResult) {
    this.state = AnswerState.SUCCESS;
    this.content = e.output;
  }
}
