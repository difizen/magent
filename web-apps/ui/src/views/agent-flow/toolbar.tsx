import { MessageOutlined, SaveOutlined } from '@ant-design/icons';
import { useFlowStore } from '@difizen/magent-flow';
import { useInject } from '@difizen/mana-app';
import { Button } from 'antd';
import classNames from 'classnames';
import yaml from 'js-yaml';
import React from 'react';

import { AgentFlowDevView } from './flow-dev-view.js';

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
          const flow = getFlow();
          const save_yaml = yaml.dump(flow);
          // console.log('🚀 ~ Toolbar ~ flow:', save_yaml);
        }}
      >
        保存
      </Button>
    </div>
  );
};
