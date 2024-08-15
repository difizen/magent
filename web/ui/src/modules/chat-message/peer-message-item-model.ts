import { inject, prop, transient } from '@difizen/mana-app';
import type { ParsedEvent } from 'eventsource-parser';

import { AgentManager } from '../agent/agent-manager.js';
import { AxiosClient } from '../axios-client/protocol.js';

import { AIChatMessageItem } from './ai-message-item.js';
import type {
  ChatEventChunk,
  ChatEventResult,
  ChatEventStep,
  ChatEventStepQA,
} from './protocol.js';
import { ChatMessageItemOption } from './protocol.js';

@transient()
export class PeerChatMessageItem extends AIChatMessageItem {
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

  @prop()
  currentStep = 0;

  @prop()
  steps: ChatEventStep[] = [];

  lastChunkAgent?: string;

  @prop()
  received = false;

  @prop()
  planningContent = '';

  @prop()
  executingContent: ChatEventStepQA[] = [];

  @prop()
  expressingContent = '';

  @prop()
  reviewingContent = '';

  constructor(
    @inject(ChatMessageItemOption) option: ChatMessageItemOption,
    @inject(AxiosClient) axios: AxiosClient,
    @inject(AgentManager) agentManager: AgentManager,
  ) {
    super(option, axios, agentManager);
    this.agentReady = this.agentDeferred.promise;
    this.initialize();
  }

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
    this.reviewingContent = this.contentMap[this.reviewingPlanner];

    this.planningContent = this.contentMap[this.planningPlanner];
    this.expressingContent = this.contentMap[this.expressingPlanner];
    this.contentMap[this.expressingPlanner] = this._content;
    this.reviewingPlanner = reviewing.id;

    members.forEach((m) => {
      switch (m.planner?.id) {
        case 'planning_planner':
          this.planningPlanner = m.id;
          this.planningContent = this.contentMap[this.planningPlanner];
          break;
        case 'executing_planner':
          this.executingPlanner = m.id;
          break;
        case 'reviewing_planner':
          this.reviewingContent = this.contentMap[this.reviewingPlanner];
          this.reviewingPlanner = m.id;
          break;
        case 'expressing_planner':
          this.expressingPlanner = m.id;
          this.expressingContent = this.contentMap[this.expressingPlanner];
          this.contentMap[this.expressingPlanner] = this._content;
          break;
      }
    });
  };

  override get content(): string {
    if (this.expressingContent) {
      return this.expressingContent;
    }
    if (this.expressingPlanner) {
      return this.contentMap[this.expressingPlanner] || '';
    }
    return this._content || '';
  }

  override set content(v) {
    if (this.expressingContent) {
      this.expressingContent = v;
    }
    if (this.expressingPlanner) {
      this.contentMap[this.expressingPlanner] = v;
    } else {
      this._content = v;
    }
  }

  override appendChunk(e: ChatEventChunk) {
    if (this.planningPlanner) {
      switch (e.agent_id) {
        case this.planningPlanner:
          this.planningContent = `${this.planningContent || ''}${e.output || ''}`;
          try {
            const data = JSON.parse(this.planningContent);
            this.planningContent = data.thought;
            this.planningContent += '\n\n';
            this.planningContent += this.toContentStr(
              data.framework as string | string[],
            );
            this.currentStep = 1;
          } catch (e) {
            // console.error(e);
          }
          break;
        case this.expressingPlanner:
          this.expressingContent = `${this.expressingContent || ''}${e.output || ''}`;
          break;
        case this.reviewingPlanner:
          this.reviewingContent = `${this.reviewingContent || ''}${e.output || ''}`;
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
    if (eventStep > this.currentStep) {
      this.currentStep = eventStep;
    }

    if (e.event === 'result') {
      this.handleResult(data as ChatEventResult);
    }

    if (e.event === 'steps') {
      this.handleSteps(data as ChatEventStep);
    }
  }

  override handleSteps(e: ChatEventStep): void {
    let eventStep = 0;
    if (e.agent_id === this.planningPlanner) {
      eventStep = 1;
    }
    if (e.agent_id === this.executingPlanner) {
      eventStep = 2;
      this.executingContent = e.output as ChatEventStepQA[];
    }
    if (e.agent_id === this.expressingPlanner) {
      eventStep = 3;
    }
    if (e.agent_id === this.reviewingPlanner) {
      eventStep = 4;
      this.reviewingContent = this.toContentStr(e.output as string | string[]);
    }
    if (eventStep > this.currentStep) {
      this.currentStep = eventStep;
    }
    this.steps[eventStep] = e;
  }

  override handleResult(e: ChatEventResult): void {
    this.currentStep = 4;
  }
}
