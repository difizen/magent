import { EditOutlined, MessageOutlined } from '@ant-design/icons';
import {
  BaseView,
  ViewInstance,
  inject,
  singleton,
  useInject,
  view,
  prop,
  ModalService,
} from '@difizen/mana-app';
import { Button, Card } from 'antd';
import { forwardRef } from 'react';
import { format } from 'timeago.js';

import { AgentIcon } from '../../agent/agent-icon.js';
import { AgentMarket } from '../../agent/agent-market.js';
import type { AgentModel } from '../../agent/agent-model.js';
import { RouterHistory } from '../../common/router.js';

import { AgentCreateModal } from './modal/create.js';
import './index.less';

const viewId = 'magent-agents';
export const slot = `${viewId}-slot`;

const { Meta } = Card;

const AgentsViewComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<AgentsView>(ViewInstance);
    const modalService = useInject<ModalService>(ModalService);
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
                <div key={item.id} className="agent-card-footer">
                  <div className="agent-card-mtime">
                    {item.mtime ? format(item.mtime.toDate(), 'zh_CN') : null}
                  </div>
                  <div className="agent-card-actions">
                    <Button type="text" key="chat" icon={<MessageOutlined />}></Button>
                    <Button
                      type="text"
                      onClick={(e) => {
                        e.stopPropagation();
                        instance.toDevPage(item);
                      }}
                      key="dev"
                      icon={<EditOutlined />}
                    ></Button>
                  </div>
                </div>,
              ]}
              onClick={() => {
                instance.toChatPage(item);
              }}
            >
              <Meta
                avatar={
                  <span className="magent-agent-avartar">
                    <AgentIcon shape="square" size={64} agent={item} />
                  </span>
                }
                title={item.name}
                description={<span>{item.name}</span>}
              />
            </Card>
          ))}
        </div>

        <div className="magent-agents-creation">
          <Button
            onClick={() => {
              modalService.openModal(AgentCreateModal);
            }}
            type="default"
          >
            创建智能体
          </Button>
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
  @inject(RouterHistory) history: RouterHistory;

  override async onViewMount(): Promise<void> {
    this.loadig = true;
    await this.market.update();
    this.loadig = false;
  }

  toChatPage = (agent: AgentModel) => {
    this.history.push(`/agent/${agent.id}/chat`);
  };

  toDevPage = async (agent: AgentModel) => {
    await agent.fetchInfo();
    if (agent.planner?.id === 'workflow_planner') {
      this.history.push(`/agent/${agent.id}/flow`);
    } else {
      this.history.push(`/agent/${agent.id}/dev`);
    }
  };
}
