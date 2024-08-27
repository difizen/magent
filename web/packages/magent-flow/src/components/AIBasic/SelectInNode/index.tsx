import { classNames } from '@/utils';
import { Select, SelectProps } from 'antd';
import React from 'react';

export const SelectInNode = (props: SelectProps) => {
  return (
    <Select
      {...props}
      className={classNames(props.className || '', 'nodrag')}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
    ></Select>
  );
};
