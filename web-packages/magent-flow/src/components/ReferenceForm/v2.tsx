import type { BasicSchema, NodeType } from '@flow/interfaces/flow.js';
import { RiDeleteBin7Line } from '@remixicon/react';
import { Button, Input, Space } from 'antd';
import { useState } from 'react';

import { CollapseWrapper } from '../AIBasic/index.js';
import { HoverBlock } from '../FlowController/operator.js';
import { ReferenceSelect } from '../ReferenceSelect/index.js';

export interface RefrenceFormV2Props {
  label: string;
  value: BasicSchema[];
  initialValues?: BasicSchema[];
  onChange: (values: BasicSchema[]) => void;
  nodes: NodeType[];
  dynamic?: boolean;
}

export const ReferenceFormV2 = (props: RefrenceFormV2Props) => {
  const { label, initialValues, onChange, nodes, dynamic = false } = props;

  const [variables, setVariables] = useState(initialValues);

  const options = nodes.map((node) => {
    return {
      label: node.data.name,
      value: node.data.id,
      children: node.data?.config?.outputs?.map((output) => {
        return {
          label: output.name,
          value: output.name,
        };
      }),
    };
  });

  return (
    <div className="text-gray-500">
      <div></div>
      <div className="space-y-3">
        {variables?.map((v) => (
          <div key={v.name} className="flex gap-2 items-center">
            <Input placeholder="变量名" className="flex-1" defaultValue={v.name} />
            <ReferenceSelect value={v.value} refOptions={options} />
            {dynamic && (
              <HoverBlock className="bg-gray-100 hover:bg-red-500/5 hover:text-red-400">
                <RiDeleteBin7Line
                  className="w-[14px] h-[14px]"
                  // onClick={() => remove(name)}
                />
              </HoverBlock>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
