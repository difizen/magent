import { GithubFilled } from '@ant-design/icons';
import { BaseView, singleton, view } from '@difizen/mana-app';
import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import { forwardRef } from 'react';

import { AULOGO, MagentLOGO } from '../brand/logo.js';

import './index.less';

const GithubLinkComponent = forwardRef<HTMLDivElement>(
  function MagentBrandComponent(props, ref) {
    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <a
            className="magent-github-au"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/alipay/agentUniverse"
          >
            <AULOGO />
          </a>
        ),
      },
      {
        key: '2',
        label: (
          <a
            className="magent-github-magent"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/difizen/magent"
          >
            <MagentLOGO />
            magent
          </a>
        ),
      },
    ];
    return (
      <div ref={ref}>
        <Dropdown
          rootClassName="magent-github"
          menu={{ items }}
          placement="bottomLeft"
          arrow
        >
          <Button icon={<GithubFilled />} type="text"></Button>
        </Dropdown>
      </div>
    );
  },
);

@singleton()
@view('github-link')
export class GithubLinkView extends BaseView {
  override view = GithubLinkComponent;
}
