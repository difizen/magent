import { Input } from 'antd';
import React from 'react';

import { CascaderInNode } from '../AIBasic/CascaderInNode/index.js';
import { SelectInNode } from '../AIBasic/SelectInNode/index.js';

export const ReferenceSelect = (props: {
  value?: {
    type: 'reference' | 'value';
    content?: string | [string, string];
  };
  onChange?: (value: {
    type: 'reference' | 'value';
    content?: string | [string, string];
  }) => void;
  refOptions: { label: string; content: string }[];
}) => {
  const { value, onChange, refOptions } = props;
  console.log('🚀 ~ value:', value);

  return (
    <div className="flex gap-2">
      <SelectInNode
        defaultValue={value?.type || 'reference'}
        style={{ width: 80 }}
        onChange={(val) =>
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
          onChange={(val) =>
            onChange?.({
              type: value?.type,
              content: val,
            })
          }
          options={refOptions}
        />
      )}
    </div>
  );
};
