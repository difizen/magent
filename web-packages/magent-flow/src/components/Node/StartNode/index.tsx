import { VariableForm } from '@flow/components/VariableForm/index.js';
import type { NodeType } from '@flow/interfaces/flow.js';

import { NodeWrapper } from '../NodeWrapper/index.js';

const StartNode = (props: NodeType) => {
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

export default StartNode;
