import type { NodeDataType } from '@flow/interfaces/flow.js';
import { Input } from 'antd';
import React from 'react';

interface NodesPanelProps {
  /**
   * @title 模板节点配置
   */
  className?: string;
  nodes: NodeDataType[];
  // allowfold?: boolean;
  allowSearch?: boolean;
  // grouped?: boolean;
}

export const NodesPanel = (props: NodesPanelProps) => {
  const { nodes, allowSearch = false, className = '' } = props;

  function onDragStart(
    event: React.DragEvent<any>,
    data: { type: string; node?: NodeDataType },
  ): void {
    //start drag event
    // eslint-disable-next-line no-var
    var crt = event.currentTarget.cloneNode(true);

    crt.style.position = 'absolute';
    crt.style.top = '-500px';
    crt.style.right = '-500px';
    crt.classList.add('cursor-grabbing');
    document.body.appendChild(crt);
    event.dataTransfer.setDragImage(crt, 0, 0);
    event.dataTransfer.setData('nodedata', JSON.stringify(data));
  }

  return (
    <div className={className}>
      {allowSearch && (
        <Input.Search
          placeholder="Search"
          onChange={(e) => {
            nodes.filter((node) => node.name?.includes(e.target.value));
          }}
        />
      )}
      {nodes.sort().map((node) => (
        <div
          className="m-3 p-2 bg-white rounded-xl cursor-pointer flex items-center shadow-card hover:shadow-card-lg"
          key={node.id}
          draggable
          onDragStart={(event) =>
            onDragStart(event, {
              type: node.type,
              node: node,
            })
          }
          onDragEnd={() => {
            document.body.removeChild(
              document.getElementsByClassName('cursor-grabbing')[0],
            );
          }}
        >
          {node.icon && <img src={node.icon} className="h-8 rounded p-1" />}
          <div className="ml-3 font-semibold">{node.name}</div>
        </div>
      ))}
      <></>
    </div>
  );
};
