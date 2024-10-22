import { DeleteOutlined } from '@ant-design/icons';
import { Flex, Space } from 'antd';
import React, { useState } from 'react';
import './index.less';

const clsPrefix = 'card-item';

const IconBox = ({ icon }: { icon: React.ReactNode }) => {
  const [focus, setFocus] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setFocus(true);
      }}
      onMouseLeave={() => {
        setFocus(false);
      }}
      className={`${clsPrefix}-icon-box ${focus ? 'focus' : ''}`}
    >
      {icon}
    </div>
  );
};

export const SelectedItem = ({
  icon,
  title,
  description,
  onDelete,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onDelete?: () => void;
}) => {
  const [showAct, setShowAct] = useState(false);

  return (
    <Flex
      className={`${clsPrefix} ${showAct ? `${clsPrefix}-show-action` : ''}`}
      align="center"
      justify="start"
      onMouseEnter={() => setShowAct(true)}
      onMouseLeave={() => setShowAct(false)}
    >
      <div className={`${clsPrefix}-icon`}>{icon}</div>
      <Flex className={`${clsPrefix}-content`} vertical flex={1}>
        <div className={`ellipsis ${clsPrefix}-title`}>{title}</div>
        <div className={`ellipsis2Line ${clsPrefix}-description`}>{description}</div>
      </Flex>

      <Space className={`${clsPrefix}-action`}>
        {showAct && (
          <IconBox
            icon={
              <DeleteOutlined
                onClick={() => {
                  onDelete?.();
                }}
              />
            }
          ></IconBox>
        )}
      </Space>
    </Flex>
  );
};
