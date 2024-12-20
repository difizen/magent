import { BarsOutlined } from '@ant-design/icons';
import { Button, InputNumber, Popover } from 'antd';

import { CollapseWrapper } from '../../../components/AIBasic/CollapseWrapper/index.js';
import { OutputVariable } from '../../../components/AIBasic/OutputVariableTree/OutputVariable/index.js';
import { PromptEditor } from '../../../components/AIBasic/PromptEditor/index.js';
import { SelectInNode } from '../../../components/AIBasic/SelectInNode/index.js';
import { ReferenceForm } from '../../../components/ReferenceForm/index.js';
import type { BasicSchema, NodeDataType } from '../../../interfaces/flow.js';
import { useFlowStore } from '../../../stores/useFlowStore.js';
import { useModelStore } from '../../../stores/useModelStore.js';
import { NodeWrapper } from '../NodeWrapper/index.js';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const LLMNode = (props: Props) => {
  const { data } = props;

  const { findUpstreamNodes, setNode } = useFlowStore();
  const { ModelSelector, modelOptions, modelConfig } = useModelStore();

  const upstreamNode = findUpstreamNodes(data.id.toString());

  const llmParam = data.config?.inputs?.['llm_param'] as BasicSchema[];

  return (
    <NodeWrapper nodeProps={props}>
      <div className="nodrag">
        {/* Part1 model selector & model config */}
        <CollapseWrapper
          className="mb-3"
          label={'模型配置'}
          content={
            ModelSelector !== null ? (
              <ModelSelector nodeId={data.id} llmParam={llmParam} />
            ) : (
              <div className="flex">
                <SelectInNode
                  options={modelOptions.map((model) => ({
                    label: model.name,
                    value: model.id,
                  }))}
                  className="w-full mr-2"
                />
                <Popover
                  title="模型配置"
                  content={
                    <div>
                      {Object.entries(modelConfig).map(([key, value]) => (
                        <>
                          {key} <InputNumber key={value} />
                        </>
                      ))}
                    </div>
                  }
                >
                  {Object.entries(modelConfig).length > 0 && (
                    <Button type="text" icon={<BarsOutlined />}></Button>
                  )}
                </Popover>
              </div>
            )
          }
        />
        {/* Part2 Ref Form */}
        <ReferenceForm
          label="输入变量"
          dynamic
          nodes={[...(upstreamNode as any)]}
          value={[...(data.config?.inputs?.input_param || [])]}
          onChange={(values) => {
            setNode(data.id, (old) => ({
              ...old,
              data: {
                ...old.data,
                config: {
                  ...(old.data['config'] as Record<string, any>),
                  inputs: {
                    ...(old.data['config'] as Record<string, any>)['inputs'],
                    input_param: [...values],
                  },
                },
              },
            }));
          }}
        />
        {/* Part3 PromptEditor */}
        <CollapseWrapper
          className="mt-3"
          label={'Prompt'}
          content={
            <div className="h-[200px] bg-white rounded-md cursor-pointer nodrag p-3 overflow-y-auto">
              <PromptEditor
                value={
                  (llmParam.find((item) => item.name === 'prompt')?.value
                    ?.content as string) || ''
                }
                placeholder="请输入 Prompt"
                onChange={(values) => {
                  setNode(data.id, (old) => ({
                    ...old,
                    data: {
                      ...old.data,
                      config: {
                        ...(old.data['config'] as Record<string, any>),
                        inputs: {
                          ...(old.data['config'] as Record<string, any>)['inputs'],
                          llm_param: [
                            ...llmParam.filter((p) => p.name !== 'prompt'),
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
        {/* Part4 Outputer */}
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
