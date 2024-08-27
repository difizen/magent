import { NodeDataType } from '@/interfaces/flow';
import { Collapse } from 'antd';
import React from 'react';
import { NodeWrapper } from '../NodeWrapper';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const CommonNode = (props: Props) => {
  const { data } = props;
  const { config } = data;

  return (
    <NodeWrapper nodeProps={props}>
      <>
        {config?.inputs && config?.inputs.length > 0 && (
          <Collapse
            items={[
              {
                key: '1',
                label: 'This is small size panel header',
                children: <p>{111}</p>,
              },
            ]}
          />
        )}
      </>
    </NodeWrapper>
  );
};
