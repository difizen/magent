import { BaseView, singleton, view } from '@difizen/mana-app';
import './index.less';
import type { CollapseProps } from 'antd';
import { Avatar, Collapse, List } from 'antd';
import { forwardRef } from 'react';

const data = [
  {
    title: 'Arxiv',
  },
];

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: '插件',
    children: (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src="https://mdn.alipayobjects.com/huamei_zabatk/afts/img/A*IR_ISbcKmdcAAAAAAAAAAAAADvyTAQ/original" />
              }
              title={item.title}
              description="Arxiv Plugin"
            />
          </List.Item>
        )}
      />
    ),
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
