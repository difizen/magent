import { Button } from 'antd';

import { useFlowStore } from '@/stores/useFlowStore.js';
import { classNames } from '@/utils/basic.js';

export const Toolbar = (props: { classname?: string }) => {
  const { classname } = props;
  const { getFlow } = useFlowStore();
  return (
    <div className={classNames(classname || '', 'flex items-center gap-2')}>
      <Button>运行</Button>
      <Button
        type="primary"
        onClick={() => {
          const flow = getFlow();
          console.log('🚀 ~ Toolbar ~ flow:', flow);
        }}
      >
        保存
      </Button>
    </div>
  );
};
