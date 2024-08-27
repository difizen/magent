import { SelectInNode } from '@/components/AIBasic/SelectInNode';
import { ReferenceSelect } from '@/components/ReferenceSelect';
import { NodeDataType } from '@/interfaces/flow';
import { useFlowStore } from '@/stores/useFlowStore';
import { Form } from 'antd';
import React from 'react';
import { NodeWrapper } from '../NodeWrapper';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const IfElseNode = (props: Props) => {
  const { data } = props;
  const [form] = Form.useForm();
  const compare = Form.useWatch('compare', form);
  const { findUpstreamNodes } = useFlowStore();
  const upstreamNode = findUpstreamNodes(data.id.toString());
  const options = upstreamNode.map((node) => {
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
        { id: 'IF', style: { top: 110 } },
        { id: 'ELSE', style: { bottom: 34, top: 'auto' } },
      ]}
    >
      <>
        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md mb-2">
          <div>
            <div className="ml-1 mb-2 font-medium">如果</div>
            <Form form={form} layout="inline">
              <Form.Item name="left">
                <ReferenceSelect refOptions={options} />
              </Form.Item>
              <Form.Item name="compare">
                <SelectInNode
                  className="w-[80px]"
                  defaultValue={'equal'}
                  options={[
                    { label: '等于', value: 'equal' },
                    { label: '不等于', value: 'not_equal' },
                    { label: '为空', value: 'blank' },
                  ]}
                />
              </Form.Item>
              {compare !== 'blank' && (
                <Form.Item name="right">
                  <ReferenceSelect refOptions={options} />
                </Form.Item>
              )}
            </Form>
          </div>
        </div>
        <div className="bg-gray-100 p-3 rounded-md">
          <div className="ml-1 font-medium">否则</div>
        </div>
      </>
    </NodeWrapper>
  );
};
