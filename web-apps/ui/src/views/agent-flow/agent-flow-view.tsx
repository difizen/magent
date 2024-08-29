import { DeleteOutlined } from '@ant-design/icons';
import type { BasicSchema } from '@difizen/magent-flow';
import {
  FlowWithPanel,
  useFlowStore,
  useKnowledgeStore,
  useModelStore,
} from '@difizen/magent-flow';
import { BaseView, inject, prop, view, ViewOption, transient } from '@difizen/mana-app';
import { Button } from 'antd';
import { forwardRef, useEffect, useState } from 'react';

import { AgentManager } from '@/modules/agent/agent-manager.js';
import type { AgentModel } from '@/modules/agent/protocol.js';
import './index.less';
import type { KnowledgeModelOption } from '@/modules/knowledge/protocol.js';
import { ModelSelector } from '@/modules/model/model-selector/index.js';
import type { LLMMeta } from '@/modules/model/protocol.js';

import {
  KnowledgeModal,
  KnowledgeModalComponent,
} from '../agent-config/knowledge-modal/modal.js';

import { Toolbar } from './toolbar.js';

const viewId = 'magent-agent-flow';

const AgentFlowComponent = forwardRef<HTMLDivElement>(
  function AgentConfigViewComponent(props, ref) {
    const { setModelSelector } = useModelStore();
    const { setKnowledgeSelector } = useKnowledgeStore();
    const { setNode } = useFlowStore();

    useEffect(() => {
      // 注册 flow 中模型选择
      const Ele = ({
        nodeId,
        llmParam,
      }: {
        nodeId: string;
        llmParam: BasicSchema[];
      }) => {
        const onChange = (val?: LLMMeta) => {
          if (!val) {
            return;
          }
          setNode(nodeId, (old) => ({
            ...old,
            data: {
              ...old.data,
              config: {
                ...(old.data['config'] as Record<string, any>),
                inputs: {
                  ...old.data['config'].inputs,
                  llm_param: [
                    llmParam.find((p) => p.name === 'prompt'),
                    {
                      name: 'id',
                      type: 'string',
                      value: {
                        type: 'value',
                        content: val.id,
                      },
                    },
                    {
                      name: 'temperature',
                      type: 'string',
                      value: {
                        type: 'value',
                        content: val.temperature,
                      },
                    },
                    {
                      name: 'model_name',
                      type: 'string',
                      value: {
                        type: 'value',
                        content: val.model_name,
                      },
                    },
                  ],
                },
              },
            },
          }));
        };
        const value: LLMMeta = {
          id: llmParam.find((p) => p.name === 'id')?.value?.content as string,
          temperature: Number(
            llmParam.find((p) => p.name === 'temperature')?.value?.content as string,
          ),
          nickname: '',
          model_name: [
            llmParam.find((p) => p.name === 'model_name')?.value?.content as string,
          ],
        };
        return (
          <>
            <ModelSelector value={value} onChange={onChange} />
          </>
        );
      };
      setModelSelector(Ele as any);
      const Ele2 = ({
        nodeId,
        knowledgeParam,
      }: {
        nodeId: string;
        knowledgeParam: BasicSchema[];
      }) => {
        const [knowledgeModal, setKnowledgeModal] = useState<boolean>(false);

        const onChange = (val: any) => {
          setNode(nodeId, (old) => ({
            ...old,
            data: {
              ...old.data,
              config: {
                ...(old.data['config'] as Record<string, any>),
                inputs: {
                  ...old.data['config'].inputs,
                  knowledge_param: [
                    {
                      name: 'top_k',
                      type: 'string',
                      value: {
                        type: 'value',
                        content: val.top_k,
                      },
                    },
                    {
                      name: 'id',
                      type: 'string',
                      value: {
                        type: 'value',
                        content: val.id,
                      },
                    },
                  ],
                },
              },
            },
          }));
        };

        const value: any = {
          knowledge: (
            (knowledgeParam.find((p) => p.name === 'id')?.value?.content ||
              []) as string[]
          ).map((k) => ({ id: k })),
          top_k: knowledgeParam.find((p) => p.name === 'top_k')?.value
            ?.content as string,
        };

        return (
          <>
            <KnowledgeModalComponent
              visible={knowledgeModal}
              close={() => setKnowledgeModal(false)}
              data={{
                dataProvider: { knowledge: [...value.knowledge] },
                onChange: (knowledges: KnowledgeModelOption[]) => {
                  onChange({
                    id: [...knowledges.map((k) => k.id)],
                    top_k: value.top_k,
                  });
                },
              }}
              modalItem={KnowledgeModal}
            />
            <div>
              <div>
                {value.knowledge.map((k) => (
                  <div
                    style={{
                      width: '100%',
                      border: '1px dashed #d9d9d9',
                      borderRadius: '4px',
                      marginBottom: '6px',
                      padding: '6px',
                      display: 'flex',
                      justifyItems: 'between',
                      alignItems: 'center',
                    }}
                    key={k.id}
                  >
                    <div>{k.id}</div>
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        onChange({
                          id: value.knowledge
                            .filter((kn) => kn.id !== k.id)
                            .map((kn) => kn.id),
                        });
                      }}
                    ></Button>
                  </div>
                ))}
              </div>
              <Button
                style={{
                  width: '100%',
                  border: '1px dashed #d9d9d9',
                  padding: '6px',
                  // zIndex,
                }}
                type="link"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();

                  setKnowledgeModal(true);
                }}
              >
                添加知识库
              </Button>
            </div>
          </>
        );
      };
      setKnowledgeSelector(Ele2 as any);
    }, [setKnowledgeSelector, setModelSelector, setNode]);

    return (
      <div ref={ref} className={viewId}>
        <FlowWithPanel
          toolbar={
            <Toolbar
              style={{
                right: 16,
                top: 16,
                zIndex: 9,
                position: 'absolute',
              }}
            />
          }
        />
      </div>
    );
  },
);

export interface AgentFlowViewOption {
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
    @inject(ViewOption) option: AgentFlowViewOption,
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
