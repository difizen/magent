import { MessageOutlined, SaveOutlined } from '@ant-design/icons';
import type { NodeType } from '@difizen/magent-flow';
import { useFlowStore } from '@difizen/magent-flow';
import { useInject } from '@difizen/mana-app';
import { Button, message } from 'antd';
import classNames from 'classnames';
import yaml from 'js-yaml';
import React from 'react';

import { AgentFlowDevView } from './flow-dev-view.js';
import { OutputEdgeParser, OutputNodeParser } from './flow-utils.js';

export const Toolbar = (props: { classname?: string; style?: React.CSSProperties }) => {
  const { classname, style } = props;
  const { getFlow } = useFlowStore();
  const flowDevView = useInject(AgentFlowDevView);

  return (
    <div
      style={style}
      className={classNames(
        'magent-agent-flow-tool',
        classname || '',
        'flex items-center gap-2',
      )}
    >
      {flowDevView.hideChat && (
        <Button
          onClick={() => (flowDevView.hideChat = false)}
          icon={<MessageOutlined />}
        >
          运行
        </Button>
      )}
      <Button
        type="primary"
        icon={<SaveOutlined />}
        onClick={() => {
          const flow = JSON.parse(JSON.stringify(getFlow()));
          const nodes = flow.nodes.map((node) => {
            return OutputNodeParser(node as NodeType);
          });
          const edges = flow.edges.map((edge) => {
            return OutputEdgeParser(edge);
          });
          const graph = {
            nodes,
            edges,
          };

          const graph_yaml = yaml.dump(graph);
          localStorage.setItem('magent_flow_testdata', graph_yaml);
          message.success('保存成功');
        }}
      >
        保存
      </Button>
    </div>
  );
};
