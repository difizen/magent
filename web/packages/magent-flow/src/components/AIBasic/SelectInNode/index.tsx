import type { SelectProps } from 'antd';
import { Select } from 'antd';

import { classNames } from '@/utils/index.js';

export const SelectInNode = (props: SelectProps) => {
  return (
    <Select
      {...props}
      className={classNames(props.className || '', 'nodrag')}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
    ></Select>
  );
};
