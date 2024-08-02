import { CodeOutlined, MessageOutlined } from '@ant-design/icons';
import type { ViewSize } from '@difizen/mana-app';
import { BaseView, ViewInstance, singleton, useInject, view } from '@difizen/mana-app';
import { Avatar, Card } from 'antd';
import { forwardRef } from 'react';

import './index.less';

const viewId = 'magent-agents';
export const slot = `${viewId}-slot`;

const { Meta } = Card;

const AgentsViewComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<AgentsView>(ViewInstance);
    const list = [];
    for (let i = 0; i < 32; i++) {
      list.push({ key: i });
    }

    return (
      <div ref={ref} className={viewId}>
        <div className="agent-cards w-full grid justify-content-center responsive-list-container sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4">
          {list.map((item) => (
            <Card
              className="agent-card"
              key={item.key}
              hoverable
              // style={{ width: 360 }}
              actions={[<CodeOutlined key="dev" />, <MessageOutlined key="chat" />]}
            >
              <Meta
                avatar={
                  <span className="magent-agent-avartar">
                    <Avatar
                      shape="square"
                      size={64}
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Dall-e_3_%28jan_%2724%29_artificial_intelligence_icon.png/200px-Dall-e_3_%28jan_%2724%29_artificial_intelligence_icon.png"
                    />
                  </span>
                }
                title="MKT报告机器人"
                description={
                  <span>
                    MKT Report
                    Bot是您掌握营销报告的教程指南。它提供分步说明、技巧和最佳实践，帮助您创建有效的营销报告并分析关键指标
                  </span>
                }
              />
            </Card>
          ))}
        </div>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class AgentsView extends BaseView {
  cardWidth = 360;
  cardGutter = 16;
  override view = AgentsViewComponent;

  override onViewResize(size: ViewSize): void {
    const { width, height } = size;
    if (!width) {
      return;
    }
    const maxCol = (width + this.cardGutter) / this.cardWidth;
  }
}
