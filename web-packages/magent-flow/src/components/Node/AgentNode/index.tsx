import { CollapseWrapper } from '@/components/AIBasic/CollapseWrapper/index.js';
import { OutputVariable } from '@/components/AIBasic/OutputVariableTree/OutputVariable/index.js';
import { ReferenceForm } from '@/components/ReferenceForm/index.js';
import type { NodeDataType } from '@/interfaces/flow.js';
import { useFlowStore } from '@/stores/useFlowStore.js';

import { NodeWrapper } from '../NodeWrapper/index.js';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const AgentNode = (props: Props) => {
  const { data } = props;
  // const { config } = data;
  const { findUpstreamNodes } = useFlowStore();
  const upstreamNodes = findUpstreamNodes(data.id.toString());
  console.log('🚀 ~ AgentNode ~ upstreamNodes:', upstreamNodes);

  return (
    <NodeWrapper nodeProps={props}>
      <div>
        <ReferenceForm
          label="输入变量"
          nodes={[...(upstreamNodes as any)]}
          values={[...(data.config?.inputs?.input_param || [])]}
          onChange={(values) => {
            console.log('ReferenceForm', values);
          }}
        />

        <CollapseWrapper
          className="mt-3"
          label={'Output'}
          content={
            <>
              {(data.config?.outputs || []).map((output) => (
                <OutputVariable
                  key={output.name!}
                  name={output.name!}
                  type={output.type}
                />
              ))}
            </>
          }
        />
      </div>
    </NodeWrapper>
  );
};
