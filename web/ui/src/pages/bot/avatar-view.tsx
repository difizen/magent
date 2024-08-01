import { BaseView, singleton, useInject, view } from '@difizen/mana-app';
import { forwardRef } from 'react';

import { UserAvatar } from '../../modules/user/components/user-avatar.js';
import { UserManager } from '../../modules/user/index.js';

const UserAvatarComponent = forwardRef<HTMLDivElement>(
  function BotConfigComponent(props, ref) {
    const userManager = useInject<UserManager>(UserManager);
    if (!userManager.current) {
      return null;
    }
    return <UserAvatar user={userManager.current} />;
  },
);

@singleton()
@view('user-avatar')
export class UserAvatarView extends BaseView {
  override view = UserAvatarComponent;
}
