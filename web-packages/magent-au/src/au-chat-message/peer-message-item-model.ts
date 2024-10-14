import { autoFactory, AutoFactoryOption, Fetcher } from '@difizen/magent-core';
import { inject, prop, transient } from '@difizen/mana-app';
import type { ParsedEvent } from 'eventsource-parser';

import { AgentManager } from '../agent/agent-manager.js';

import { AUAgentChatMessageItem } from './ai-message-item.js';
import type {
  ChatEventChunk,
  ChatEventError,
  ChatEventResult,
  ChatEventStep,
  ChatEventStepQA,
  StepContent,
} from './protocol.js';
import type { AUChatMessageItemOption } from './protocol.js';

@autoFactory()
export class PeerChatMessageItem extends AUAgentChatMessageItem {
  @prop()
  contentMap: Record<string, string> = {};

  @prop()
  planningPlanner: string;
  @prop()
  executingPlanner: string;
  @prop()
  expressingPlanner: string;
  @prop()
  reviewingPlanner: string;

  // @prop()
  // currentStep = 0;

  @prop()
  steps: ChatEventStep[] = [];

  lastChunkAgent?: string;

  @prop()
  received = false;

  // @prop()
  // planningContent = '';

  // @prop()
  // executingContent: ChatEventStepQA[] = [];

  // @prop()
  // expressingContent = '';

  // @prop()
  // reviewingContent = '';

  @prop()
  currRound: number;

  @prop()
  roundsContent: StepContent[];

  @prop()
  protected currRoundContent: StepContent;
  protected _isConstructorInitialized = false;

  constructor(
    @inject(AutoFactoryOption) option: AUChatMessageItemOption,
    @inject(Fetcher) fetcher: Fetcher,
    @inject(AgentManager) agentManager: AgentManager,
  ) {
    super(option, fetcher, agentManager);
    this.agentReady = this.agentDeferred.promise;
    this.addEmptyRoundContent(0);
    this.initialize();
    this._isConstructorInitialized = true;
  }

  /**
   * @param roundStartsAt 当前轮从第几步开始
   */
  protected addEmptyRoundContent = (roundStartsAt: number) => {
    if (this.currRound === undefined) {
      this.currRound = -1;
    }

    this.currRound += 1;
    this.currRoundContent = {
      currentStep: 0,
      roundStartsAt, // 第一轮肯定从planner开始
      planningContent: '',
      executingContent: [],
      expressingContent: '',
      reviewingContent: '',
    };

    if (!this.roundsContent) {
      this.roundsContent = [];
    }
    this.roundsContent.push(this.currRoundContent);
  };

  override initialize = async () => {
    await this.getAgent();
    if (!this.agent) {
      throw new Error('Cannot access agent');
    }
    await this.agent.ready;
    if (!this.agent.planner?.members) {
      throw new Error('Missing PEER member');
    }
    const members = this.agent?.planner?.members;
    if (!members) {
      return;
    }
    const planning = members[0];
    this.planningPlanner = planning.id;
    const executing = members[1];
    this.executingPlanner = executing.id;
    const expressing = members[2];
    this.expressingPlanner = expressing.id;
    const reviewing = members[3];

    this.currRoundContent.reviewingContent = this.contentMap[this.reviewingPlanner];
    this.currRoundContent.planningContent = this.contentMap[this.planningPlanner];
    this.currRoundContent.expressingContent = this.contentMap[this.expressingPlanner];
    this.contentMap[this.expressingPlanner] = this._content;
    this.reviewingPlanner = reviewing.id;
  };

  override get content(): string {
    if (this.currRoundContent.expressingContent) {
      return this.currRoundContent.expressingContent;
    }
    if (this.expressingPlanner) {
      return this.contentMap[this.expressingPlanner] || '';
    }
    return this._content || '';
  }

  override set content(v) {
    if (!this._isConstructorInitialized) {
      this._content = v;
      return;
    }
    if (this.currRoundContent.expressingContent) {
      this.currRoundContent.expressingContent = v;
    }
    if (this.expressingPlanner) {
      this.contentMap[this.expressingPlanner] = v;
    } else {
      this._content = v;
    }
  }

  /**
   *
   * @param agent_id 当前chunk的agent_id
   * 判断当前是不是需要开启新的一轮对话执行。
   */
  protected judgeAndAddEmptyRound = (agent_id: string) => {
    switch (agent_id) {
      case this.planningPlanner:
      case this.executingPlanner:
        // expressingContent有可能是undefined
        if (
          this.currRound >= 0 &&
          this.roundsContent[this.currRound].expressingContent &&
          this.roundsContent[this.currRound].expressingContent !== ''
        ) {
          this.addEmptyRoundContent(agent_id === this.planningPlanner ? 0 : 1);
        }
        break;
      case this.expressingPlanner:
        if (
          this.currRound >= 0 &&
          this.roundsContent[this.currRound].reviewingContent && // 有可能undefined
          this.roundsContent[this.currRound].reviewingContent !== ''
        ) {
          this.addEmptyRoundContent(2);
        }
        break;
      case this.reviewingPlanner:
        // 一般不会有某一轮对话一上来就是rwviewing
        break;
    }
  };

  override appendChunk(e: ChatEventChunk) {
    if (this.planningPlanner) {
      this.judgeAndAddEmptyRound(e.agent_id);
      switch (e.agent_id) {
        case this.planningPlanner:
          this.currRoundContent.planningContent = `${this.currRoundContent.planningContent || ''}${e.output || ''}`;
          try {
            const data = JSON.parse(this.currRoundContent.planningContent);
            this.currRoundContent.planningContent = data.thought;
            this.currRoundContent.planningContent += '\n\n';
            this.currRoundContent.planningContent += this.toContentStr(
              data.framework as string | string[],
            );
            this.currRoundContent.currentStep = 1;
          } catch (e) {
            // console.error(e);
          }
          break;
        case this.expressingPlanner:
          this.currRoundContent.expressingContent = `${this.currRoundContent.expressingContent || ''}${e.output || ''}`;
          break;
        case this.reviewingPlanner:
          this.currRoundContent.reviewingContent = `${this.currRoundContent.reviewingContent || ''}${e.output || ''}`;
          break;
        default:
          break;
      }
    } else {
      this.contentMap[e.agent_id] =
        `${this.contentMap[e.agent_id] || ''}${e.output || ''}`;
    }
    if (this.lastChunkAgent !== e.agent_id) {
      this.lastChunkAgent = e.agent_id;
    }
  }

  protected toContentStr = (out: string | string[]) => {
    if (typeof out === 'string') {
      return out;
    }
    if (out instanceof Array) {
      return out
        .map((i) => {
          return `* ${i}`;
        })
        .join('\n');
    }
    return '';
  };

  override handleEventData(e: ParsedEvent, data: any) {
    this.received = true;
    if (e.event === 'chunk') {
      this.appendChunk(data as ChatEventChunk);
    }
    let eventStep = 0;
    if (data.agent_id === this.planningPlanner) {
      eventStep = 0;
    }
    if (data.agent_id === this.executingPlanner) {
      eventStep = 1;
    }
    if (data.agent_id === this.expressingPlanner) {
      eventStep = 2;
    }
    if (data.agent_id === this.reviewingPlanner) {
      eventStep = 3;
    }
    if (eventStep > this.currRoundContent.currentStep) {
      this.currRoundContent.currentStep = eventStep;
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

  override handleSteps(e: ChatEventStep): void {
    let eventStep = 0;

    if (e.agent_id === this.planningPlanner) {
      eventStep = 1;
    }
    if (e.agent_id === this.executingPlanner) {
      eventStep = 2;
      this.currRoundContent.executingContent = e.output as ChatEventStepQA[];
    }
    if (e.agent_id === this.expressingPlanner) {
      eventStep = 3;
    }
    if (e.agent_id === this.reviewingPlanner) {
      eventStep = 4;
      this.currRoundContent.reviewingContent = this.toContentStr(
        e.output as string | string[],
      );
    }
    if (eventStep > this.currRoundContent.currentStep) {
      this.currRoundContent.currentStep = eventStep;
    }
    this.steps[eventStep] = e;
  }

  override handleResult(e: ChatEventResult): void {
    super.handleResult(e);
    const currRoundContent = this.roundsContent[this.currRound]; // TODO: 具体第几轮
    currRoundContent.currentStep = 4;
  }
}
