export interface PlannerMeta {
  id: string;
  nickname: string;
  members?: string[];
}

export interface WorkflowPlannerMeta extends PlannerMeta {
  workflow_id: string;
}
