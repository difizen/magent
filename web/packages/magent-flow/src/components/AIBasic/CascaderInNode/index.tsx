import { classNames } from '@/utils';
import { Cascader, CascaderProps } from 'antd';
import React from 'react';

export const CascaderInNode = (props: CascaderProps) => {
  return (
    <Cascader
      {...props}
      multiple={props.multiple as any}
      className={classNames(props.className || '', 'nodrag')}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
    />
  );
};
