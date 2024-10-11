import { ConditionForm } from '@flow/components/ConditionForm/index.js';
import type { NodeType } from '@flow/interfaces/flow.js';
import { useFlowStore } from '@flow/stores/flowStore.js';

import { NodeWrapper } from '../NodeWrapper/index.js';

const IfElseNode = (props: NodeType) => {
  const { data } = props;

  const setNode = useFlowStore((state) => state.setNode);
  const nodeLinkMap = useFlowStore((state) => state.nodeLinkMap);

  const upstreamNodes = nodeLinkMap[data.id] || [];
  const options = upstreamNodes.map((n) => {
    const node = n;
    return {
      label: node.data.name,
      value: node.data.id,
      children:
        node.data?.config?.outputs?.map((output) => {
          return {
            label: output.name,
            value: output.name,
          };
        }) || [],
    };
  });
  return (
    <NodeWrapper
      nodeProps={props}
      className="w-[610px]"
      rightHandlerConfig={[
        { id: 'branch-1', style: { top: 110 } },
        { id: 'branch-default', style: { bottom: 34, top: 'auto' } },
      ]}
    >
      <>
        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md mb-2">
          <div>
            <div className="ml-1 mb-2 font-medium">如果</div>
            <ConditionForm
              refOptions={options}
              value={data.config?.inputs?.branches?.[0]}
              onChange={(val) => {
                setNode(data.id, (old) => ({
                  ...old,
                  data: {
                    ...old.data,
                    config: {
                      ...(old.data['config'] as Record<string, any>),

                      inputs: {
                        ...(old.data['config'] as Record<string, any>)['inputs'],
                        branches: [val],
                      },
                    },
                  },
                }));
              }}
            />
          </div>
        </div>
        <div className="bg-gray-100 p-3 rounded-md">
          <div className="ml-1 font-medium">否则</div>
        </div>
      </>
    </NodeWrapper>
  );
};

export default IfElseNode;
