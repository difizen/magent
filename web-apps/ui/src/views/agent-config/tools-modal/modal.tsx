import type { ModalItem, ModalItemProps } from '@difizen/mana-app';
import { useInject, useMount } from '@difizen/mana-app';
import type { TableColumnsType } from 'antd';
import { Modal, Table } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface.js';
import { useMemo } from 'react';

import type { AgentModel } from '@/modules/agent/protocol.js';
import type { ToolMeta } from '@/modules/tool/protocol.js';
import { ToolIcon } from '@/modules/tool/icon/index.js';
import { ToolSpace } from '@/modules/tool/tool-space.js';

import { ToolsModalId } from '../protocol.js';

export const ToolsModalComponent = (props: ModalItemProps<{ agent: AgentModel }>) => {
  const toolSpace = useInject(ToolSpace);
  const { visible, close } = props;
  const { agent } = props.data || {};

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
        render(value, item) {
          return <ToolIcon shape="circle" size={32} data={item} />;
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

  useMount(() => {
    toolSpace.update();
  });

  if (!agent) {
    return null;
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    agent.tool = toolSpace.list
      .filter((item) => newSelectedRowKeys.includes(item.id))
      .map((item) => item.toMeta());
  };

  const rowSelection: TableRowSelection<ToolMeta> = {
    selectedRowKeys: (agent.tool || []).map((item) => item.id),
    onChange: onSelectChange,
  };

  return (
    <Modal
      open={visible}
      onCancel={() => close()}
      width={1080}
      title="选择工具"
      footer={null}
    >
      <Table<ToolMeta>
        loading={toolSpace.loading}
        rowSelection={rowSelection}
        dataSource={toolSpace.list}
        columns={columns}
        rowKey={'id'}
      ></Table>
    </Modal>
  );
};

export const ToolsModal: ModalItem = {
  id: ToolsModalId,
  component: ToolsModalComponent,
};
