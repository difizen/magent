import { Handle, Position } from '@xyflow/react';
import { Space } from 'antd';
import React from 'react';

import type { NodeDataType } from '@/interfaces/flow.js';
import { classNames } from '@/utils/index.js';

type Props = {
  data: NodeDataType;
  selected: boolean;
  xPos: number;
  yPos: number;
};

export const NodeWrapper = (props: {
  nodeProps: Props;
  children: React.ReactNode;
  leftHandler?: boolean;
  rightHandler?: boolean;
  rightHandlerConfig?: {
    id: string;
    style: Record<string, any>;
  }[];
}) => {
  const {
    nodeProps,
    children,
    leftHandler = true,
    rightHandler = true,
    rightHandlerConfig,
  } = props;
  const { name, description, icon } = nodeProps.data;

  return (
    <div
      className={classNames(
        'relative flex flex-col justify-center rounded-xl bg-white border-4',
        nodeProps.selected ? 'border-sky-500' : '',
      )}
    >
      {/* <NodeStatus status={'success' as any} runDuration={1020} /> */}
      <div className="flex w-full items-center justify-between gap-8 rounded-t-lg bg-muted px-3 py-2">
        <Space className="text-lg">
          {icon && <img src={icon} className="h-10 rounded p-1" />}
          <div className="ml-2 truncate text-gray-800">{name}</div>
        </Space>
      </div>
      {leftHandler && (
        <Handle
          type="source"
          position={Position.Left}
          style={{ borderColor: 'rgb(59 130 246)' }}
          className={classNames('-ml-0.5 ', 'w-3 h-3 rounded-full border-2 bg-white')}
        />
      )}
      {rightHandler &&
        (rightHandlerConfig ? (
          <>
            {rightHandlerConfig.map((item) => (
              <Handle
                key={item.id}
                id={item.id}
                type="target"
                position={Position.Right}
                style={{ borderColor: 'rgb(59 130 246)', ...item.style }}
                className={classNames(
                  '-mr-0.5 ',
                  'w-3 h-3 rounded-full border-2 bg-white',
                )}
              />
            ))}
          </>
        ) : (
          <Handle
            type="target"
            position={Position.Right}
            style={{ borderColor: 'rgb(59 130 246)' }}
            className={classNames('-mr-0.5 ', 'w-3 h-3 rounded-full border-2 bg-white')}
          />
        ))}

      <div className="h-full w-full text-gray-400 pb-1">
        <div className="w-full px-5 pb-2 text-sm">{description}</div>
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
};
