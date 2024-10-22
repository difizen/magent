import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
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
import { Button, Flex, message } from 'antd';
import { forwardRef } from 'react';

import { AgentManager } from '../../agent/agent-manager.js';
import type { AgentModel } from '../../agent/protocol.js';
import { KnowledgeIcon } from '../../knowledge/knowledge-icon.js';
import type { KnowledgeModelOption } from '../../knowledge/protocol.js';
import { ModelSelector } from '../../model/model-selector/index.js';
import { ToolIcon } from '../../tool/icon/index.js';
import type { ToolMeta } from '../../tool/protocol.js';
import { ToolsModalId } from '../../tool/protocol.js';

import { CharacterSetting } from './components/character-setting/index.js';
import { ConfigList } from './components/config-selector/index.js';
import { KnowledgeModal } from './knowledge-modal/modal.js';
import './index.less';

const viewId = 'magent-dev-config';

const AgentConfigViewComponent = forwardRef<HTMLDivElement>(
  function AgentConfigViewComponent(props, ref) {
    const instance = useInject<AgentConfigView>(ViewInstance);
    const modalService = useInject<ModalService>(ModalService);
    const agent = instance.agent;

    return (
      <div ref={ref} className={viewId}>
        <Flex className={`${viewId}-header`} align="center" justify={'space-between'}>
          <h3>编排</h3>
          <Button
            type="text"
            className={`${viewId}-header-save`}
            onClick={() =>
              agent.save().then((saved) => {
                if (saved) {
                  message.success('保存成功');
                }
                agent.fetchInfo(undefined, true);
                return;
              })
            }
            icon={agent.saving ? <LoadingOutlined /> : <SaveOutlined />}
          ></Button>
        </Flex>
        <div className={`${viewId}-content`}>
          <div className={`${viewId}-content-left`}>
            <CharacterSetting></CharacterSetting>
          </div>
          <div className={`${viewId}-content-right`}>
            <div className={`${viewId}-content-model`}>
              <div className={`${viewId}-content-model-title`}>模型</div>
              <ModelSelector value={agent.llm} onChange={agent.llm?.updateMeta} />
            </div>
            <ConfigList
              selector={[
                {
                  key: 'tool',
                  title: '能力',
                  options: agent.tool.map((item) => {
                    return {
                      ...item,
                      description: item.description || '',
                      icon: <ToolIcon data={item} />,
                    };
                  }),
                  onAdd: () => {
                    if (agent) {
                      modalService.openModal(ToolsModalId, {
                        dataProvider: agent,
                        expandAll: true,
                        onChange: (val: ToolMeta[]) => {
                          agent.tool = val;
                        },
                      });
                    }
                  },
                  onDelete: (item) => {
                    if (!agent) {
                      return;
                    }
                    agent.tool = agent.tool.filter((i) => i.id !== item.id);
                  },
                },
                {
                  key: 'knowledge',
                  title: '知识',
                  options: (agent.knowledge || []).map((item) => {
                    return {
                      ...item,
                      icon: <KnowledgeIcon data={item} />,
                    };
                  }),
                  onAdd: () => {
                    if (agent) {
                      modalService.openModal(KnowledgeModal, {
                        dataProvider: agent,
                        onChange: (knowledges: KnowledgeModelOption[]) => {
                          agent.knowledge = [...knowledges];
                        },
                      });
                    }
                  },
                  onDelete: (item) => {
                    if (!agent || !agent.knowledge) {
                      return;
                    }
                    agent.knowledge = agent.knowledge.filter((i) => i.id !== item.id);
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
