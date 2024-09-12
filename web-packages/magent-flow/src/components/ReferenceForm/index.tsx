import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { BasicSchema, NodeType } from '@flow/interfaces/flow.js';
import { Button, Form, Input, Space } from 'antd';
import { useEffect } from 'react';

import { CollapseWrapper } from '../AIBasic/CollapseWrapper/index.js';
import { ReferenceSelect } from '../ReferenceSelect/index.js';

export interface RefrenceFormProps {
  label: string;
  value: BasicSchema[];
  onChange: (values: BasicSchema[]) => void;
  nodes: NodeType[];
  dynamic?: boolean;
}

export const ReferenceForm = (props: RefrenceFormProps) => {
  const { label, value, onChange, nodes, dynamic = false } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue('variables', value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
          onValuesChange={(changedValues, allFields) => {
            form
              .validateFields()
              .then(() => {
                if (allFields.variables) {
                  onChange(
                    allFields.variables.map((item: any) => {
                      if (!item) {
                        return {};
                      }
                      return item;
                    }),
                  );
                }
                return;
              })
              .catch(console.error);
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
