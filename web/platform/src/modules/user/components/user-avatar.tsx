import { UserOutlined } from '@ant-design/icons';
import { useInject, useObserve } from '@difizen/mana-app';
import type { AvatarProps } from 'antd';
import { Avatar, Tooltip } from 'antd';
import React from 'react';

import { UserManager } from '../user-manager.js';
import type { User } from '../user.js';

export interface UserAvatarProps extends AvatarProps {
  user?: User;
  size?: AvatarProps['size'];
  shape?: AvatarProps['shape'];
  gap?: AvatarProps['gap'];
}
export const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  const userMeta = props.user;
  const userManager = useInject(UserManager);
  let originUser: User | undefined;
  if (userMeta) {
    originUser = userManager.getOrCreate(userMeta);
  } else {
    originUser = userManager.current;
  }
  const user = useObserve(originUser);

  if (!user) {
    return null;
  }
  const displayProps: any = { ...props, user: undefined };
  if (user.avatar) {
    displayProps.src = user.avatar;
  } else {
    displayProps.icon = <UserOutlined />;
  }
  return (
    <Tooltip title={user.name}>
      <Avatar {...displayProps} />
    </Tooltip>
  );
};
