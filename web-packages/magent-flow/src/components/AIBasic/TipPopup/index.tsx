import { Tooltip } from 'antd';
import React from 'react';

export const TipPopup = (props: { title: React.ReactNode; children: any }) => {
  const { title, children } = props;

  if (title === null) {
    return children;
  }

  return (
    <Tooltip
      color="#fff"
      title={<div className="text-gray-600 text-[13px]">{title}</div>}
      arrow={false}
      getTooltipContainer={(trigger) => trigger.parentElement!}
    >
      {children}
    </Tooltip>
  );
};
