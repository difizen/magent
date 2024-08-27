import { ReferenceForm } from '@/components/ReferenceForm';
import { NodeDataType } from '@/interfaces/flow';
import { useFlowStore } from '@/stores/useFlowStore';
import { Collapse } from 'antd';
import React from 'react';
import { NodeWrapper } from '../NodeWrapper';

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
