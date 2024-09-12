import type { BasicSchema, NodeDataType } from '@difizen/magent-flow';
import {
  useFlowStore,
  NodeWrapper,
  ReferenceForm,
  CollapseWrapper,
  OutputVariable,
} from '@difizen/magent-flow';
import { useInject } from '@difizen/mana-app';
import { useCallback, useState } from 'react';

import { PluginManager } from '@/modules/plugin/plugin-manager.js';
import type { ToolMeta } from '@/modules/tool/protocol.js';
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
  const pluginManager = useInject(PluginManager);

  const [toolModalOpen, setToolModalOpen] = useState<boolean>(false);
  const { findUpstreamNodes, setNode } = useFlowStore();
  const upstreamNodes = findUpstreamNodes(data.id.toString());
  const toolParam = data.config?.inputs?.['tool_param'] as BasicSchema[];

  const setTool = useCallback(
    (v: ToolMeta) => {
      setNode(data.id, (old) => ({
        ...old,
        data: {
          ...old.data,
          name: v.nickname,
          description: v.description,
          config: {
            ...(old.data['config'] as Record<string, any>),
            inputs: {
              ...(old.data['config'] as Record<string, any>)['inputs'],
              tool_param: [
                {
                  name: 'id',
                  type: 'string',
                  value: {
                    content: v.id,
                  },
                },
              ],
              input_param: v.parameters.map((p) => {
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
    },
    [data.id, setNode],
  );

  const toolMeta = pluginManager.publicList
    .map((plugin) => plugin.toolset)
    .flat()
    .find((pluginTool) => {
      const param = toolParam.find((tool) => tool.name === 'id');
      if (!param || !param.value) {
        return false;
      }
      let paramValue = param.value as unknown as string;
      if (typeof param.value === 'string') {
        paramValue = param.value;
      }
      if (typeof param.value.content === 'string') {
        paramValue = param.value.content;
      }
      return pluginTool.id === paramValue;
    })
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
                id: toolMeta?.id,
              } as any,
            ],
          },
          rowSelectionType: 'radio',
          onChange: (val) => {
            const v = val[0];
            setTool(v);
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
