import type { NodeDataType } from '@flow/interfaces/flow.js';
import { Collapse } from 'antd';

import { NodeWrapper } from '../NodeWrapper/index.js';

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
        {config?.inputs &&
          config.inputs instanceof Array &&
          config.inputs.length > 0 && (
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
