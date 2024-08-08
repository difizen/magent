import { useInject, useMount, ViewInstance } from '@difizen/mana-app';
import type { TableColumnsType } from 'antd';
import { Avatar, Modal, Table } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface.js';
import { useMemo, useState } from 'react';

import { AgentConfig } from '../../../../../modules/agent/agent-config.js';
import { ToolIcon } from '../../../../tool/tool-icon.js';
import type { AgentConfigView } from '../../../view.js';

interface DataType {
  id: string;
  nickname: string;
  avatar: string;
  description: string;
  parameters: string[];
}

export const ToolModal = ({
  dataSource,
  open,
  onCancel,
  onOk,
  loading,
  selectedRowKeys = [],
  setSelectedRowKeys,
}: {
  open: boolean;
  dataSource: DataType[];
  onCancel: () => void;
  onOk: (selectedRowKeys: React.Key[]) => void;
  loading: boolean;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (selectedRowKeys: React.Key[]) => void;
}) => {
  const columns = useMemo(() => {
    const c: TableColumnsType<DataType> = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },

      {
        title: 'avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        render(value) {
          return <Avatar shape="circle" size={32} src={value || <ToolIcon />} />;
        },
      },
      {
        title: 'nickname',
        dataIndex: 'nickname',
        key: 'nickname',
      },

      {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
      },
    ];
    return c;
  }, []);

  // const [selectedRowKeys, setSelectedRowKeys] =
  //   useState<React.Key[]>(defaultSelectedRowKeys);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Modal
      width={1080}
      title="选择Tools"
      open={open}
      onOk={() => {
        onOk(selectedRowKeys);
      }}
      onCancel={() => onCancel()}
      loading={loading}
    >
      <Table<DataType>
        rowSelection={rowSelection}
        dataSource={dataSource || []}
        columns={columns}
        rowKey={'id'}
      ></Table>
    </Modal>
  );
};
