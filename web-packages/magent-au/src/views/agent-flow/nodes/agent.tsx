import type { BasicSchema, NodeDataType } from '@difizen/magent-flow';
import {
  CollapseWrapper,
  PromptEditor,
  NodeWrapper,
  ReferenceForm,
  useFlowStore,
  OutputVariable,
} from '@difizen/magent-flow';
import { useInject } from '@difizen/mana-app';
import { Card, Modal } from 'antd';
import { useState } from 'react';

import { AgentIcon } from '../../../agent/agent-icon.js';
import { AgentMarket } from '../../../agent/agent-market.js';

import { TransferButton } from './transfer-button.js';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const AgentNode = (props: Props) => {
  const { data } = props;

  const [agentModalOpen, setAgentModalOpen] = useState<boolean>(false);
  const { findUpstreamNodes, setNode } = useFlowStore();
  const upstreamNodes = findUpstreamNodes(data.id.toString());
  const agentMarket = useInject(AgentMarket);
  const agentParam = data.config?.inputs?.agent_param as BasicSchema[];

  const agentList = agentMarket?.list.map((item) => item.toMeta());

  const agenyMeta = agentList.find(
    (agent) => agent.id === agentParam.find((a) => a.name === 'id')?.value?.content,
  );

  return (
    <NodeWrapper
      nodeProps={props}
      icon={agenyMeta?.avatar}
      extra={
        <TransferButton onClick={() => setAgentModalOpen(true)}>
          选择智能体
        </TransferButton>
      }
    >
      <Modal
        title="选择智能体"
        open={agentModalOpen}
        onCancel={() => setAgentModalOpen(false)}
        footer={null}
      >
        {agentList.map((item) => (
          <Card
            className="mb-3"
            key={item.id}
            hoverable
            onClick={() => {
              setNode(data.id, (old) => ({
                ...old,
                data: {
                  ...old.data,
                  name: item.nickname,
                  description: item.description,
                  config: {
                    ...(old.data.config as Record<string, any>),
                    inputs: {
                      ...old.data.config.inputs,
                      agent_param: [
                        ...old.data.config.inputs.agent_param.filter(
                          (p: BasicSchema) => p.name !== 'id',
                        ),
                        {
                          name: 'id',
                          type: 'string',
                          value: { type: 'value', content: item.id },
                        },
                      ],
                    },
                  },
                },
              }));
              setAgentModalOpen(false);
            }}
          >
            <Card.Meta
              avatar={
                <span className="magent-agent-avartar">
                  <AgentIcon shape="square" size={64} agent={item} />
                </span>
              }
              title={item.nickname}
              description={<span>{item.description}</span>}
            />
          </Card>
        ))}
      </Modal>
      <div>
        <ReferenceForm
          label="输入变量"
          nodes={[...(upstreamNodes as any)]}
          value={[...(data.config?.inputs?.input_param || [])]}
          onChange={(values) => {
            setNode(data.id, (old) => ({
              ...old,
              data: {
                ...old.data,
                config: {
                  ...(old.data.config as Record<string, any>),
                  inputs: {
                    ...old.data.config.inputs,
                    input_param: [...values],
                  },
                },
              },
            }));
          }}
        />
        <CollapseWrapper
          className="mt-3"
          label={'Prompt'}
          content={
            <div className="h-[200px] bg-white rounded-md cursor-pointer overflow-auto">
              <PromptEditor
                value={
                  (agentParam.find((item) => item.name === 'prompt')?.value
                    ?.content as string) || ''
                }
                placeholder="请输入 Prompt"
                onChange={(values: string) => {
                  setNode(data.id, (old) => ({
                    ...old,
                    data: {
                      ...old.data,
                      config: {
                        ...(old.data.config as Record<string, any>),
                        inputs: {
                          ...old.data.config.inputs,
                          agent_param: [
                            ...agentParam.filter((p) => p.name !== 'prompt'),
                            {
                              name: 'prompt',
                              type: 'string',
                              value: {
                                type: 'value',
                                content: values,
                              },
                            },
                          ],
                        },
                      },
                    },
                  }));
                }}
                variableBlock={{
                  show: true,
                  variables: data.config?.inputs?.input_param.map((input) => {
                    return {
                      name: input.name,
                      value: input.name,
                    };
                  }),
                }}
              />
            </div>
          }
        />
        <CollapseWrapper
          className="mt-3"
          label={'Output'}
          content={
            <>
              {(data.config?.outputs || []).map((output) => (
                <OutputVariable
                  key={output.name}
                  name={output.name}
                  type={output.type}
                />
              ))}
            </>
          }
        />
      </div>
    </NodeWrapper>
  );
};
