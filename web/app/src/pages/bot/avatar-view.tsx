import {
  BaseView,
  ViewInstance,
  inject,
  prop,
  singleton,
  useInject,
  view,
} from '@difizen/mana-app';
import { forwardRef } from 'react';

import { UserAvatar } from '../../modules/user/components/user-avatar.js';
import type { User } from '../../modules/user/index.js';
import { UserManager } from '../../modules/user/index.js';

const UserAvatarComponent = forwardRef<HTMLDivElement>(
  function BotConfigComponent(props, ref) {
    const instance = useInject<UserAvatarView>(ViewInstance);
    if (!instance.user) {
      return null;
    }
    return <UserAvatar user={instance.user} />;
  },
);

@singleton()
@view('user-avatar')
export class UserAvatarView extends BaseView {
  @prop() user?: User;
  @inject(UserManager) userManager: UserManager;
  override view = UserAvatarComponent;

  override onViewMount(): void {
    this.user = this.userManager.getOrCreate({ id: '1' });
  }
}
