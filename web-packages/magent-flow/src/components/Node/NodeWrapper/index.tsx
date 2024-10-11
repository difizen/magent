import { PopoverInNode } from '@flow/components/AIBasic/PopoverInNode/index.js';
import { Popup } from '@flow/components/AIBasic/Popup/index.js';
import { HoverBlock } from '@flow/components/FlowController/operator.js';
import type { NodeDataType, NodeType } from '@flow/interfaces/flow.js';
import { useFlowStore } from '@flow/stores/flowStore.js';
import classNames from '@flow/utils/classnames.js';
import {
  Ri24HoursFill,
  RiContractUpDownLine,
  RiExpandUpDownLine,
  RiMoreLine,
  RiPlayLargeLine,
  RiPlayLine,
} from '@remixicon/react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import React, { cloneElement } from 'react';

export type A = Node<{ a: 1 }, 'counter'>;

export const NodeWrapper = (props: {
  nodeProps: NodeType;
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
  folded?: boolean;
  className?: string;
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
    className,
  } = props;
  const { name: defaultName, description, icon: defaultIcon } = nodeProps.data;

  const handlerClasses = 'w-3 h-3 border-blue-500 rounded-full border-2 bg-white';

  const setNodeFolded = useFlowStore((state) => state.setNodeFolded);

  return (
    <div
      className={classNames(
        'relative flex flex-col border-2 justify-center rounded-xl bg-white shadow-lg p-5 hover:shadow-2xl',
        nodeProps.selected ? 'border-blue-500 shadow-2xl' : 'border-transparent',
        nodeProps.data.folded ? 'w-[320px]' : 'w-[520px]',
        className,
      )}
    >
      {extra ??
        (nodeProps.selected && (
          <div className="absolute right-0 -top-10 flex items-center text-gray-500 bg-white rounded-lg p-[2px]">
            <HoverBlock
              tooltip={
                <div className="text-[15px] font-semibold">
                  {nodeProps.data.folded ? '展开' : '折叠'}
                </div>
              }
              onClick={() =>
                setNodeFolded(
                  nodeProps.data.id,
                  nodeProps.data.folded === undefined ? true : !nodeProps.data.folded,
                )
              }
            >
              {nodeProps.data.folded ? (
                <RiExpandUpDownLine className="w-4" />
              ) : (
                <RiContractUpDownLine className="w-4" />
              )}
            </HoverBlock>
            <HoverBlock
              tooltip={<div className="text-[15px] font-semibold">测试节点</div>}
            >
              <RiPlayLargeLine className="w-4" />
            </HoverBlock>
            <PopoverInNode
              overlayInnerStyle={{ padding: 0 }}
              placement="bottomRight"
              trigger="hover"
              arrow={false}
              content={
                <div className="z-[9] p-1 bg-white rounded-lg shadow-sm border-[0.5px] border-gray-200 w-[126px]">
                  <div
                    className="flex items-center justify-between h-8 px-3 rounded-lg hover:bg-gray-50 cursor-pointer text-[13px] text-gray-600"
                    onClick={() => {}}
                  >
                    复制
                  </div>
                  <div className="flex items-center justify-between h-8 px-3 rounded-lg hover:bg-red-50 cursor-pointer text-[13px] text-gray-600 hover:text-red-600">
                    删除
                  </div>
                </div>
              }
            >
              <HoverBlock>
                <RiMoreLine />
              </HoverBlock>
            </PopoverInNode>
          </div>
        ))}
      {/* <NodeStatus status={'success' as any} runDuration={1020} /> */}
      <div className="flex w-full items-center justify-between gap-8 rounded-t-lg pb-2">
        <div className="flex items-center justify-between">
          {(defaultIcon || icon) && (
            <img src={icon ?? defaultIcon} className="h-8 rounded-xl shadow-md" />
          )}
          <div className="ml-2 truncate text-gray-700 font-medium">
            {name ?? defaultName}
          </div>
        </div>
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
      {!nodeProps.data.folded && <div className="">{children}</div>}
    </div>
  );
};
