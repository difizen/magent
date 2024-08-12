import type { ModalItem, ModalItemProps } from '@difizen/mana-app';
import { useInject, useMount } from '@difizen/mana-app';
import type { TableColumnsType } from 'antd';
import { Modal, Table } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface.js';
import { useMemo } from 'react';

import type { AgentModel } from '../../../modules/agent/protocol.js';
import { KnowledgeIcon } from '../../../modules/knowledge/knowledge-icon.js';
import { KnowledgeSpace } from '../../../modules/knowledge/knowledge-space.js';
import type { KnowledgeModelOption } from '../../../modules/knowledge/protocol.js';
import { KnowledgeModalId } from '../protocol.js';

export const KnowledgeModalComponent = (
  props: ModalItemProps<{ agent: AgentModel }>,
) => {
  const knowledgeSpace = useInject(KnowledgeSpace);
  const { visible, close } = props;
  const { agent } = props.data || {};

  const columns = useMemo(() => {
    const c: TableColumnsType<KnowledgeModelOption> = [
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
          return <KnowledgeIcon shape="circle" size={32} data={item} />;
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
    knowledgeSpace.update();
  });

  if (!agent) {
    return null;
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    agent.knowledge = knowledgeSpace.list
      .filter((item) => newSelectedRowKeys.includes(item.id))
      .map((item) => item.toMeta());
  };

  const rowSelection: TableRowSelection<KnowledgeModelOption> = {
    selectedRowKeys: (agent.knowledge || []).map((item) => item.id),
    onChange: onSelectChange,
  };

  return (
    <Modal
      open={visible}
      onCancel={() => close()}
      width={1080}
      title="选择知识库"
      footer={null}
    >
      <Table<KnowledgeModelOption>
        loading={knowledgeSpace.loading}
        rowSelection={rowSelection}
        dataSource={knowledgeSpace.list}
        columns={columns}
        rowKey={'id'}
      ></Table>
    </Modal>
  );
};

export const KnowledgeModal: ModalItem = {
  id: KnowledgeModalId,
  component: KnowledgeModalComponent,
};
