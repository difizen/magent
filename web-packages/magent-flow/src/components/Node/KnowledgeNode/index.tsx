import { CollapseWrapper } from '../../../components/AIBasic/CollapseWrapper/index.js';
import { OutputVariable } from '../../../components/AIBasic/OutputVariableTree/OutputVariable/index.js';
import { ReferenceForm } from '../../../components/ReferenceForm/index.js';
import type { BasicSchema, NodeDataType } from '../../../interfaces/flow.js';
import { useFlowStore } from '../../../stores/useFlowStore.js';
import { useKnowledgeStore } from '../../../stores/useKnowledgeStore.js';
import { NodeWrapper } from '../NodeWrapper/index.js';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const KnowledgeNode = (props: Props) => {
  const { data } = props;
  // const { config } = data;
  const { findUpstreamNodes, setNode } = useFlowStore();

  const { KnowledgeSelector } = useKnowledgeStore();
  const upstreamNode = findUpstreamNodes(data.id.toString());

  const knowledge_param = data.config?.inputs?.['knowledge_param'] as BasicSchema[];

  return (
    <NodeWrapper nodeProps={props}>
      <div>
        <ReferenceForm
          label="输入变量"
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
        <CollapseWrapper
          className="mt-3"
          label={'知识库配置'}
          content={
            <>
              {KnowledgeSelector !== null ? (
                <KnowledgeSelector nodeId={data.id} knowledgeParam={knowledge_param} />
              ) : (
                <>知识库配置</>
              )}
            </>
          }
        />
        <CollapseWrapper
          className="mt-3"
          label={'Output'}
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
