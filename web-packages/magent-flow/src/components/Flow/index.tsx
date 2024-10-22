import { Background, ReactFlow } from '@xyflow/react';
import type { Connection, OnSelectionChangeParams } from '@xyflow/react';
import React, { useCallback, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { EventEmitterContextProvider } from '../../context/event-emitter.js';
import type { NodeDataType, NodeType } from '../../interfaces/flow.js';
import { useFlowStore } from '../../stores/useFlowStore.js';
import { useShortcutsStore } from '../../stores/useShortcutsStore.js';
import { useUndoRedoStore } from '../../stores/useUndoRedoStore.js';
import { getNodeId } from '../../utils/reactflowUtils.js';
import CustomEdge from '../CustomEdge/index.js';
import { FlowController } from '../FlowController/index.js';

import {
  handleCopy,
  handleCut,
  handleDelete,
  handleDuplicate,
  handlePaste,
  handleRedo,
  handleUndo,
} from './keys.js';
import '@xyflow/react/dist/style.css';

const edgeTypes = {
  custom: CustomEdge,
};

interface FlowProps {
  miniMap?: boolean;
  classNames?: string;
  nodeTypes: any;
  toolbar: React.ReactNode;
}

function Flow(props: FlowProps) {
  const { miniMap = true, classNames, nodeTypes, toolbar } = props;
  const position = useRef({ x: 0, y: 0 });
  const [lastSelection, setLastSelection] = useState<OnSelectionChangeParams | null>(
    null,
  );
  const reactFlowWrapper = useRef<any>(null);

  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);
  // const setNodes = useFlowStore((state) => state.setNodes);
  // const setEdges = useFlowStore((state) => state.setEdges);
  // const reactFlowInstance = useFlowStore((state) => state.reactFlowInstance);
  const setReactFlowInstance = useFlowStore((state) => state.setReactFlowInstance);
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const deleteEdge = useFlowStore((state) => state.deleteEdge);
  const onConnect = useFlowStore((state) => state.onConnect);

  const paste = useFlowStore((state) => state.paste);

  const undo = useUndoRedoStore((state) => state.undo);
  const redo = useUndoRedoStore((state) => state.redo);
  const takeSnapshot = useUndoRedoStore((state) => state.takeSnapshot);

  // Hot keys
  const undoAction = useShortcutsStore((state) => state.undo);
  const redoAction = useShortcutsStore((state) => state.redo);
  const copyAction = useShortcutsStore((state) => state.copy);
  const duplicate = useShortcutsStore((state) => state.duplicate);
  const deleteAction = useShortcutsStore((state) => state.delete);
  const cutAction = useShortcutsStore((state) => state.cut);
  const pasteAction = useShortcutsStore((state) => state.paste);
  useHotkeys(undoAction, (e) => handleUndo(e, undo));
  useHotkeys(redoAction, (e) => handleRedo(e, redo));
  useHotkeys(duplicate, (e) => handleDuplicate(e, paste, nodes, position));
  useHotkeys(copyAction, (e) => handleCopy(e, lastSelection, setLastSelection));
  useHotkeys(cutAction, (e) => handleCut(e, lastSelection, setLastSelection));
  useHotkeys(pasteAction, (e) =>
    handlePaste(e, lastSelection, takeSnapshot, paste, position),
  );
  useHotkeys(deleteAction, (e) =>
    handleDelete(e, lastSelection, deleteNode, deleteEdge, takeSnapshot),
  );
  useHotkeys('delete', (e) =>
    handleDelete(e, lastSelection, deleteNode, deleteEdge, takeSnapshot),
  );

  // const onLoad = useCallback(() => {
  //   setTimeout(() => reactFlowInstance?.fitView(), 0);
  // }, [reactFlowInstance]);

  const onConnectMod = useCallback(
    (params: Connection) => {
      takeSnapshot();
      onConnect(params);
    },
    [takeSnapshot, onConnect],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer.types.some((types) => types === 'nodedata')) {
        takeSnapshot();
        try {
          // Extract the data from the drag event and parse it as a JSON object
          const data: { type: string; node?: NodeType } = JSON.parse(
            event.dataTransfer.getData('nodedata'),
          );

          const newId = getNodeId(data.type);

          const newNode: NodeType = {
            id: newId,
            type: data.type,
            position: { x: 0, y: 0 },
            data: {
              ...data.node,
              id: newId,
            } as NodeDataType,
          };
          paste(
            { nodes: [newNode], edges: [] },
            { x: event.clientX, y: event.clientY },
          );
        } catch (error) {
          console.error(error);
        }
      }
    },
    // Specify dependencies for useCallback
    [takeSnapshot, paste],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.types.some((types) => types === 'nodedata')) {
      event.dataTransfer.dropEffect = 'move';
    } else {
      event.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  // console.log('🚀 ~ Flow ~ edges:', edges);
  // console.log('🚀 ~ Flow ~ nodes:', nodes);
  return (
    <EventEmitterContextProvider>
      <div
        style={{ height: '100%', width: '100%' }}
        className={classNames}
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onInit={setReactFlowInstance}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnectMod}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          disableKeyboardA11y={true}
          onDrop={onDrop}
          onDragOver={onDragOver}
          proOptions={{ hideAttribution: true }}
          // onLoad={onLoad}
          maxZoom={2}
          minZoom={0.1}
          fitView
        >
          <Background gap={16} className="border-gay-600" />
          {miniMap && <FlowController />}
          {toolbar}
        </ReactFlow>
      </div>
    </EventEmitterContextProvider>
  );
}

export default Flow;
