import { classNames } from '@flow/utils/index.js';
import type { CascaderProps } from 'antd';
import { Cascader } from 'antd';

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
