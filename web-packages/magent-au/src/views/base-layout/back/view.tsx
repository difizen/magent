import { LeftOutlined } from '@ant-design/icons';
import { BaseView, singleton, useInject, view } from '@difizen/mana-app';
import { forwardRef } from 'react';

import { MainView } from '../../common/main-view.js';

import './index.less';

const MagentGoBackComponent = forwardRef<HTMLDivElement>(
  function MagentGoBackComponent(props, ref) {
    const mainView = useInject(MainView);
    if (mainView.active && mainView.active.goBack) {
      return (
        <div
          onClick={() => {
            mainView.active?.goBack?.();
          }}
          ref={ref}
          className={viewId}
        >
          <LeftOutlined />
        </div>
      );
    }
    return null;
  },
);

export const viewId = 'magent-go-back';

@singleton()
@view(viewId)
export class MagentGoBackView extends BaseView {
  override view = MagentGoBackComponent;
}
