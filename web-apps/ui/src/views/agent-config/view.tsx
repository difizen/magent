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
  ModalService,
} from '@difizen/mana-app';
import { Flex } from 'antd';
import { forwardRef } from 'react';

import { AgentManager } from '@/modules/agent/agent-manager.js';
import type { AgentModel } from '@/modules/agent/protocol.js';
import { KnowledgeIcon } from '@/modules/knowledge/knowledge-icon.js';
import type { KnowledgeModelOption } from '@/modules/knowledge/protocol.js';
import { ModelSelector } from '@/modules/model/model-selector/index.js';
import { ToolIcon } from '@/modules/tool/tool-icon.js';

import { CharacterSetting } from './components/character-setting/index.js';
import { ConfigList } from './components/config-selector/index.js';
import { KnowledgeModal } from './knowledge-modal/modal.js';
import { ToolsModal } from './tools-modal/modal.js';
import './index.less';

const viewId = 'magent-dev-config';

const AgentConfigViewComponent = forwardRef<HTMLDivElement>(
  function AgentConfigViewComponent(props, ref) {
    const instance = useInject<AgentConfigView>(ViewInstance);
    const modalService = useInject<ModalService>(ModalService);

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
              <ModelSelector
                value={instance.agent.llm}
                onChange={instance.agent.llm?.updateMeta}
              />
            </div>
            <ConfigList
              selector={[
                {
                  key: 'tool',
                  title: '能力',
                  options: instance.agent.tool.map((item) => {
                    return {
                      ...item,
                      icon: <ToolIcon data={item} />,
                    };
                  }),
                  onAdd: () => {
                    if (instance.agent) {
                      modalService.openModal(ToolsModal, { agent: instance.agent });
                    }
                  },
                  onDelete: (item) => {
                    if (!instance.agent) {
                      return;
                    }
                    instance.agent.tool = instance.agent.tool.filter(
                      (i) => i.id !== item.id,
                    );
                  },
                },
                {
                  key: 'knowledge',
                  title: '知识',
                  options: (instance.agent.knowledge || []).map((item) => {
                    return {
                      ...item,
                      icon: <KnowledgeIcon data={item} />,
                    };
                  }),
                  onAdd: () => {
                    if (instance.agent) {
                      modalService.openModal(KnowledgeModal, {
                        dataProvider: instance.agent,
                        onChange: (knowledges: KnowledgeModelOption[]) => {
                          instance.agent.knowledge = [...knowledges];
                        },
                      });
                    }
                  },
                  onDelete: (item) => {
                    if (!instance.agent || !instance.agent.knowledge) {
                      return;
                    }
                    instance.agent.knowledge = instance.agent.knowledge.filter(
                      (i) => i.id !== item.id,
                    );
                  },
                },
              ]}
            ></ConfigList>
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
      this.agent?.llm?.models?.map((item) => {
        return {
          label: item,
          value: item,
        };
      }) || []
    );
  }

  protected initAgent = (agentId = this.agentId) => {
    if (agentId) {
      const agent = this.agentManager.getOrCreate({ id: agentId });
      agent.fetchInfo();
      this.agent = agent;
      return agent;
    }
    return undefined;
  };
}
