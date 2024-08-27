import { SaveOutlined } from '@ant-design/icons';
import { FlowWithPanel } from '@difizen/magent-flow';
import {
  BaseView,
  ViewInstance,
  inject,
  prop,
  useInject,
  view,
  ViewOption,
  transient,
} from '@difizen/mana-app';
import { Flex } from 'antd';
import { forwardRef } from 'react';

import { AgentManager } from '../../modules/agent/index.js';
import type { AgentModel } from '../../modules/agent/index.js';

import './index.less';

const viewId = 'magent-agent-flow';

const AgentFlowComponent = forwardRef<HTMLDivElement>(
  function AgentConfigViewComponent(props, ref) {
    const instance = useInject<AgentFlowView>(ViewInstance);

    return (
      <div ref={ref} className={viewId}>
        <FlowWithPanel />
      </div>
    );
  },
);

export interface AgentConfigViewOption {
  agentId: string;
}
@transient()
@view(viewId)
export class AgentFlowView extends BaseView {
  agentId: string;
  override view = AgentFlowComponent;

  @prop() agent: AgentModel;
  protected agentManager: AgentManager;
  constructor(
    @inject(ViewOption) option: AgentConfigViewOption,
    @inject(AgentManager) agentManager: AgentManager,
  ) {
    super();
    this.agentId = option.agentId;
    this.agentManager = agentManager;
    this.initAgent(option.agentId);
  }

  get modelOptions() {
    // TODO 大模型optios列表和对应存取值要怎么取？
    return (
      this.agent?.llm?.model_name?.map((item) => {
        return {
          label: item,
          value: item,
        };
      }) || []
    );
  }

  protected initAgent = (agentId = this.agentId) => {
    if (agentId) {
      const agent = this.agentManager.getOrCreateAgent({ id: agentId });
      agent.fetchInfo();
      this.agent = agent;
      return agent;
    }
    return undefined;
  };
}
