import { VariableForm } from '@flow/components/VariableForm/index.js';
import type { NodeDataType } from '@flow/interfaces/flow.js';

import { NodeWrapper } from '../NodeWrapper/index.js';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const StartNode = (props: Props) => {
  const { data } = props;

  return (
    <NodeWrapper nodeProps={props} leftHandler={false}>
      <VariableForm
        label="输入"
        showRequired={false}
        dynamic={false}
        values={data.config?.outputs || []}
        onChange={(values) => {
          //
        }}
      />
    </NodeWrapper>
  );
};
