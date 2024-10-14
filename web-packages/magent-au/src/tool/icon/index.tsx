import { toResourceUrl } from '@difizen/magent-core';
import type { AvatarProps } from 'antd';
import { Avatar } from 'antd';

import toolIcon from './tool.svg';

interface IProps extends AvatarProps {
  data?: { avatar?: string; id?: string };
}
export const ToolIcon = (props: IProps) => {
  if (props.data?.avatar) {
    return <Avatar {...props} shape="square" src={toResourceUrl(props.data.avatar)} />;
  }
  return <Avatar {...props} shape="square" src={toolIcon} />;
};

export const DefaultToolIcon = () => {
  return <Avatar shape="square" src={toolIcon} />;
};
