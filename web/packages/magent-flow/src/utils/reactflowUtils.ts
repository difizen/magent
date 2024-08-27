import { Edge } from '@xyflow/react';
import { cloneDeep } from 'lodash';
import { v4 } from 'uuid';

export function cleanEdges(nodes: any[], edges: Edge[]) {
  let newEdges = cloneDeep(edges);

  return newEdges;
}

export function getNodeId(nodeType: string) {
  return nodeType + '-' + v4();
}
