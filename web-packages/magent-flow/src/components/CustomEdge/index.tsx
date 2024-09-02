import type { EdgeProps } from '@xyflow/react';
import { BaseEdge, getBezierPath, MarkerType } from '@xyflow/react';

export default function CustomEdge({
  // id,
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
  // const { setNodes } = useReactFlow();
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
        markerEnd={MarkerType.ArrowClosed}
        style={{
          ...style,
          // stroke: selected ? 'rgb(29 78 216)' : 'rgb(156 163 175)',
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
