import { ConditionForm } from '@flow/components/ConditionForm/index.js';
import type { NodeDataType, NodeType } from '@flow/interfaces/flow.js';
import { useFlowStore } from '@flow/stores/useFlowStore.js';

import { NodeWrapper } from '../NodeWrapper/index.js';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const IfElseNode = (props: Props) => {
  const { data } = props;

  const { findUpstreamNodes, setNode } = useFlowStore();
  const upstreamNode = findUpstreamNodes(data.id.toString());
  const options = upstreamNode.map((n) => {
    const node = n as any as NodeType;
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
