import { Input } from 'antd';
import React from 'react';

import './index.less';
const clsPrefix = 'opening-speech-input';

export const OpeningSpeechInput = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  return (
    <Input.TextArea
      className={`${clsPrefix}-textarea`}
      value={value}
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
    ></Input.TextArea>
  );
};
