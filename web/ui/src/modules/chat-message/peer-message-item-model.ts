import { inject, prop, transient } from '@difizen/mana-app';

import { AgentManager } from '../agent/agent-manager.js';
import { AxiosClient } from '../axios-client/protocol.js';

import { AIChatMessageItem } from './ai-message-item.js';
import type { ChatEventChunk } from './protocol.js';
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
  steps: PeerSteps[] = [];

  @prop()
  planningContent = '';

  @prop()
  executingContent = '';

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
    await super.initialize();
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
          this.executingContent = this.contentMap[this.executingPlanner];
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
          break;
        case this.executingPlanner:
          this.executingContent = `${this.executingContent || ''}${e.output || ''}`;
          break;
        case this.expressingPlanner:
          this.expressingContent = `${this.expressingContent || ''}${e.output || ''}`;
          this.contentMap[this.expressingPlanner] = this._content;
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
  }
  override handleSteps(e: PeerSteps): void {
    this.currentStep += 1;
    this.steps[this.currentStep] = e;
  }
}
export interface PeerSteps {
  agent_id: string;
  output: (string | EAnswer)[];
  type: 'intermediate_steps';
}

interface EAnswer {
  input: string;
  output: string;
}
