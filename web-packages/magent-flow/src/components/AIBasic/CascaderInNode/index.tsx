import type { CascaderProps } from 'antd';
import { Cascader } from 'antd';
import React from 'react';

import { classNames } from '@/utils/index.js';

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
