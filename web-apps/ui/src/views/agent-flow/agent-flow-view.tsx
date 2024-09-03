import { DeleteOutlined } from '@ant-design/icons';
import type { BasicSchema } from '@difizen/magent-flow';
import { useFlowStore, useKnowledgeStore, useModelStore } from '@difizen/magent-flow';
import {
  BaseView,
  inject,
  prop,
  view,
  ViewOption,
  transient,
  useInject,
  ViewInstance,
} from '@difizen/mana-app';
import { Button } from 'antd';
// import yaml from 'js-yaml';
import { forwardRef, useEffect, useState } from 'react';

import { AgentManager } from '@/modules/agent/agent-manager.js';
import type { AgentModel } from '@/modules/agent/protocol.js';
import './index.less';
import { RequestHelper } from '@/modules/axios-client/request.js';
import type { KnowledgeModelOption } from '@/modules/knowledge/protocol.js';
import { ModelSelector } from '@/modules/model/model-selector/index.js';
import type { LLMMeta } from '@/modules/model/protocol.js';
import type { WorkflowPlannerMeta } from '@/modules/planner/protocol.js';
import type { Graph, WorkflowMeta } from '@/modules/workflow/protocol.js';

import {
  KnowledgeModal,
  KnowledgeModalComponent,
} from '../agent-config/knowledge-modal/modal.js';

import { InitEdgeParser, InitNodeParser } from './flow-utils.js';
import { FlowWithTabs } from './flow-with-tabs/index.js';

const viewId = 'magent-agent-flow';

const AgentFlowComponent = forwardRef<HTMLDivElement>(
  function AgentConfigViewComponent(props, ref) {
    const { setModelSelector } = useModelStore();
    const { setKnowledgeSelector } = useKnowledgeStore();
    const { setNode, initFlow } = useFlowStore();
    const instance = useInject<AgentFlowView>(ViewInstance);

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
                        content: val.model_name[0],
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
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      marginBottom: '6px',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '500',
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

    useEffect(() => {
      instance
        .getGraphInfo()
        .then((info) => {
          // const graph = yaml.load(mockGraph) as Graph;
          const graph = info.graph || { nodes: [], edges: [] };
          const nodes = graph.nodes.map((n) => {
            return InitNodeParser(n);
          });

          const edges = graph.edges.map((e) => {
            return InitEdgeParser(e);
          });

          // 获取 yaml 初始化 flow
          initFlow({
            nodes: [...nodes],
            edges: [...edges],
          });
          return;
        })
        .catch(console.error);
    }, [initFlow, instance]);

    return (
      <div ref={ref} className={viewId}>
        <FlowWithTabs toolbar={<></>} />
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
  @inject(RequestHelper) request: RequestHelper;
  agentId: string;
  override view = AgentFlowComponent;

  @prop() agent: AgentModel;

  @prop() workflowId: string;
  @prop() workflow: WorkflowMeta;

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

  protected getWorkflowInfo = async (workflowId: string) => {
    const res = await this.request.get<WorkflowMeta>(
      `/api/v1/workflows/${workflowId}`,
      {},
    );
    if (res.status === 200) {
      this.workflow = res.data;
    }
    return this.workflow;
  };

  getGraphInfo = async () => {
    await this.agent.ready;
    const planner = this.agent.planner as WorkflowPlannerMeta;
    const workflowId = planner.workflow_id;
    this.workflowId = workflowId;
    return await this.getWorkflowInfo(workflowId);
  };

  saveGraph = async (graph: Graph) => {
    await this.agent.ready;
    if (!this.workflowId || !this.workflow) {
      return;
    }
    this.workflow.graph = graph;
    const res = await this.request.put<WorkflowMeta>(
      `/api/v1/workflows/${this.workflowId}`,
      this.workflow,
    );
    return res;
  };
}
