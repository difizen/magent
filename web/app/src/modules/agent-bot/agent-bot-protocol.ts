export interface AgentConfigToolMeta {
  key: string;
  [key: string]: any;
}
export interface AgentConfigDatasetMeta {
  key: string;
  [key: string]: any;
}
export interface AgentConfigModelMeta {
  key: string;
  [key: string]: any;
}
export interface AgentConfigMeta {
  persona: string;
  tools: AgentConfigToolMeta[];
  datasets: AgentConfigDatasetMeta[];
  model: AgentConfigModelMeta;
  [key: string]: any;
}
