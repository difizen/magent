import { useFlowStore } from '@flow/stores/useFlowStore.js';
import type { EdgeProps } from '@xyflow/react';
import { BaseEdge, getBezierPath, MarkerType } from '@xyflow/react';
import { useEffect } from 'react';

const EdgeColor = {
  Default: '#9ca3af',
  Selected: '#3b82f6',
};

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const { setEdge } = useFlowStore();
  const edgeColor = selected ? EdgeColor.Selected : EdgeColor.Default;

  useEffect(() => {
    setEdge(id, (edge) => {
      return {
        ...edge,
        zIndex: selected ? 2 : 1,
        markerEnd: {
          type: MarkerType.Arrow,
          color: edgeColor,
          width: 20,
          height: 20,
        },
      };
    });
  }, [selected, id, setEdge, edgeColor]);

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // const onEdgeClick = () => {
  //   Modal.Open(<div>addNode</div>);
  // };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth: 2,
        }}
      />
      {/* {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              // everything inside EdgeLabelRenderer has no pointer events by default
              // if you have an interactive element, set pointer-events: all
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-blue-400 rounded-full w-[20px] text-gray-50 flex justify-around items-center cursor-pointer">
              <div>+</div>
            </div>
          </div>
        </EdgeLabelRenderer>
      )} */}
    </>
  );
}
