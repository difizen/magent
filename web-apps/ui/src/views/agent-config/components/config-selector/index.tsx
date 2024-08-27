import { PlusOutlined } from '@ant-design/icons';
import { Collapse, Space } from 'antd';
import type { ReactNode } from 'react';

import { SelectedItem } from '../item-crad/index.js';

import './index.less';

export interface ConfigSelectOption {
  id: string;
  nickname: string;
  description: string;
  icon: ReactNode;
}
export interface ConfigSelector {
  key: string;
  title: string;
  options: ConfigSelectOption[];
  onAdd: () => void;
  onDelete: (item: ConfigSelectOption) => void;
}

export interface ConfigListProps {
  selector: ConfigSelector[];
}

const clsPrefix = 'config-list';

export const ConfigList = ({ selector }: ConfigListProps) => {
  const list = selector.map((item) => {
    return {
      key: item.key,
      label: item.title,
      extra: (
        <div className={`${clsPrefix}-card-add`}>
          <PlusOutlined
            onClick={(e) => {
              e.stopPropagation();
              item.onAdd();
            }}
          />
        </div>
      ),
      children: (
        <>
          {item.options.map((option) => {
            return (
              <SelectedItem
                onDelete={() => {
                  item.onDelete(option);
                }}
                key={option.id}
                icon={option.icon}
                title={option.nickname || '-'}
                description={option.description || '-'}
              ></SelectedItem>
            );
          })}
        </>
      ),
      style: {
        padding: 0,
      },
    };
  });

  return (
    <div className={`${clsPrefix}-container`}>
      <Space direction="vertical" size={'large'} style={{ display: 'flex' }}>
        <div className={`${clsPrefix}-card`}>
          <div className={`${clsPrefix}-card-title`}>技能</div>
          <Collapse
            style={{ padding: 0 }}
            defaultActiveKey={['knowledge', 'tool']}
            ghost
            items={list}
          />
        </div>
      </Space>
    </div>
  );
};
