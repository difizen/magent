import { Flex, Space } from 'antd';
import React, { useState } from 'react';
import './index.less';
import { DeleteOutlined, DeleteTwoTone } from '@ant-design/icons';

const clsPrefix = 'skill-item';

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

export const SkillItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const [showAct, setShowAct] = useState(false);

  return (
    <Flex
      className={`${clsPrefix} ${showAct ? `${clsPrefix}-show-act` : ''}`}
      align="center"
      justify="start"
      onMouseEnter={() => setShowAct(true)}
      onMouseLeave={() => setShowAct(false)}
    >
      <div className={`${clsPrefix}-icon`}>{icon}</div>
      <Flex vertical flex={1}>
        <div className={`${clsPrefix}-title`}>{title}</div>
        <div className={`${clsPrefix}-description`}>{description}</div>
      </Flex>

      {showAct && (
        <Space className={`${clsPrefix}-act`}>
          <IconBox icon={<DeleteOutlined />}></IconBox>
          <IconBox icon={<DeleteOutlined />}></IconBox>
          <IconBox icon={<DeleteOutlined />}></IconBox>
        </Space>
      )}
    </Flex>
  );
};
