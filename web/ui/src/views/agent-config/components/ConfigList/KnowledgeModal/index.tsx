import type { TableColumnsType } from 'antd';
import { Avatar, Modal, Table } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface.js';
import { useMemo } from 'react';

import type { KnowledgeMeta } from '../../../../../modules/agent/protocol.js';

export const KnowledgeModal = ({
  dataSource,
  open,
  onCancel,
  onOk,
  loading,
  selectedRowKeys = [],
  setSelectedRowKeys,
}: {
  open: boolean;
  dataSource: KnowledgeMeta[];
  onCancel: () => void;
  onOk: (selectedRowKeys: React.Key[]) => void;
  loading: boolean;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (selectedRowKeys: React.Key[]) => void;
}) => {
  const columns = useMemo(() => {
    const c: TableColumnsType<KnowledgeMeta> = [
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
          return <Avatar shape="circle" size={32} src={value} />;
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

  const rowSelection: TableRowSelection<KnowledgeMeta> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Modal
      width={1080}
      title="选择知识库"
      open={open}
      onOk={() => {
        onOk(selectedRowKeys);
      }}
      onCancel={() => onCancel()}
      loading={loading}
    >
      <Table<KnowledgeMeta>
        rowSelection={rowSelection}
        dataSource={dataSource || []}
        columns={columns}
        rowKey={'id'}
      ></Table>
    </Modal>
  );
};
