import type { AvatarProps } from 'antd';
import { Avatar } from 'antd';

import { MagentLOGO } from '../base-layout/brand/logo.js';

interface IProps extends AvatarProps {
  agent?: { avatar?: string; id?: string };
}
export const AgentIcon = (props: IProps) => {
  if (props.agent?.avatar) {
    return <Avatar {...props} src={props.agent.avatar} />;
  }
  return <Avatar {...props} src={<MagentLOGO />} />;
};