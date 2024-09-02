import { CollapseWrapper } from '@flow/components/AIBasic/CollapseWrapper/index.js';
import { PromptEditor } from '@flow/components/AIBasic/PromptEditor/index.js';
import { ReferenceForm } from '@flow/components/ReferenceForm/index.js';
import type { BasicSchema, NodeDataType } from '@flow/interfaces/flow.js';
import { useFlowStore } from '@flow/stores/useFlowStore.js';

import { NodeWrapper } from '../NodeWrapper/index.js';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const EndNode = (props: Props) => {
  const { data } = props;
  const { findUpstreamNodes, setNode } = useFlowStore();
  const upstreamNodes = findUpstreamNodes(data.id.toString());

  return (
    <NodeWrapper nodeProps={props} rightHandler={false}>
      <ReferenceForm
        label="输入变量"
        dynamic={true}
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
        label={'Output'}
        content={
          <>
            <div className="h-[200px] bg-white rounded-md cursor-pointer overflow-auto">
              <PromptEditor
                value={
                  ((data.config?.inputs?.prompt as BasicSchema).value
                    ?.content as string) || ''
                }
                placeholder="请输入 Prompt"
                onChange={(values) => {
                  setNode(data.id, (old) => ({
                    ...old,
                    data: {
                      ...old.data,
                      config: {
                        ...(old.data.config as Record<string, any>),
                        inputs: {
                          ...old.data.config.inputs,
                          prompt: {
                            ...old.data.config.inputs.prompt,
                            value: {
                              type: 'value',
                              content: values,
                            },
                          },
                        },
                      },
                    },
                  }));
                }}
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
          </>
        }
      ></CollapseWrapper>
    </NodeWrapper>
  );
};
