import { BarsOutlined } from '@ant-design/icons';
import { Button, InputNumber, Popover } from 'antd';
import { useState } from 'react';

import { CollapseWrapper } from '@/components/AIBasic/CollapseWrapper/index.js';
import { OutputVariable } from '@/components/AIBasic/OutputVariableTree/OutputVariable/index.js';
import PromptEditor from '@/components/AIBasic/PromptEditor/index.js';
import { SelectInNode } from '@/components/AIBasic/SelectInNode/index.js';
import { ReferenceForm } from '@/components/ReferenceForm/index.js';
import type { NodeDataType } from '@/interfaces/flow.js';
import { useFlowStore } from '@/stores/useFlowStore.js';
import { useModelStore } from '@/stores/useModelStore.js';

import { NodeWrapper } from '../NodeWrapper/index.js';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const LLMNode = (props: Props) => {
  const { data } = props;
  // console.log('🚀 ~ LLMNode ~ data:', data);
  // const { config } = data;

  const { findUpstreamNodes } = useFlowStore();
  const upstreamNode = findUpstreamNodes(data.id.toString());

  const { models, modelConfig } = useModelStore();

  const [value, setValue] = useState<string>('hello');
  return (
    <NodeWrapper nodeProps={props}>
      <div className="nodrag">
        {/* Part1 model selector & model config */}
        <CollapseWrapper
          className="mb-3"
          label={'模型配置'}
          content={
            <div className="flex">
              <SelectInNode
                options={models.map((model) => ({
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
          }
        />
        {/* Part2 Ref Form */}

        <ReferenceForm
          label="输入变量"
          dynamic
          nodes={[...(upstreamNode as any)]}
          values={[...(data.config?.inputs?.input_param || [])]}
          onChange={(values) => {
            console.log('ReferenceForm', values);
          }}
        />
        {/* Part3 PromptEditor */}
        <CollapseWrapper
          className="mt-3"
          label={'Prompt'}
          content={
            <div className="h-[200px] bg-white rounded-md cursor-pointer">
              <PromptEditor
                value={value}
                placeholder="请输入 Prompt"
                onChange={(val) => setValue(val)}
                variableBlock={{
                  show: true,
                  variables: data.config?.inputs?.input_param.map((input) => {
                    return {
                      name: input.name!,
                      value: input.name!,
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
          label={'Prompt'}
          content={
            <>
              {(data.config?.outputs || []).map((output) => (
                <OutputVariable
                  key={output.name!}
                  name={output.name!}
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
