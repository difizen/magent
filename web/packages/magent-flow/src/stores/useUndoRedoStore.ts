import type { Edge, Node } from '@xyflow/react';
import { cloneDeep } from 'lodash';
import { create } from 'zustand';

import { useFlowStore } from './useFlowStore';

interface FlowRedoUndoStoreType {
  undo: () => void;
  redo: () => void;
  takeSnapshot: () => void;
}

export type UseUndoRedoOptions = {
  maxHistorySize: number;
  enableShortcuts: boolean;
};

interface Snap {
  nodes: Node[];
  edges: Edge[];
}

const defaultOptions: UseUndoRedoOptions = {
  maxHistorySize: 100,
  enableShortcuts: true,
};

let past: Snap[] = [];

let future: Snap[] = [];

export const useUndoRedoStore = create<FlowRedoUndoStoreType>(() => ({
  takeSnapshot: () => {
    // const currentFlowId = get().currentFlowId;
    // push the current graph to the past state
    const flowStore = useFlowStore.getState();
    const newState = {
      nodes: cloneDeep(flowStore.nodes),
      edges: cloneDeep(flowStore.edges),
    };
    const pastLength = past?.length ?? 0;
    if (
      pastLength > 0 &&
      JSON.stringify(past[pastLength - 1]) === JSON.stringify(newState)
    ) {
      return;
    }
    if (pastLength > 0) {
      past = past.slice(pastLength - defaultOptions.maxHistorySize + 1, pastLength);

      past.push(newState);
    } else {
      past = [newState];
    }

    future = [];
  },
  undo: () => {
    console.log('🚀 ~ useUndoRedoStore ~ undo:');
    const newState = useFlowStore.getState();

    const pastLength = past?.length ?? 0;
    const pastState = past?.[pastLength - 1] ?? null;

    if (pastState) {
      past = past.slice(0, pastLength - 1);

      if (!future) {
        future = [];
      }
      future.push({
        nodes: newState.nodes,
        edges: newState.edges,
      });

      newState.setNodes(pastState.nodes);
      newState.setEdges(pastState.edges);
    }
  },
  redo: () => {
    const newState = useFlowStore.getState();

    const futureLength = future?.length ?? 0;
    const futureState = future?.[futureLength - 1] ?? null;

    if (futureState) {
      future = future.slice(0, futureLength - 1);

      if (!past) {
        past = [];
      }
      past.push({
        nodes: newState.nodes,
        edges: newState.edges,
      });

      newState.setNodes(futureState.nodes);
      newState.setEdges(futureState.edges);
    }
  },
}));
