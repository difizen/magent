import { BaseView, singleton, view } from '@difizen/mana-app';
import './index.less';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { forwardRef } from 'react';

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: '插件',
    children: 'test',
  },
];

const BotSettingComponent = forwardRef<HTMLDivElement>(
  function BotSkillComponent(props, ref) {
    return (
      <div ref={ref} className="bot-skill">
        <div className="bot-skill-title">技能</div>
        <Collapse defaultActiveKey={['1']} ghost items={items} />
      </div>
    );
  },
);

@singleton()
@view('bot-setting')
export class BotSettingView extends BaseView {
  override view = BotSettingComponent;
}
