import classNames from '@flow/utils/classnames.js';
import type { PopoverProps } from 'antd';
import { Popover } from 'antd';

export const PopoverInNode = (props: PopoverProps) => {
  return (
    <Popover
      {...props}
      className={classNames(props.className || '', 'nodrag')}
      getPopupContainer={(triggerNode) => triggerNode.parentElement!}
    >
      {props.children}
    </Popover>
  );
};
