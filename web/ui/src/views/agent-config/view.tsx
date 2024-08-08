import { SaveOutlined } from '@ant-design/icons';
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

import { CharacterSetting } from './components/CharacterSetting/index.js';
import { ConfigList } from './components/ConfigList/index.js';
import { ModelSelector } from './components/model-selector/view.js';
import './index.less';

const viewId = 'magent-dev-config';

const AgentConfigViewComponent = forwardRef<HTMLDivElement>(
  function AgentConfigViewComponent(props, ref) {
    const instance = useInject<AgentConfigView>(ViewInstance);

    return (
      <div ref={ref} className={viewId}>
        <Flex className={`${viewId}-header`} align="center" justify={'space-between'}>
          <h3>编排</h3>
          <SaveOutlined
            className={`${viewId}-header-save`}
            onClick={() => instance.agent.save()}
          />
        </Flex>
        <div className={`${viewId}-content`}>
          <div className={`${viewId}-content-left`}>
            <CharacterSetting></CharacterSetting>
          </div>
          <div className={`${viewId}-content-right`}>
            <div className={`${viewId}-content-model`}>
              <div className={`${viewId}-content-model-title`}>模型</div>
              <ModelSelector />
            </div>
            <ConfigList></ConfigList>
          </div>
        </div>
      </div>
    );
  },
);

export interface AgentConfigViewOption {
  agentId: string;
}
@transient()
@view(viewId)
export class AgentConfigView extends BaseView {
  agentId: string;
  override view = AgentConfigViewComponent;

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
