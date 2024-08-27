import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import React, { useEffect } from 'react';

import type { BasicSchema, NodeType } from '@/interfaces/flow';

import { CollapseWrapper } from '../AIBasic/CollapseWrapper';
import { ReferenceSelect } from '../ReferenceSelect';

export interface RefrenceFormProps {
  label: string;
  values: BasicSchema[];
  onChange: (values: []) => void;
  nodes: NodeType[];
  dynamic?: boolean;
}

export const ReferenceForm = (props: RefrenceFormProps) => {
  const { label, values, onChange, nodes, dynamic = false } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue('variables', values);
  }, []);
  console.log('🚀 ~ useEffect ~ values:', values);

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
      label={label}
      content={
        <Form
          form={form}
          autoComplete="off"
          onValuesChange={(_, allFields) => {
            console.log('🚀 ~ form.validateFields ~ allFields:', allFields);
            form.validateFields().then(() => {
              if (allFields.variables) {
                onChange(allFields.variables.filter((item: any) => item !== undefined));
              }
            });
          }}
        >
          <div className="mb-[-10px]">
            <Form.List name="variables">
              {() => (
                <>
                  <Space style={{ display: 'flex' }} align="baseline">
                    <Form.Item className="w-[240px]">参数名</Form.Item>
                    <Form.Item className="w-[200px]">变量值</Form.Item>
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
                      className="w-[240px]"
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
                      <MinusCircleOutlined
                        className="cursor-pointer"
                        onClick={() => remove(name)}
                      />
                    )}
                  </Space>
                ))}
                {dynamic && (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加变量
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Form>
      }
    />
  );
};
