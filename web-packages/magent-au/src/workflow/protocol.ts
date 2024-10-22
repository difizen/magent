import type { Edge, NodeType } from '@difizen/magent-flow';

import type { ComponentMeta } from '../component-model/protocol.js';

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
