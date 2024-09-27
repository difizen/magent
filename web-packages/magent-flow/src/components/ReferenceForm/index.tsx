import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { BasicSchema, NodeType } from '@flow/interfaces/flow.js';
import { useFlowStore } from '@flow/stores/flowStore.js';
import { RiAddLine, RiDeleteBin7Line } from '@remixicon/react';
import type { FormInstance } from 'antd';
import { Button, Form, Input, Space } from 'antd';
import { memo, useEffect, useRef } from 'react';
import React from 'react';

import { CollapseWrapper } from '../AIBasic/CollapseWrapper/index.js';
import { HoverBlock } from '../FlowController/operator.js';
import { ReferenceSelect } from '../ReferenceSelect/index.js';

export interface RefrenceFormProps {
  label: string;
  value: BasicSchema[];
  onChange: (values: BasicSchema[]) => void;
  nodes: NodeType[];
  dynamic?: boolean;
}

export const ReferenceFormRaw = (props: RefrenceFormProps) => {
  const { label, value, onChange, nodes, dynamic = false } = props;
  // const formRef = useRef<FormInstance>(null);
  // const [form] = Form.useForm();

  // useEffect(() => {
  //   // formRef.current?.setFieldValue('variables', value);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [value]);

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
    <CollapseWrapper
      className="mb-[20px]"
      label={label}
      content={
        <Form
          initialValues={{ variables: value }}
          autoComplete="off"
          // onValuesChange={(changedValues, allFields) => {
          //   onChange(
          //     allFields.variables.map((item: any) => {
          //       if (!item) {
          //         return {};
          //       }
          //       return item;
          //     }),
          //   );
          // }}
        >
          <div className="mb-[-20px]">
            <Form.List name="variables">
              {() => (
                <>
                  <Space style={{ display: 'flex' }} align="baseline">
                    <Form.Item className="w-[180px]">参数名</Form.Item>
                    <Form.Item>变量值</Form.Item>
                  </Space>
                </>
              )}
            </Form.List>
          </div>
          <Form.List name="variables">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex' }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      className="flex-1"
                      rules={[{ required: true, message: '变量名不可为空' }]}
                    >
                      <Input placeholder="变量名" disabled={!dynamic} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      className="w-[200px]"
                    >
                      <ReferenceSelect refOptions={options} />
                    </Form.Item>

                    {dynamic && (
                      <HoverBlock
                        onClick={() => remove(name)}
                        className="bg-gray-100 hover:bg-red-500/5 hover:text-red-400"
                      >
                        <RiDeleteBin7Line
                          className="w-[14px] h-[14px]"
                          // onClick={() => remove(name)}
                        />
                      </HoverBlock>
                    )}
                  </Space>
                ))}
                {dynamic && (
                  <Button
                    className="w-[100%]"
                    onClick={() => add()}
                    icon={<RiAddLine className="w-4" />}
                  >
                    添加变量
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </Form>
      }
    />
  );
};

export const ReferenceForm = memo(ReferenceFormRaw);
