import { useFlowStore } from '@difizen/magent-flow';
import { Button } from 'antd';
import classNames from 'classnames';
import yaml from 'js-yaml';
import React from 'react';

export const Toolbar = (props: { classname?: string; style?: React.CSSProperties }) => {
  const { classname, style } = props;
  const { getFlow } = useFlowStore();
  return (
    <div
      style={style}
      className={classNames(classname || '', 'flex items-center gap-2')}
    >
      <Button>运行</Button>
      <Button
        type="primary"
        onClick={() => {
          const flow = getFlow();
          const save_yaml = yaml.dump(flow);
          console.log('🚀 ~ Toolbar ~ flow:', save_yaml);
        }}
      >
        保存
      </Button>
    </div>
  );
};
