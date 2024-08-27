import { Input } from 'antd';
import type { DefaultOptionType } from 'antd/es/cascader';

import type { SchemaValueType, ValueType } from '@/interfaces/flow.js';

import { CascaderInNode } from '../AIBasic/CascaderInNode/index.js';
import { SelectInNode } from '../AIBasic/SelectInNode/index.js';

export const ReferenceSelect = (props: {
  value?: SchemaValueType;
  onChange?: (value: SchemaValueType) => void;
  refOptions: DefaultOptionType[];
}) => {
  const { value, onChange, refOptions } = props;

  return (
    <div className="flex gap-2">
      <SelectInNode
        value={value?.type}
        style={{ width: 80 }}
        onChange={(val: ValueType) =>
          onChange?.({
            type: val,
          })
        }
        options={[
          { label: '引用', value: 'reference' },
          { label: '值', value: 'value' },
        ]}
      />

      {value?.type === 'value' ? (
        <Input
          style={{ width: 120 }}
          onChange={(e) =>
            onChange?.({
              type: value.type,
              content: e.target.value,
            })
          }
        />
      ) : (
        <CascaderInNode
          style={{ width: 120 }}
          value={value?.content || []}
          onChange={(val: [string, string]) =>
            onChange?.({
              type: value?.type || 'reference',
              content: val,
            })
          }
          options={refOptions}
        />
      )}
    </div>
  );
};
