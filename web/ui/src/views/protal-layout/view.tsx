import {
  BaseView,
  Slot,
  ViewInstance,
  singleton,
  useInject,
  view,
} from '@difizen/mana-app';
import { Segmented } from 'antd';
import { forwardRef } from 'react';
import { useMatch } from 'react-router-dom';
import { useNavigate } from 'umi';

import { portals } from './protocol.js';

import './index.less';

const viewId = 'magent-portal';
export const slot = `${viewId}-slot`;

const PortalLayoutComponent = forwardRef<HTMLDivElement>(
  function PortalLayoutComponent(props, ref) {
    const instance = useInject<PortalLayoutView>(ViewInstance);
    const match = useMatch('/portal/:portal');
    const portal = match.params?.portal;
    const navigate = useNavigate();

    document.title = `magent-ui ${portal}`;

    const segemntPortals = portals.map((item) => ({
      label: item.label,
      value: item.path,
    }));

    return (
      <div ref={ref} className={viewId}>
        <div className="magent-portal-header">
          <Segmented<string>
            size="large"
            options={segemntPortals}
            value={portal}
            onChange={(value) => {
              history.push();
              navigate(`/portal/${value}`, { replace: true });
            }}
          />
        </div>
        <div className="magent-portal-content">
          <Slot name={`magent-${portal}-slot`}></Slot>
        </div>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class PortalLayoutView extends BaseView {
  override view = PortalLayoutComponent;
}
