import yaml from 'js-yaml';

import { EventEmitterContextProvider } from '@/context/event-emitter.js';
import type { NodeDataType } from '@/interfaces/flow.js';
import { NodeTypeEnum } from '@/interfaces/flow.js';

import Flow from '../Flow/index.js';
import { AgentNode } from '../Node/AgentNode/index.js';
import { EndNode } from '../Node/EndNode/index.js';
import { IfElseNode } from '../Node/IfElseNode/index.js';
import { KnowledgeNode } from '../Node/KnowledgeNode/index.js';
import { LLMNode } from '../Node/LLMNode/index.js';
import { StartNode } from '../Node/StartNode/index.js';
import { NodesPanel } from '../NodePanel/index.js';

const yamlContent = `
- id: 1
  name: 开始节点
  description: 工作流的起始节点，用于设定启动工作流需要的信息
  type: start
  data:
    outputs:
      - name: user_input
        type: string
        description: 用户本轮对话输入内容
- id: 2
  position:
    x: 200
    y: 100
  name: 结束节点
  description: 工作流的最终节点，用于返回工作流运行后的结果信息
  type: end
  data:
    inputs:
      input_param:
        - name: response
          type: string
          value:
            type: reference
      prompt:
        name: response
        type: string
        description: 输出内容
        value:
          type: reference
          content: '{{response}}'
    outputs:
      - name: output
        type: string
- id: 3
  name: 大模型节点
  description: 调用大语言模型,使用变量和提示词生成回复
  type: llm
  data:
    inputs:
      input_param:
        - name: input
          description:
          type: string
          value:
            type: reference
        - name: background
          description:
          type: string
          value:
            type: reference
      llm_param:
        - type: string
          name: id
          value:
            type: value
            content: qwen_llm
        - type: string
          name: model_name
          value:
            content: qwen-max
            type: value
        - type: string
          name: temperature
          value:
            content: '0.7'
            type: value
        - type: string
          name: prompt
          value:
            type: value
            content: |
              你是一位精通信息分析的ai助手。你的目标是使用中文结合查询的背景信息及你所拥有的知识回答用户提出的问题。
              你需要遵守的规则是:
              1. 必须使用中文结合查询的背景信息结合你所拥有的知识回答用户提出的问题。
              2. 结构化答案生成，必要时通过空行提升阅读体验。
              3. 不采用背景信息中的错误信息。
              4. 要考虑答案和问题的相关性，不做对问题没有帮助的回答。
              5. 详尽回答问题，重点突出，不过多花哨词藻。
              6. 不说模糊的推测。
              7. 尽量多的使用数值类信息。

              背景信息是:
              {{background}}

              开始!
              需要回答的问题是: {{input}}
    outputs:
      - type: string
        name: output
- id: 4
  name: 知识库
  description:
  type: knowledge
  data:
    inputs:
      knowledge_param:
        - type: string
          name: id
        - type: string
          name: top_k
          value:
            type: value
            content: '2'
      input_param:
        - type: string
          name: query # 自然语言的知识库query
          value:
            type: reference
    outputs:
      - name: output
        type: string
- id: 5
  name: 工具
  description:
  type: tool
  position:
    x: 500
    y: 100
  data:
    inputs:
      tool_param:
        - type: string
          name: id
          value: google_search
      input_param:
        - type: string
          name: input
          value:
            type: value
            content: 'output'
    outputs:
      - name: output
        type: string
- id: 6
  name: Agent智能体
  description:
  type: agent
  data:
    inputs:
      agent_param:
        - type: string
          name: id
          value: demo_rag_agent
      input_param:
        - type: string
          name: input
          value:
            type: reference

    outputs:
      - name: output
        type: string
- id: 7
  name: 条件判断
  description:
  type: ifelse
  data:
    inputs:
      branches:
        - name: branch-1
          conditions:
            - compare: equal
              left:
                type: string
                value:
                  type: reference
              right: # blank 没有right
                type: string # 只有 if 和 else，branch-1和branch-default
                value:
                  type: reference
`;

export const NodeSchemaParser = (obj: Record<string, any>) => {
  obj['config'] = obj['data'];
  obj['icon'] =
    'https://mdn.alipayobjects.com/huamei_xbkogb/afts/img/A*PzmdRpvZz58AAAAAAAAAAAAADqarAQ/original';

  delete obj['data'];
};

const nodeTypes = {
  [NodeTypeEnum.Start]: StartNode,
  [NodeTypeEnum.End]: EndNode,
  [NodeTypeEnum.LLM]: LLMNode,
  [NodeTypeEnum.Knowledge]: KnowledgeNode,
  [NodeTypeEnum.IfElse]: IfElseNode,
  [NodeTypeEnum.Tool]: IfElseNode,
  [NodeTypeEnum.Agent]: AgentNode,
};

export const FlowWithPanel = (props: { toolbar?: React.ReactNode }) => {
  const { toolbar } = props;
  const yaml_data = yaml.load(yamlContent);
  (yaml_data as Record<string, any>[]).forEach((item) => {
    NodeSchemaParser(item);
  });

  // const setNodes = useFlowStore((state) => state.setNodes);
  // const reactFlowInstance = useFlowStore((state) => state.reactFlowInstance);

  // useEffect(() => {
  //   const add = (yaml_data as any).map((node: any) => {
  //     return {
  //       id: node.id,
  //       type: node.type,
  //       position: node.position,
  //       data: node,
  //     };
  //   });

  //   setNodes(add);
  // }, [reactFlowInstance]);

  return (
    <EventEmitterContextProvider>
      <div className="flex flex-1">
        <NodesPanel className="w-[200px]" nodes={yaml_data as NodeDataType[]} />
        <Flow classNames="flex-1" nodeTypes={nodeTypes} toolbar={toolbar} />
      </div>
    </EventEmitterContextProvider>
  );
};
