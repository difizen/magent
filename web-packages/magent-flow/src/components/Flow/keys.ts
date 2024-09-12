import isWrappedWithClass from '@flow/utils/wrappedClass.js';
import { cloneDeep } from 'lodash';

export function handleUndo(e: KeyboardEvent, undo: any) {
  if (!isWrappedWithClass(e, 'noflow')) {
    e.preventDefault();
    (e as unknown as Event).stopImmediatePropagation();
    undo();
  }
}

export function handleRedo(e: KeyboardEvent, redo: any) {
  if (!isWrappedWithClass(e, 'noflow')) {
    e.preventDefault();
    (e as unknown as Event).stopImmediatePropagation();
    redo();
  }
}

// export function handleGroup(e: KeyboardEvent) {
//   if (selectionMenuVisible) {
//     e.preventDefault();
//     (e as unknown as Event).stopImmediatePropagation();
//     handleGroupNode();
//   }
// }

export function handleDuplicate(
  e: KeyboardEvent,
  paste: any,
  nodes: any,
  position: any,
) {
  e.preventDefault();
  e.stopPropagation();
  (e as unknown as Event).stopImmediatePropagation();
  const selectedNode = nodes.filter((obj: any) => obj.selected);
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

export function handleCopy(
  e: KeyboardEvent,
  lastSelection: any,
  setLastCopiedSelection: any,
) {
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
      setLastCopiedSelection(cloneDeep(lastSelection));
    }
  }
}

export function handleCut(
  e: KeyboardEvent,
  lastSelection: any,
  setLastCopiedSelection: any,
) {
  if (!isWrappedWithClass(e, 'noflow')) {
    e.preventDefault();
    (e as unknown as Event).stopImmediatePropagation();
    if (window.getSelection()?.toString().length === 0 && lastSelection) {
      setLastCopiedSelection(cloneDeep(lastSelection), true);
    }
  }
}

export function handlePaste(
  e: KeyboardEvent,
  lastCopiedSelection: any,
  takeSnapshot: any,
  paste: any,
  position: any,
) {
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

export function handleDelete(
  e: KeyboardEvent,
  lastSelection: any,
  deleteNode: any,
  deleteEdge: any,
  takeSnapshot: any,
) {
  if (!isWrappedWithClass(e, 'nodelete') && lastSelection) {
    e.preventDefault();
    (e as unknown as Event).stopImmediatePropagation();
    takeSnapshot();
    deleteNode(lastSelection.nodes.map((node: any) => node.id));
    deleteEdge(lastSelection.edges.map((edge: any) => edge.id));
  }
}
