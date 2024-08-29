import type { NodeType } from '@flow/interfaces/flow.js';
import { cleanEdges, getNodeId } from '@flow/utils/reactflowUtils.js';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
  Viewport,
  XYPosition,
} from '@xyflow/react';
import { addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import { cloneDeep } from 'lodash';
import { create } from 'zustand';

interface AdjacencyList {
  [key: number]: number[];
}

interface FlowStoreType {
  nodes: Node[];
  edges: Edge[];
  initFlow: (grapg: { nodes: Node[]; edges: Edge[] }) => {
    nodes: Node[];
    edges: Edge[];
  };
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;

  reactFlowInstance: ReactFlowInstance | null;
  setReactFlowInstance: (newState: ReactFlowInstance) => void;
  setNodes: (
    update: Node[] | ((oldState: Node[]) => Node[]),
    skipSave?: boolean,
  ) => void;
  setEdges: (
    update: Edge[] | ((oldState: Edge[]) => Edge[]),
    skipSave?: boolean,
  ) => void;
  setNode: (id: string, update: Node | ((oldState: Node) => Node)) => void;
  getNode: (id: string) => Node | undefined;
  deleteNode: (nodeId: string | Array<string>) => void;
  deleteEdge: (edgeId: string | Array<string>) => void;
  onConnect: (connection: Connection) => void;
  getFlow: () => { nodes: Node[]; edges: Edge[]; viewport: Viewport };
  paste: any;

  findUpstreamNodes: (id: string) => Node[];
}

export const useFlowStore = create<FlowStoreType>((set, get) => {
  // DFS 查找上游节点
  const findUpstreamNodes = (
    nodes: Node[],
    edges: Edge[],
    targetNode: string,
  ): Node[] => {
    const adjList: AdjacencyList = {};

    nodes.forEach((node) => {
      adjList[node.id] = [];
    });
    edges.forEach((edge) => {
      adjList[edge.source].push(edge.target);
    });

    const visited = new Set<string>();
    const result = new Set<string>();

    const dfs = (node: string) => {
      if (visited.has(node)) {
        return;
      }
      visited.add(node);

      if (adjList[node]) {
        adjList[node].forEach((upstreamNode) => {
          result.add(upstreamNode);
          dfs(upstreamNode);
        });
      }
    };

    dfs(targetNode);

    return get().nodes.filter((node) => Array.from(result).includes(node.id));
  };

  return {
    nodes: [],
    edges: [],
    initFlow: (graph: { nodes: Node[]; edges: Edge[] }) => {
      set({
        nodes: graph.nodes,
        edges: graph.edges,
      });
    },
    reactFlowInstance: null,
    setReactFlowInstance: (newState) => {
      set({ reactFlowInstance: newState });
    },
    getFlow: () => {
      return {
        nodes: get().nodes,
        edges: get().edges,
        viewport: get().reactFlowInstance?.getViewport() ?? {
          x: 0,
          y: 0,
          zoom: 1,
        },
      };
    },
    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },

    setNode: (id: string, change: Node | ((oldState: Node) => Node)) => {
      const newChange =
        typeof change === 'function'
          ? change(get().nodes.find((node) => node.id === id)!)
          : change;
      get().setNodes((oldNodes) =>
        oldNodes.map((node) => {
          if (node.id === id) {
            // if ((node.data as NodeDataType).node?.frozen) {
            //   (newChange.data as NodeDataType).node!.frozen = false;
            // }
            return newChange;
          }
          return node;
        }),
      );
    },
    setNodes: (change) => {
      const newChange = typeof change === 'function' ? change(get().nodes) : change;
      const newEdges = cleanEdges(newChange, get().edges);
      // const { inputs, outputs } = getInputsAndOutputs(newChange);

      set({
        edges: newEdges,
        nodes: newChange,
        // flowState: undefined,
        // inputs,
        // outputs,
        // hasIO: inputs.length > 0 || outputs.length > 0,
      });

      // const flowsManager = useFlowsManagerStore.getState();
      // if (!get().isBuilding && !skipSave && get().onFlowPage) {
      //   flowsManager.autoSaveCurrentFlow(
      //     newChange,
      //     newEdges,
      //     get().reactFlowInstance?.getViewport() ?? { x: 0, y: 0, zoom: 1 },
      //   );
      // }
    },

    setEdges: (change) => {
      const newChange = typeof change === 'function' ? change(get().edges) : change;
      set({
        edges: newChange,
        // flowState: undefined,
      });

      // const flowsManager = useFlowsManagerStore.getState();
      // if (!get().isBuilding && !skipSave && get().onFlowPage) {
      //   flowsManager.autoSaveCurrentFlow(
      //     get().nodes,
      //     newChange,
      //     get().reactFlowInstance?.getViewport() ?? { x: 0, y: 0, zoom: 1 },
      //   );
      // }
    },
    getNode: (id: string) => {
      return get().nodes.find((node) => node.id === id);
    },

    onConnect: (connection) => {
      let newEdges: Edge[] = [];
      get().setEdges((oldEdges) => {
        newEdges = addEdge(
          {
            ...connection,
            data: {
              targetHandle: connection.targetHandle!,
              sourceHandle: connection.sourceHandle!,
            },
            type: 'custom',
          },
          oldEdges,
        );

        return newEdges;
      });
    },
    deleteNode: (nodeId) => {
      get().setNodes(
        get().nodes.filter((node) =>
          typeof nodeId === 'string' ? node.id !== nodeId : !nodeId.includes(node.id),
        ),
      );
    },
    deleteEdge: (edgeId) => {
      get().setEdges(
        get().edges.filter((edge) =>
          typeof edgeId === 'string' ? edge.id !== edgeId : !edgeId.includes(edge.id),
        ),
      );
    },
    paste: (selection: { nodes: Node[]; edge: Edge[] }, position: XYPosition) => {
      //TODO:页面唯一节点检测
      // if (
      //   selection.nodes.some((node) => node.data.type === 'ChatInput') &&
      //   checkChatInput(get().nodes)
      // ) {
      //   useAlertStore.getState().setErrorData({
      //     title: 'Error pasting components',
      //     list: ['You can only have one ChatInput component in the flow'],
      //   });
      //   return;
      // }

      let minimumX = Infinity;
      let minimumY = Infinity;
      // let idsMap = {};
      let newNodes: Node[] = get().nodes;
      // let newEdges = get().edges;
      selection.nodes.forEach((node: Node) => {
        if (node.position.y < minimumY) {
          minimumY = node.position.y;
        }
        if (node.position.x < minimumX) {
          minimumX = node.position.x;
        }
      });

      const insidePosition = position.paneX
        ? { x: position.paneX + position.x, y: position.paneY! + position.y }
        : get().reactFlowInstance!.screenToFlowPosition({
            x: position.x,
            y: position.y,
          });

      selection.nodes.forEach((node: Node) => {
        // Generate a unique node ID
        const newId = getNodeId(node.data.type as string);

        // idsMap[node.id] = newId;

        // Create a new node object
        const newNode: NodeType = {
          id: newId,
          type: node.data.type,
          position: {
            x: insidePosition.x + node.position!.x - minimumX,
            y: insidePosition.y + node.position!.y - minimumY,
          },
          data: {
            ...cloneDeep(node.data),
            id: newId,
          } as any,
        };
        // updateGroupRecursion(
        //   newNode,
        //   selection.edges,
        //   useGlobalVariablesStore.getState().unavaliableFields,
        //   useGlobalVariablesStore.getState().globalVariablesEntries,
        // );

        // Add the new node to the list of nodes in state
        newNodes = newNodes
          .map((node) => ({ ...node, selected: false }))
          .concat({ ...newNode, selected: false });
      });
      get().setNodes(newNodes);

      // selection.edges.forEach((edge: Edge) => {
      //   let source = idsMap[edge.source];
      //   let target = idsMap[edge.target];
      //   const sourceHandleObject: sourceHandleType = scapeJSONParse(
      //     edge.sourceHandle!,
      //   );
      //   let sourceHandle = scapedJSONStringfy({
      //     ...sourceHandleObject,
      //     id: source,
      //   });
      //   sourceHandleObject.id = source;

      //   edge.data.sourceHandle = sourceHandleObject;
      //   const targetHandleObject: targetHandleType = scapeJSONParse(
      //     edge.targetHandle!,
      //   );
      //   let targetHandle = scapedJSONStringfy({
      //     ...targetHandleObject,
      //     id: target,
      //   });
      //   targetHandleObject.id = target;
      //   edge.data.targetHandle = targetHandleObject;
      //   let id = getHandleId(source, sourceHandle, target, targetHandle);
      //   newEdges = addEdge(
      //     {
      //       source,
      //       target,
      //       sourceHandle,
      //       targetHandle,
      //       id,
      //       data: cloneDeep(edge.data),
      //       selected: false,
      //     },
      //     newEdges.map((edge) => ({ ...edge, selected: false })),
      //   );
      // });
      // get().setEdges(newEdges);
    },
    findUpstreamNodes: (id: string) => {
      return findUpstreamNodes(get().nodes, get().edges, id);
    },
  };
});
