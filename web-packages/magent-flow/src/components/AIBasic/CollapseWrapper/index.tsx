import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import type { ReactNode } from 'react';

export const CollapseWrapper = (props: {
  label: string;
  children: ReactNode;
  className?: string;
}) => {
  const { label, children, className } = props;
  return (
    <Collapse
      className={className}
      bordered={false}
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={[
        {
          key: '1',
          label: label,
          children: children,
        },
      ]}
    />
  );
};
