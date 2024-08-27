import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';

import { CollapseWrapper } from '@/components/AIBasic/CollapseWrapper/index.js';
import { OutputVariable } from '@/components/AIBasic/OutputVariableTree/OutputVariable/index.js';
import { ReferenceForm } from '@/components/ReferenceForm/index.js';
import type { NodeDataType } from '@/interfaces/flow.js';
import { useFlowStore } from '@/stores/useFlowStore.js';
import { useKnowledgeStore } from '@/stores/useKnowledgeStore.js';

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
  const { findUpstreamNodes } = useFlowStore();

  const { knowledges } = useKnowledgeStore();
  const upstreamNode = findUpstreamNodes(data.id.toString());

  return (
    <NodeWrapper nodeProps={props}>
      <div>
        <ReferenceForm
          label="输入变量"
          nodes={[...(upstreamNode as any)]}
          values={[...(data.config?.inputs?.input_param || [])]}
          onChange={(values) => {
            console.log('ReferenceForm', values);
          }}
        />
        <CollapseWrapper
          className="mt-3"
          label={
            <div className="flex items-center">
              <div>知识库配置</div>
              <Button
                size="small"
                type="link"
                icon={<PlusOutlined />}
                className="ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  Modal.confirm({
                    title: '导入知识库',
                    icon: null,
                    content: <></>,
                    onOk: () => {
                      console.log('knowledges', knowledges);
                    },
                  });
                }}
              >
                导入
              </Button>
            </div>
          }
          content={<>List</>}
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
