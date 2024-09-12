import { classNames } from '@flow/utils/index.js';
import type { SelectProps } from 'antd';
import { Select } from 'antd';

export const SelectInNode = (props: SelectProps) => {
  return (
    <Select
      {...props}
      className={classNames(props.className || '', 'nodrag')}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
    ></Select>
  );
};
