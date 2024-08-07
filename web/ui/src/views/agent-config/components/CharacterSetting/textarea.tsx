import { Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input/TextArea.js';

export const TextArea = (props: TextAreaProps) => {
  return <Input.TextArea {...props}></Input.TextArea>;
};
