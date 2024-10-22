import type { AgentModelOption } from '../agent/protocol.js';

export interface PlannerMeta {
  id: string;
  nickname: string;
  members?: AgentModelOption[];
}

export interface WorkflowPlannerMeta extends PlannerMeta {
  workflow_id: string;
}
