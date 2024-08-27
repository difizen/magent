import type { AvatarProps } from 'antd';
import { Avatar } from 'antd';

import { toResourceUrl } from '@/common/page-config.js';

import { MagentLOGO } from '../base-layout/brand/logo.js';

interface IProps extends AvatarProps {
  agent?: { avatar?: string; id?: string };
}
export const AgentIcon = (props: IProps) => {
  if (props.agent?.avatar) {
    return <Avatar shape="square" {...props} src={toResourceUrl(props.agent.avatar)} />;
  }
  return <Avatar shape="square" {...props} src={<MagentLOGO />} />;
};
