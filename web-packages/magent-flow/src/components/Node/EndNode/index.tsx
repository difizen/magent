import { Collapse } from 'antd';

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

export const EndNode = (props: Props) => {
  const { data } = props;
  const { findUpstreamNodes } = useFlowStore();
  const upstreamNode = findUpstreamNodes(data.id.toString());

  return (
    <NodeWrapper nodeProps={props} rightHandler={false}>
      <Collapse>
        <ReferenceForm
          label="输入变量"
          nodes={[...(upstreamNode as any)]}
          values={[{ name: 'output', type: 'reference' }]}
          onChange={(values) => {
            console.log('ReferenceForm', values);
          }}
        />
      </Collapse>
    </NodeWrapper>
  );
};
