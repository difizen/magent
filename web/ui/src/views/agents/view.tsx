import { EditOutlined, MessageOutlined } from '@ant-design/icons';
import {
  BaseView,
  ViewInstance,
  inject,
  singleton,
  useInject,
  view,
  prop,
} from '@difizen/mana-app';
import { Avatar, Card } from 'antd';
import { forwardRef } from 'react';
import { history } from 'umi';

import './index.less';
import { AgentMarket } from '../../modules/agent/agent-market.js';
import { MagentLOGO } from '../../modules/base-layout/brand/logo.js';

const viewId = 'magent-agents';
export const slot = `${viewId}-slot`;

const { Meta } = Card;

const AgentsViewComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<AgentsView>(ViewInstance);
    const market = instance.market;

    return (
      <div ref={ref} className={viewId}>
        <div className="agent-cards sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4">
          {market.list.map((item) => (
            <Card
              className="agent-card"
              key={item.id}
              hoverable
              actions={[
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    instance.toDevPage(item.id);
                  }}
                  key="dev"
                />,
                <MessageOutlined key="chat" />,
              ]}
              onClick={() => {
                instance.toChatPage(item.id);
              }}
            >
              <Meta
                avatar={
                  <span className="magent-agent-avartar">
                    <Avatar
                      shape="square"
                      size={64}
                      src={item.avatar || <MagentLOGO />}
                    />
                  </span>
                }
                title={item.name}
                description={<span>{item.name}</span>}
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
  @prop()
  loadig = false;

  override view = AgentsViewComponent;
  @inject(AgentMarket) market: AgentMarket;
  override async onViewMount(): Promise<void> {
    this.loadig = true;
    await this.market.update();
    this.loadig = false;
  }

  toChatPage = (agentId: string) => {
    history.push(`/agent/${agentId}/chat`);
  };

  toDevPage = (agentId: string) => {
    history.push(`/agent/${agentId}/dev`);
  };
}
