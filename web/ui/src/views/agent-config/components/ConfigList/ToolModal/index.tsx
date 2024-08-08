import type { TableColumnsType } from 'antd';
import { Modal, Table } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface.js';
import { useMemo } from 'react';

import type { ToolMeta } from '../../../../../modules/tool/protocol.js';
import { ToolIcon } from '../../../../../modules/tool/tool-icon.js';

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
  dataSource: ToolMeta[];
  onCancel: () => void;
  onOk: (selectedRowKeys: React.Key[]) => void;
  loading: boolean;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (selectedRowKeys: React.Key[]) => void;
}) => {
  const columns = useMemo(() => {
    const c: TableColumnsType<ToolMeta> = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },

      {
        title: 'avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        render(value, obj) {
          return <ToolIcon shape="circle" size={32} tool={obj} />;
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

  const rowSelection: TableRowSelection<ToolMeta> = {
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
      <Table<ToolMeta>
        rowSelection={rowSelection}
        dataSource={dataSource || []}
        columns={columns}
        rowKey={'id'}
      ></Table>
    </Modal>
  );
};
