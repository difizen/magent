import type { NodeType, Edge } from '@difizen/magent-flow';

import { nodeIconMap } from './flow-with-tabs/index.js';

export const OutputNodeParser = (node: NodeType) => {
  const obj: any = node.data;
  obj['position'] = node.position;
  obj['data'] = obj['config'];

  delete obj['config'];
  delete obj['icon'];
  return obj as NodeType;
};

export const OutputEdgeParser = (edge: Edge) => {
  return {
    id: edge.id.toString(),
    target_handler: edge.targetHandle,
    source_handler: edge.sourceHandle,
    source_node_id: edge.source,
    target_node_id: edge.target,
  } as any;
};

export const InitNodeParser = (node: NodeType) => {
  node['config'] = node['data'];
  delete node['data'];
  const obj: NodeType = {
    id: node.id.toString(),
    type: node.type,
    position: node.position || { x: 0, y: 0 },
    data: {
      ...node,
      icon:
        nodeIconMap[node.type as keyof typeof nodeIconMap] ||
        'https://mdn.alipayobjects.com/huamei_xbkogb/afts/img/A*PzmdRpvZz58AAAAAAAAAAAAADqarAQ/original',
    },
  };

  return obj;
};

export const InitEdgeParser = (edge: any) => {
  const obj: Edge = {
    id: edge.id,
    targetHandle: edge.target_handler,
    sourceHandle: edge.source_handler,
    source: edge.source_node_id.toString(),
    target: edge.target_node_id.toString(),
  };
  return obj;
};
