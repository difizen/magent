import type { Edge, NodeType } from '@difizen/magent-flow';

import type { ComponentMeta } from '@/common/component/protocol.js';

// export interface Edge {
//   source_node_id: string;
//   target_node_id: string;
//   id: string;
// }

export interface Posiotion {
  x: number;
  y: number;
}
export interface Node {
  id: string;
  name: string;
  description: string;
  type: string;
  position: Posiotion;
  data?: any;
}

export interface Graph {
  edges: Edge[];
  nodes: NodeType[];
}

export interface WorkflowMeta extends ComponentMeta {
  graph: Graph;
}
