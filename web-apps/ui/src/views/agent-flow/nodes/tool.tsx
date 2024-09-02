import type { BasicSchema, NodeDataType } from '@difizen/magent-flow';
import {
  useFlowStore,
  NodeWrapper,
  ReferenceForm,
  CollapseWrapper,
  OutputVariable,
} from '@difizen/magent-flow';
import { useInject } from '@difizen/mana-app';
import { useState } from 'react';

import { ToolSpace } from '@/modules/tool/tool-space.js';
import { ToolsModal, ToolsModalComponent } from '@/modules/tool/tools-modal/modal.js';

import { TransferButton } from './transfer-button.js';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const ToolNode = (props: Props) => {
  const { data } = props;
  const toolSpace = useInject(ToolSpace);

  const [toolModalOpen, setToolModalOpen] = useState<boolean>(false);
  const { findUpstreamNodes, setNode } = useFlowStore();
  const upstreamNodes = findUpstreamNodes(data.id.toString());
  const toolParam = data.config?.inputs?.tool_param as BasicSchema[];
  const toolMeta = toolSpace.list
    .find((t) => t.id === toolParam.find((tool) => tool.name === 'id')?.value?.content)
    ?.toMeta();

  return (
    <NodeWrapper
      nodeProps={props}
      icon={toolMeta?.avatar}
      extra={
        <TransferButton onClick={() => setToolModalOpen(true)}>选择工具</TransferButton>
      }
    >
      <ToolsModalComponent
        visible={toolModalOpen}
        close={() => setToolModalOpen(false)}
        data={{
          expandAll: true,
          dataProvider: {
            tool: [
              {
                id: toolParam.find((p) => p.name === 'id')?.value?.content as string,
              } as any,
            ],
          },
          rowSelectionType: 'radio',
          onChange: (val) => {
            setNode(data.id, (old) => ({
              ...old,
              data: {
                ...old.data,
                name: val[0].nickname,
                description: val[0].description,
                config: {
                  ...(old.data.config as Record<string, any>),
                  inputs: {
                    ...old.data.config.inputs,
                    tool_param: [
                      {
                        name: 'id',
                        type: 'string',
                        value: {
                          content: val[0].id,
                        },
                      },
                    ],
                    input_param: val[0].parameters.map((p) => {
                      return {
                        name: p,
                        type: 'string',
                        value: {
                          type: 'reference',
                        },
                      };
                    }),
                  },
                },
              },
            }));

            setToolModalOpen(false);
          },
        }}
        modalItem={ToolsModal}
      />
      <div>
        {data.config?.inputs?.input_param && (
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
        )}

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
