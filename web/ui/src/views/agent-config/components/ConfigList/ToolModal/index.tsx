import type { TableColumnsType } from 'antd';
import { Modal, Table } from 'antd';
import { useState } from 'react';

interface DataType {
  key: React.Key;
  id: string;
  nickname: string;
  avatar: number;
  description: string;
  address: string;
  added: boolean;
}

export const ToolModal = ({
  open,
  onCancel,
}: {
  open: boolean;
  onCancel: () => void;
}) => {
  function useToolTable() {
    const dataSource = [
      {
        id: '1',
        nickname: '胡彦斌',
        avatar: 32,
        description: '西湖区湖底公园1号',
        address: '西湖区湖底公园1号',
        added: true,
      },
      {
        id: '2',
        nickname: '胡彦斌',
        avatar: 32,
        description: '西湖区湖底公园1号',
        address: '西湖区湖底公园1号',
        added: true,
      },
    ] as DataType[];

    const columns: TableColumnsType<DataType> = [
      {
        title: 'nickname',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'avatar',
        dataIndex: 'avatar',
        key: 'avatar',
      },
      {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'added',
        dataIndex: 'added',
        key: 'added',
        render: (text: boolean) => {
          return text ? '是' : '否';
        },
      },
    ];
    return {
      dataSource,
      columns,
    };
  }

  const { dataSource, columns } = useToolTable();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Modal width={760} title="选择知识库" open={open} onCancel={() => onCancel()}>
      <Table<DataType>
        rowSelection={rowSelection}
        dataSource={dataSource}
        columns={columns}
        rowKey={'id'}
      ></Table>
    </Modal>
  );
};
