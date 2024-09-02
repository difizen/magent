import { GithubFilled } from '@ant-design/icons';
import { BaseView, singleton, useInject, view, ViewInstance } from '@difizen/mana-app';
import { Button } from 'antd';
import { forwardRef } from 'react';

const GithubLinkComponent = forwardRef<HTMLDivElement>(
  function MagentBrandComponent(props, ref) {
    const instance = useInject<GithubLinkView>(ViewInstance);
    return (
      <div ref={ref}>
        <a href={instance.link} target="_blank" rel="noreferrer">
          <Button icon={<GithubFilled />} type="text"></Button>
        </a>
      </div>
    );
  },
);

@singleton()
@view('github-link')
export class GithubLinkView extends BaseView {
  link = 'https://github.com/alipay/agentUniverse';
  override view = GithubLinkComponent;
}
