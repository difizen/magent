import { EllipsisOutlined, PlayCircleFilled } from '@ant-design/icons';
import React from 'react';

export const NodeHeader = (props: { icon: React.JSX.Element; name: string }) => {
  const { icon, name } = props;
  return (
    <div className="flex items-center justify-between p-3 text-xs">
      <div className="flex items-center gap-1">
        {icon}
        <div> {name}</div>
      </div>
      <div className="flex gap-2 items-center text-gray-400">
        <PlayCircleFilled className="cursor-pointer" />
        <EllipsisOutlined className="cursor-pointer" />
      </div>
    </div>
  );
};
