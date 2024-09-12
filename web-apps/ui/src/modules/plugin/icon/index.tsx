import type { AvatarProps } from 'antd';
import { Avatar } from 'antd';

import { toResourceUrl } from '@/common/page-config.js';

import icon from './plugin.svg';

interface IProps extends AvatarProps {
  data?: { avatar?: string; id?: string };
}
export const PluginIcon = (props: IProps) => {
  if (props.data?.avatar) {
    return <Avatar {...props} shape="square" src={toResourceUrl(props.data.avatar)} />;
  }
  return <Avatar {...props} shape="square" src={icon} />;
};

export const DefaultPluginIcon = () => {
  return <Avatar shape="square" src={icon} />;
};
