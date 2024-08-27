/**
 * 动态渲染Schema，输出表单卡片
 */

import {
  AppstoreAddOutlined,
  CaretRightOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { Card, Checkbox, Collapse, Form, Input, Select, Space, theme } from 'antd';
import type { JSONSchema7 } from 'json-schema';
import React, { useState } from 'react';

import { variableTypeOptions } from '@/FormSchema/index.js';
import type { FormSchema, OrderJSONSchema7 } from '@/FormSchema/index.js';

// import {
//   FormSchema,
//   OrderJSONSchema7,
//   variableTypeOptions,
// } from '../spec/FormSchema';

const useForceUpdate = () => {
  const [forceKey, update] = useState(0);
  const forceUpdate = () => {
    update((v) => v + 1);
  };
  return { forceUpdate, forceKey };
};

export const SchemaConfigForm = (props: {
  formSchema: FormSchema;
  showRequired?: boolean;
}) => {
  const { formSchema, showRequired = false } = props;

  const jsonschema = formSchema.jsonschema;
  const { forceUpdate } = useForceUpdate();

  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  const renderField = (
    schema: JSONSchema7,
    pointer: string,
    required?: string[],
    parentIsArray?: boolean,
    isFirstlevel?: boolean,
  ) => {
    const defaultCase = () => {
      const pointers = pointer.split('/');
      const plen = pointer.split('/').length;
      const variableName = pointers[plen - 1];

      const parentPointer = pointer.substring(0, pointer.lastIndexOf('/'));

      let tmpVariableName = variableName;

      const variableType = schema.type as string;

      return (
        <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
          <Form.Item
            label="变量名"
            name={'variableName' + '-' + pointer}
            rules={[{ message: '变量名' }]}
            // initialValue={
            //   formSchema.isRandomName(variableName) ? '' : variableName
            // }
          >
            <Input
              defaultValue={formSchema.isRandomName(variableName) ? '' : variableName}
              placeholder={'请输入变量名'}
              onChange={(v) => {
                const targetVal = v.target.value;
                // 更新key
                const success = formSchema.updateField({
                  pointer: parentPointer,
                  key: 'variableName',
                  value: targetVal,
                  currentVariableName: tmpVariableName,
                });
                if (success) {
                  tmpVariableName = targetVal;
                }
              }}
              onBlur={forceUpdate}
            />
          </Form.Item>
          <Form.Item
            label="变量类型"
            name={'variableType' + '-' + pointer}
            rules={[{ message: '变量类型' }]}
            // initialValue={value?.type}
          >
            <Select
              defaultValue={variableType}
              onBlur={forceUpdate}
              options={variableTypeOptions}
              onChange={(v) => {
                formSchema.updateField({
                  pointer: parentPointer,
                  key: 'variableType',
                  value: v,
                  currentVariableName: variableName,
                });
              }}
            ></Select>
          </Form.Item>
          <Form.Item
            label="描述"
            name={'variableDescription' + '-' + pointer}
            // initialValue={value?.description}
            rules={[{ message: '描述' }]}
          >
            <Input
              defaultValue={schema.description}
              onBlur={forceUpdate}
              placeholder="Last Name"
              onChange={(v) => {
                formSchema.updateField({
                  pointer: parentPointer,
                  key: 'description',
                  value: v.target.value,
                  currentVariableName: variableName,
                });
              }}
            />
          </Form.Item>
          {showRequired && (
            <Form.Item
              label="是否必选"
              name={'variableRequired' + '-' + pointer}
              // initialValue={required.includes(key)}
            >
              <Checkbox
                defaultChecked={required?.includes(variableName)}
                value="A"
                onMouseLeave={forceUpdate}
                style={{ lineHeight: '32px' }}
                onChange={(v) => {
                  formSchema.updateField({
                    pointer: parentPointer,
                    key: 'required',
                    value: v.target.checked,
                    currentVariableName: variableName,
                  });
                }}
              ></Checkbox>
            </Form.Item>
          )}
          {/* <MinusCircleOutlined onClick={() => {}} /> */}
        </Space>
      );
    };
    switch (schema?.type) {
      case 'object': {
        const propertiesKeys = Object.keys(schema.properties || {});
        propertiesKeys.sort((a, b) => {
          const p = schema.properties as { [key: string]: OrderJSONSchema7 };
          console.log(p[a].order, p[b]?.order, '==order');
          return (p[a]?.order || 999) - (p[b]?.order || 999);
        });

        return (
          <div>
            {!parentIsArray && !isFirstlevel && defaultCase()}
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              items={[
                {
                  style: panelStyle,
                  key: '1',
                  label: isFirstlevel ? '输入' : pointer,
                  extra: (
                    <AppstoreAddOutlined
                      onClick={(e) => {
                        e.stopPropagation();

                        formSchema.addField({
                          pointer: pointer, // 指定属性路径，如 /a/b
                          type: 'string',
                          description: '请描述变量的用途',
                          required: false,
                        });
                        forceUpdate();
                      }}
                    />
                  ),
                  children: propertiesKeys.map((v) => {
                    const subItemPointer =
                      pointer === '/' ? pointer + v : pointer + '/' + v;

                    return (
                      <div key={subItemPointer}>
                        {renderField(
                          schema.properties?.[v] as JSONSchema7,
                          subItemPointer,
                          schema.required,
                        )}
                      </div>
                    );
                  }),
                },
              ]}
              style={{ background: token.colorBgContainer }}
            ></Collapse>
          </div>
        );
      }

      case 'array': {
        const items = (
          Array.isArray(schema.items) ? schema.items[0] : schema.items
        ) as JSONSchema7;

        const itemIsObject = items.type === 'object';

        const pointers = pointer.split('/');
        const plen = pointer.split('/').length;
        const variableName = pointers[plen - 1];

        const parentPointer = pointer.substring(0, pointer.lastIndexOf('/'));

        let tmpVariableName = variableName;

        let variableType = schema.type as string;

        if (schema.type === 'array') {
          const items = (
            Array.isArray(schema.items) ? schema.items[0] : schema.items
          ) as JSONSchema7;
          if (items) {
            variableType = `Array<${items?.type}>`;
          }
        }

        return (
          <div>
            <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
              <Form.Item
                label="变量名"
                name={'variableName' + '-' + pointer}
                rules={[{ message: '变量名' }]}
                // initialValue={
                //   formSchema.isRandomName(variableName) ? '' : variableName
                // }
              >
                <Input
                  defaultValue={
                    formSchema.isRandomName(variableName) ? '' : variableName
                  }
                  placeholder={'请输入变量名'}
                  onChange={(v) => {
                    const targetVal = v.target.value;
                    // 更新key
                    const success = formSchema.updateField({
                      pointer: parentPointer,
                      key: 'variableName',
                      value: targetVal,
                      currentVariableName: tmpVariableName,
                    });
                    if (success) {
                      tmpVariableName = targetVal;
                    }
                  }}
                  onBlur={forceUpdate}
                />
              </Form.Item>
              <Form.Item
                label="变量类型"
                name={'variableType' + '-' + pointer}
                rules={[{ message: '变量类型' }]}
                // initialValue={value?.type}
              >
                <Select
                  defaultValue={variableType}
                  onBlur={forceUpdate}
                  options={variableTypeOptions}
                  onChange={(v) => {
                    formSchema.updateField({
                      pointer: parentPointer,
                      key: 'variableType',
                      value: v,
                      currentVariableName: variableName,
                    });
                  }}
                ></Select>
              </Form.Item>
              <Form.Item
                label="描述"
                name={'variableDescription' + '-' + pointer}
                // initialValue={value?.description}
                rules={[{ message: '描述' }]}
              >
                <Input
                  defaultValue={schema.description}
                  onBlur={forceUpdate}
                  placeholder="Last Name"
                  onChange={(v) => {
                    formSchema.updateField({
                      pointer: parentPointer,
                      key: 'description',
                      value: v.target.value,
                      currentVariableName: variableName,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="是否必选"
                name={'variableRequired' + '-' + pointer}
                // initialValue={required.includes(key)}
              >
                <Checkbox
                  defaultChecked={required?.includes(variableName)}
                  value="A"
                  onMouseLeave={forceUpdate}
                  style={{ lineHeight: '32px' }}
                  onChange={(v) => {
                    formSchema.updateField({
                      pointer: parentPointer,
                      key: 'required',
                      value: v.target.checked,
                      currentVariableName: variableName,
                    });
                  }}
                ></Checkbox>
              </Form.Item>
              <MinusCircleOutlined onClick={() => {}} />
            </Space>
            {/* 对象才渲染子类型 */}
            {itemIsObject && renderField(items, pointer + '/0', schema.required, true)}
          </div>
        );
      }

      default: {
        return defaultCase();
      }
    }
  };

  return (
    <Space direction="vertical">
      <Space direction="vertical">
        {renderField(jsonschema, '/', jsonschema.required, false, true)}
      </Space>
      <Card
        style={{
          height: '100%',
          overflow: 'scroll',
        }}
      >
        <pre>{formSchema.log()}</pre>
      </Card>
    </Space>
  );
};
