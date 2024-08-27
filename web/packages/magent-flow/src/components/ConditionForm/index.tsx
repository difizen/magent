import { Form } from 'antd';
import type { DefaultOptionType } from 'antd/es/cascader';
import { memo, useEffect } from 'react';

import type { ConditionBranch } from '@/interfaces/flow.js';

import { SelectInNode } from '../AIBasic/SelectInNode//index.js';
import { ReferenceSelect } from '../ReferenceSelect/index.js';

export const ConditionForm = (props: {
  refOptions: DefaultOptionType[];
  value: ConditionBranch;
  onChange: (val: ConditionBranch) => void;
}) => {
  const { refOptions, value, onChange } = props;
  const [form] = Form.useForm();
  const compare = Form.useWatch('compare', form);

  useEffect(() => {
    form.setFieldsValue(value.conditions[0]);
  }, []);

  return (
    <Form
      form={form}
      layout="inline"
      onValuesChange={(_, allFields) => {
        form.validateFields().then(() => {
          onChange({
            name: value.name,
            conditions: [allFields],
          });
        });
      }}
    >
      <Form.Item name={['left', 'value']}>
        <ReferenceSelect refOptions={refOptions} />
      </Form.Item>
      <Form.Item name="compare">
        <SelectInNode
          className="w-[80px]"
          options={[
            { label: '等于', value: 'equal' },
            { label: '不等于', value: 'not_equal' },
            { label: '为空', value: 'blank' },
          ]}
        />
      </Form.Item>
      {compare !== 'blank' && (
        <Form.Item name={['right', 'value']}>
          <ReferenceSelect refOptions={refOptions} />
        </Form.Item>
      )}
    </Form>
  );
};
