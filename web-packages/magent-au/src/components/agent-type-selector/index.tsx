import type { RadioGroupProps } from 'antd';
import { Avatar } from 'antd';
import { Radio } from 'antd';

import ragIcon from './rag.svg.js';
import reactIcon from './react.svg.js';
import workflowIcon from './workflow.svg.js';
import './index.less.js';

export const AgentTypeSelector = (props: RadioGroupProps) => {
  const options = [
    {
      label: (
        <div className="magent-agent-type-selector-label">
          <Avatar shape="square" src={ragIcon} />
          RAG
        </div>
      ),
      value: 'rag_planner',
    },
    {
      label: (
        <div className="magent-agent-type-selector-label">
          <Avatar shape="square" src={reactIcon} />
          ReAct
        </div>
      ),
      value: 'react_planner',
    },
    {
      label: (
        <div className="magent-agent-type-selector-label">
          <Avatar shape="square" src={workflowIcon} />
          Workflow
        </div>
      ),
      value: 'workflow_planner',
    },
  ];

  return (
    <Radio.Group
      className="magent-agent-type-selector"
      {...props}
      optionType="button"
      options={options}
    />
  );
};
