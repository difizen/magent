import { inject, prop, transient } from '@difizen/mana-app';

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

  received = false;
  planningChunkInfo = '';

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
    this.received = true;
    if (this.planningPlanner) {
      switch (e.agent_id) {
        case this.planningPlanner:
          this.planningChunkInfo = `${this.planningChunkInfo || ''}${e.output || ''}`;
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
  override handleSteps(e: ChatEventStep): void {
    this.received = true;
    let eventStep = 0;
    if (e.agent_id === this.planningPlanner) {
      eventStep = 0;
      if (this.lastChunkAgent === this.planningPlanner) {
        try {
          const data = JSON.parse(this.planningChunkInfo);
          this.planningContent = data.thought;
        } catch (e) {
          console.error(e);
        }
      }
      this.planningContent += '\n\n';
      this.planningContent += this.toContentStr(e.output as string | string[]);
    }
    if (e.agent_id === this.executingPlanner) {
      eventStep = 1;
      this.executingContent = e.output as ChatEventStepQA[];
    }
    if (e.agent_id === this.expressingPlanner) {
      eventStep = 2;
    }
    if (e.agent_id === this.reviewingPlanner) {
      eventStep = 3;
      this.reviewingContent = this.toContentStr(e.output as string | string[]);
    }
    if (eventStep > this.currentStep) {
      this.currentStep = eventStep;
    }
    this.steps[eventStep] = e;
  }

  override handleResult(e: ChatEventResult): void {
    this.received = true;
    this.currentStep = 4;
  }
}
