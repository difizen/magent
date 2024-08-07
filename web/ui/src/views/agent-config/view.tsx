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
import { Row, Col } from 'antd';
import { Flex } from 'antd';
import { forwardRef } from 'react';

import { AgentManager } from '../../modules/agent/index.js';
import type { AgentModel } from '../../modules/agent/index.js';

import { CharacterSetting } from './components/CharacterSetting/index.js';
import { ConfigList } from './components/ConfigList/index.js';
import { LLMSetting } from './components/LLMSetting/index.js';
import './index.less';

const viewId = 'magent-dev-config';

const AgentConfigViewComponent = forwardRef<HTMLDivElement>(
  function AgentConfigViewComponent(props, ref) {
    const instance = useInject<AgentConfigView>(ViewInstance);

    return (
      <div ref={ref} className={viewId}>
        <Flex className={`${viewId}-header`} align="center" justify={'space-between'}>
          <h3>应用配置</h3>
          <LLMSetting
            modelOptions={instance.modelOptions}
            value={{
              model: instance.agent.llm.model_name[0],
              temperature: instance.agent.llm.temperature,
            }}
            onChange={(values) => {
              instance.updateLLM(values);
            }}
          />
        </Flex>
        <div className={`${viewId}-content`}>
          <div className={`${viewId}-content-left`}>
            <CharacterSetting
              values={instance.agent.prompt}
              onChange={(values) => {
                instance.updatePrompt(values);
              }}
            ></CharacterSetting>
          </div>
          <div className={`${viewId}-content-right`}>
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

  /**
   * 获取工具列表
   */
  getTools() {
    // TODO
  }

  /**
   * 获取知识库列表
   */
  getKnowledge() {
    // TODO
  }

  /**
   * 更新prompt配置
   */
  updatePrompt(values: {
    instruction?: string;
    introduction?: string;
    target?: string;
  }) {
    if (values.instruction) {
      this.agent.prompt.instruction = values.instruction;
    }
    if (values.introduction) {
      this.agent.prompt.introduction = values.introduction;
    }
    if (values.target) {
      this.agent.prompt.target = values.target;
    }
    this.save();
  }
  updateLLM({ model, temperature }: { model: string; temperature: number }) {
    // TODO 待确认
    this.agent.llm.model_name[0] = model;
    this.agent.llm.temperature = temperature;
    this.save();
  }
  /**
   * 每次修改都自动保存
   */
  save() {
    // TODO
    console.warn('save data', this.agent);
  }
}
