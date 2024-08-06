import { Button, Form, InputNumber, Popover, Select } from 'antd';
import React, { useMemo } from 'react';

export const LLMSetting = ({
  onChange,
  value,
  modelOptions,
}: {
  onChange?: (value: { model: string; temperature: number }) => void;
  value?: {
    model: string;
    temperature: number;
  };
  modelOptions: { label: string; value: string }[];
}) => {
  const content = useMemo(() => {
    return (
      <div>
        <Form initialValues={value} onValuesChange={onChange}>
          <Form.Item label="选择模型" name="model">
            <Select options={modelOptions}></Select>
          </Form.Item>
          <Form.Item label="Temperature" name="temperature">
            <InputNumber min={0} max={1} step={0.1} />
          </Form.Item>
        </Form>
      </div>
    );
  }, [modelOptions, onChange, value]);

  return (
    <div className="llm-setting">
      <Popover placement="bottomLeft" content={content} trigger="click">
        <Button type="primary">大模型设置</Button>
      </Popover>
    </div>
  );
};
