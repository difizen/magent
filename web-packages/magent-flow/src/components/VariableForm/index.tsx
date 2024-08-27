import {
  CaretRightOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Collapse, Form, Input, Space } from 'antd';
import React, { useEffect } from 'react';

import type { BasicSchema } from '@/interfaces/flow.js';

import { SelectInNode } from '../AIBasic/SelectInNode/index.js';

export interface VariableFormProps {
  label: string;
  values: BasicSchema[];
  onChange: (values: BasicSchema[]) => void;
  dynamic?: boolean;
  showRequired?: boolean;
}

export const VariableForm = (props: VariableFormProps) => {
  const { label, values, onChange, dynamic = true, showRequired = true } = props;
  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue('variables', values);
  }, []);

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={[
        {
          key: '1',
          label: label,
          children: (
            <Form
              form={form}
              name="dynamic_form_nest_item"
              onFinish={onFinish}
              autoComplete="off"
              onValuesChange={(_, allFields) => {
                form.validateFields().then(() => {
                  if (allFields.variables) {
                    onChange(
                      allFields.variables.filter((item: any) => item !== undefined),
                    );
                  }
                });
              }}
            >
              <div className="mb-[-10px]">
                <Form.List name="variables">
                  {() => (
                    <>
                      <Space style={{ display: 'flex' }} align="baseline">
                        <Form.Item className="w-[240px]">变量名</Form.Item>
                        <Form.Item className="w-[200px]">变量类型</Form.Item>
                        {/* <Form.Item className="w-[240px]">变量描述</Form.Item> */}
                        {showRequired && (
                          <Form.Item className="w-[60px]">是否必要</Form.Item>
                        )}
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
                          <Input placeholder="变量名" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'type']}
                          className="w-[200px]"
                        >
                          <SelectInNode
                            options={[
                              { label: 'String', value: 'String' },
                              { label: 'Integer', value: 'Integer' },
                              {
                                label: 'Array<Integer>',
                                value: 'Array<Integer>',
                              },
                            ]}
                            placeholder=""
                          />
                        </Form.Item>
                        {/* <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          className="w-[240px]"
                        >
                          <Input placeholder="变量的用途" />
                        </Form.Item> */}
                        {showRequired && (
                          <Form.Item
                            {...restField}
                            name={[name, 'required']}
                            className="w-[60px]"
                          >
                            <Checkbox />
                          </Form.Item>
                        )}
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
          ),
        },
      ]}
    />
  );
};
