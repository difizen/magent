import { Handle, Position } from '@xyflow/react';
import React from 'react';

import type { NodeDataType } from '../../../interfaces/flow.js';
import { classNames } from '../../../utils/index.js';

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
  icon?: string;
  name?: string | React.ReactNode;
  extra?: React.ReactNode;
}) => {
  const {
    nodeProps,
    children,
    leftHandler = true,
    rightHandler = true,
    rightHandlerConfig,
    icon,
    name,
    extra,
  } = props;
  const { name: defaultName, description, icon: defaultIcon } = nodeProps.data;

  const handlerClasses = 'w-3 h-3 border-blue-500 rounded-full border-2 bg-white';
  return (
    <div
      className={classNames(
        'relative flex flex-col border-2 justify-center rounded-xl bg-white shadow-lg p-5 w-[520px] hover:shadow-2xl',
        nodeProps.selected ? 'border-blue-500 shadow-2xl' : 'border-transparent',
      )}
    >
      {/* <NodeStatus status={'success' as any} runDuration={1020} /> */}
      <div className="flex w-full items-center justify-between gap-8 rounded-t-lg bg-muted pb-2">
        <div className="flex items-center">
          {(defaultIcon || icon) && (
            <img src={icon ?? defaultIcon} className="h-10 rounded p-1" />
          )}
          <div className="ml-2 truncate text-gray-800">{name ?? defaultName}</div>
        </div>
        {extra}
      </div>
      {leftHandler && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ borderColor: 'rgb(59 130 246)' }}
          className={classNames('-ml-0.5 ', handlerClasses)}
        />
      )}
      {rightHandler &&
        (rightHandlerConfig ? (
          <>
            {rightHandlerConfig.map((item) => (
              <Handle
                key={item.id}
                id={item.id}
                type="source"
                position={Position.Right}
                style={{ borderColor: 'rgb(59 130 246)', ...item.style }}
                className={classNames('-mr-0.5 ', handlerClasses)}
              />
            ))}
          </>
        ) : (
          <Handle
            type="source"
            position={Position.Right}
            style={{ borderColor: 'rgb(59 130 246)' }}
            className={classNames('-mr-0.5 ', handlerClasses)}
          />
        ))}

      {description && (
        <div className="h-full w-full text-gray-400 pb-1">
          <div className="w-full pb-2 text-sm truncate">{description}</div>
        </div>
      )}
      <div className="">{children}</div>
    </div>
  );
};
