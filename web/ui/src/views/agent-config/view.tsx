import {
  BaseView,
  ViewInstance,
  inject,
  prop,
  singleton,
  useInject,
  view,
} from '@difizen/mana-app';
import { Row, Col } from 'antd';
import { Flex } from 'antd';
import { forwardRef } from 'react';

import './index.less';
import { AgentConfigManager } from '../../modules/agent/index.js';
import type { AgentConfig } from '../../modules/agent/index.js';

import { CharacterSetting } from './components/CharacterSetting/index.js';
import { ConfigList } from './components/ConfigList/index.js';
import { LLMSetting } from './components/LLMSetting/index.js';

const viewId = 'magent-debug';
export const slot = `${viewId}-slot`;

const AgentConfigViewComponent = forwardRef<HTMLDivElement>(
  function AgentConfigViewComponent(props, ref) {
    const instance = useInject<AgentConfigView>(ViewInstance);

    return (
      <div ref={ref} className={viewId}>
        <Flex className="header" align="center" justify={'space-between'}>
          <h3>应用配置</h3>
          <LLMSetting
            modelOptions={instance.modelOptions}
            value={{
              model: instance.agentConfig.llm.model_name[0],
              temperature: instance.agentConfig.llm.temperature,
            }}
            onChange={(values) => {
              instance.updateLLM(values);
            }}
          />
        </Flex>
        <Row>
          <Col span={12}>
            <CharacterSetting
              values={instance.agentConfig.prompt}
              onChange={(values) => {
                instance.updatePrompt(values);
              }}
            ></CharacterSetting>
          </Col>

          <Col span={12}>
            <ConfigList></ConfigList>
          </Col>
        </Row>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class AgentConfigView extends BaseView {
  override view = AgentConfigViewComponent;

  @prop() agentConfig: AgentConfig;
  protected agentConfigManager: AgentConfigManager;
  constructor(@inject(AgentConfigManager) agentConfigManager: AgentConfigManager) {
    super();
    this.agentConfigManager = agentConfigManager;
    // TODO fix id
    this.getAgentConfig('1');
  }

  get modelOptions() {
    // TODO 大模型optios列表和对应存取值要怎么取？
    return (
      this.agentConfig?.llm?.model_name?.map((item) => {
        return {
          label: item,
          value: item,
        };
      }) || []
    );
  }
  /**
   * 初始化配置
   * @param id
   */
  getAgentConfig = async (id: string) => {
    this.agentConfig = this.agentConfigManager.create({ id });
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
      this.agentConfig.prompt.instruction = values.instruction;
    }
    if (values.introduction) {
      this.agentConfig.prompt.introduction = values.introduction;
    }
    if (values.target) {
      this.agentConfig.prompt.target = values.target;
    }
    this.save();
  }
  updateLLM({ model, temperature }: { model: string; temperature: number }) {
    // TODO 待确认
    this.agentConfig.llm.model_name[0] = model;
    this.agentConfig.llm.temperature = temperature;
    this.save();
  }
  /**
   * 每次修改都自动保存
   */
  save() {
    // TODO
    console.warn('save data', this.agentConfig);
  }
}
