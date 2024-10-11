import { EventEmitterContextProvider } from '@flow/context/event-emitter.js';
import type { NodeDataType, NodeType } from '@flow/interfaces/flow.js';
import { useFlowsManagerStore } from '@flow/stores/flowsManagerStore.js';
import { useFlowStore } from '@flow/stores/flowStore.js';
import { useShortcutsStore } from '@flow/stores/useShortcutsStore.js';
import { getNodeId } from '@flow/utils/reactflowUtils.js';
import isWrappedWithClass from '@flow/utils/wrappedClass.js';
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  OnEdgesChange,
  OnNodesChange,
  OnSelectionChangeParams,
  SelectionDragHandler,
} from '@xyflow/react';
import { Button } from 'antd';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import CustomEdge from '../CustomEdge/index.js';
import { Operator } from '../FlowController/operator.js';

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

  const setReactFlowInstance = useFlowStore((state) => state.setReactFlowInstance);
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const deleteEdge = useFlowStore((state) => state.deleteEdge);
  const onConnect = useFlowStore((state) => state.onConnect);

  const setLastCopiedSelection = useFlowStore((state) => state.setLastCopiedSelection);
  const lastCopiedSelection = useFlowStore((state) => state.lastCopiedSelection);
  const paste = useFlowStore((state) => state.paste);
  const undo = useFlowsManagerStore((state) => state.undo);
  const redo = useFlowsManagerStore((state) => state.redo);
  const takeSnapshot = useFlowsManagerStore((state) => state.takeSnapshot);

  // Hot keys
  const undoAction = useShortcutsStore((state) => state.undo);
  const redoAction = useShortcutsStore((state) => state.redo);
  const copyAction = useShortcutsStore((state) => state.copy);
  const duplicate = useShortcutsStore((state) => state.duplicate);
  const deleteAction = useShortcutsStore((state) => state.delete);
  const cutAction = useShortcutsStore((state) => state.cut);
  const pasteAction = useShortcutsStore((state) => state.paste);

  function handleUndo(e: KeyboardEvent) {
    if (!isWrappedWithClass(e, 'noflow')) {
      e.preventDefault();
      (e as unknown as Event).stopImmediatePropagation();
      undo();
    }
  }

  function handleRedo(e: KeyboardEvent) {
    if (!isWrappedWithClass(e, 'noflow')) {
      e.preventDefault();
      (e as unknown as Event).stopImmediatePropagation();
      redo();
    }
  }

  function handleDuplicate(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e as unknown as Event).stopImmediatePropagation();
    const selectedNode = nodes.filter((obj) => obj.selected);
    if (selectedNode.length > 0) {
      paste(
        { nodes: selectedNode, edges: [] },
        {
          x: position.current.x,
          y: position.current.y,
        },
      );
    }
  }

  function handleCopy(e: KeyboardEvent) {
    const multipleSelection = lastSelection?.nodes
      ? lastSelection?.nodes.length > 0
      : false;
    if (
      !isWrappedWithClass(e, 'noflow') &&
      (isWrappedWithClass(e, 'react-flow__node') || multipleSelection)
    ) {
      e.preventDefault();
      (e as unknown as Event).stopImmediatePropagation();
      if (window.getSelection()?.toString().length === 0 && lastSelection) {
        setLastCopiedSelection(_.cloneDeep(lastSelection));
      }
    }
  }

  function handleCut(e: KeyboardEvent) {
    if (!isWrappedWithClass(e, 'noflow')) {
      e.preventDefault();
      (e as unknown as Event).stopImmediatePropagation();
      if (window.getSelection()?.toString().length === 0 && lastSelection) {
        setLastCopiedSelection(_.cloneDeep(lastSelection), true);
      }
    }
  }

  function handlePaste(e: KeyboardEvent) {
    if (!isWrappedWithClass(e, 'noflow')) {
      e.preventDefault();
      (e as unknown as Event).stopImmediatePropagation();
      if (window.getSelection()?.toString().length === 0 && lastCopiedSelection) {
        takeSnapshot();
        paste(lastCopiedSelection, {
          x: position.current.x,
          y: position.current.y,
        });
      }
    }
  }

  function handleDelete(e: KeyboardEvent) {
    if (!isWrappedWithClass(e, 'nodelete') && lastSelection) {
      e.preventDefault();
      (e as unknown as Event).stopImmediatePropagation();
      takeSnapshot();
      deleteNode(lastSelection.nodes.map((node) => node.id));
      deleteEdge(lastSelection.edges.map((edge) => edge.id));
    }
  }

  useHotkeys(undoAction, handleUndo);
  useHotkeys(redoAction, handleRedo);
  useHotkeys(duplicate, handleDuplicate);
  useHotkeys(copyAction, handleCopy);
  useHotkeys(cutAction, handleCut);
  useHotkeys(pasteAction, handlePaste);
  useHotkeys(deleteAction, handleDelete);
  useHotkeys('delete', handleDelete);

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
              folded: false,
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

  const onNodeDragStart = useCallback(() => {
    // 👇 make dragging a node undoable
    takeSnapshot();
    // 👉 you can place your event handlers here
  }, [takeSnapshot]);

  const onSelectionChange = useCallback((flow: OnSelectionChangeParams): void => {
    setLastSelection(flow);
  }, []);

  const onSelectionDragStart: SelectionDragHandler = useCallback(() => {
    // 👇 make dragging a selection undoable
    takeSnapshot();
  }, [takeSnapshot]);

  // get current mouse position for paste node
  useEffect(() => {
    const handleMouseMove = (event) => {
      position.current = { x: event.clientX, y: event.clientY };
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastCopiedSelection, lastSelection, takeSnapshot]);

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
          onNodeDragStart={onNodeDragStart}
          onSelectionChange={onSelectionChange}
          onSelectionDragStart={onSelectionDragStart}
          onConnect={onConnectMod}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          disableKeyboardA11y={true}
          onDrop={onDrop}
          onDragOver={onDragOver}
          maxZoom={2}
          minZoom={0.1}
          fitView
        >
          <Background gap={[14, 14]} size={2} color="#E4E5E7" />
          {miniMap && (
            <MiniMap
              style={{
                width: 102,
                height: 72,
              }}
              className="!absolute !left-4 !bottom-14 z-[9] !m-0 !w-[102px] !h-[72px] !border-[0.5px] !border-black/8 !rounded-lg !shadow-lg"
            />
          )}
          <Operator />
          {toolbar}
        </ReactFlow>
      </div>
    </EventEmitterContextProvider>
  );
}

export default Flow;
