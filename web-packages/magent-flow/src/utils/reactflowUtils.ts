import dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';
import { cloneDeep } from 'lodash';
import { v4 } from 'uuid';

export function cleanEdges(nodes: Node[], edges: Edge[]) {
  const newEdges = cloneDeep(edges);

  return newEdges;
}

export function getNodeId(nodeType: string) {
  return nodeType + '-' + v4();
}

export const getLayoutByDagre = (originNodes: Node[], originEdges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodes = cloneDeep(originNodes).filter((node) => !node.parentId);
  const edges = cloneDeep(originEdges);
  dagreGraph.setGraph({
    rankdir: 'LR',
    // align: 'UL',
    nodesep: 100,
    ranksep: 100,
    // ranker: 'tight-tree',
    // marginx: 1300,
    // marginy: 1200,
  });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.measured.width!,
      height: node.measured.height!,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return dagreGraph;
};

export const findNodes = (
  nodeId: string,
  nodes: Node[],
  edge: Edge[],
  onlyParent?: boolean,
) => {
  if (onlyParent) {
    return nodes.filter((node) =>
      edge
        .filter((item) => item.target === nodeId)
        ?.map((item) => item.source)
        .includes(node.id),
    );
  }

  return;
};
