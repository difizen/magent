import './index.less';
import { FileTwoTone, PlusOutlined } from '@ant-design/icons';
import { useInject, useMount, ViewInstance } from '@difizen/mana-app';
import type { CollapseProps } from 'antd';
import { Avatar, Collapse, Space } from 'antd';
import { useCallback, useMemo, useState } from 'react';

import type { KnowledgeMeta, ToolMeta } from '../../../../modules/agent/protocol.js';
import { ToolIcon } from '../../../../modules/tool/tool-icon.js';
import type { AgentConfigView } from '../../view.js';
import { SkillItem } from '../ItemCard/index.js';

import { KnowledgeModal } from './KnowledgeModal/index.js';
import { ToolModal } from './ToolModal/index.js';

const clsPrefix = 'config-list';

type SkillKey = 'tool' | 'knowledge';
type OpeningSpeechKey = 'openingSpeech';
type ServiceType = SkillKey | OpeningSpeechKey;

const SkillConfigCard = ({
  onAdd,
  tools,
  knowledge,
  onDelete,
}: {
  onAdd: (serviceType: ServiceType) => void;
  onDelete: (serviceType: ServiceType, itemKey: string) => void;
  tools: ToolMeta[];
  knowledge: KnowledgeMeta[];
}) => {
  const items: CollapseProps['items'] = useMemo(() => {
    return [
      {
        key: 'knowledge' as ServiceType,
        label: '知识',
        extra: (
          <div className={`${clsPrefix}-card-add`}>
            <PlusOutlined
              onClick={(e) => {
                e.stopPropagation();
                onAdd('knowledge');
              }}
            />
          </div>
        ),
        children: (
          <>
            {knowledge.map((item) => {
              return (
                <SkillItem
                  onDelete={() => {
                    onDelete('knowledge', item.id);
                  }}
                  key={item.id}
                  icon={<FileTwoTone size={32} style={{ fontSize: 32 }} />}
                  title={item.nickname || '-'}
                  description={item.description || '-'}
                ></SkillItem>
              );
            })}
          </>
        ),
        style: {
          padding: 0,
        },
      },
      {
        key: 'tool' as ServiceType,
        label: '工具',
        extra: (
          <div className={`${clsPrefix}-card-add`}>
            <PlusOutlined
              onClick={(e) => {
                e.stopPropagation();
                onAdd('tool');
              }}
            />
          </div>
        ),
        children: (
          <>
            {tools.map((item) => {
              return (
                <SkillItem
                  onDelete={() => {
                    onDelete('tool', item.id);
                  }}
                  key={item.id}
                  icon={<ToolIcon shape="circle" size={32} tool={item} />}
                  title={item.nickname || '-'}
                  description={item.description || '-'}
                ></SkillItem>
              );
            })}
          </>
        ),
        style: {
          padding: 0,
        },
      },
    ];
  }, [knowledge, onAdd, onDelete, tools]);

  return (
    <div className={`${clsPrefix}-card`}>
      <div className={`${clsPrefix}-card-title`}>技能</div>
      <Collapse
        style={{ padding: 0 }}
        defaultActiveKey={['knowledge', 'tool']}
        ghost
        items={items}
      />
    </div>
  );
};

export const ConfigList = () => {
  const instance = useInject<AgentConfigView>(ViewInstance);

  const [curServiceType, setCurServiceType] = useState<ServiceType | undefined>(
    undefined,
  );

  useMount(() => {
    instance.agent.updateToolList();
    instance.agent.updateKnowledgeList();
  });

  const onAdd = useCallback((addKey: ServiceType) => {
    setCurServiceType(addKey);
  }, []);

  return (
    <div className={`${clsPrefix}-container`}>
      <Space direction="vertical" size={'large'} style={{ display: 'flex' }}>
        <SkillConfigCard
          tools={instance.agent.tool || []}
          knowledge={instance.agent.knowledges || []}
          onAdd={onAdd}
          onDelete={(serviceType, itemKey) => {
            if (serviceType === 'tool') {
              instance.agent.removeSelectedToolList([itemKey]);
            }
            if (serviceType === 'knowledge') {
              instance.agent.removeSelectedKnowledgeList([itemKey]);
            }
          }}
        ></SkillConfigCard>
      </Space>

      <KnowledgeModal
        open={curServiceType === 'knowledge'}
        onCancel={() => {
          setCurServiceType(undefined);
        }}
        dataSource={instance.agent.knowledges}
        onOk={() => {
          setCurServiceType(undefined);
        }}
        loading={instance.agent.allToolsLoading}
        selectedRowKeys={instance.agent.knowledges.map((item) => item.id)}
        setSelectedRowKeys={(keys) => {
          instance.agent.updateSelectedKnowledgeList(keys);
        }}
      ></KnowledgeModal>

      <ToolModal
        open={curServiceType === 'tool'}
        onCancel={() => {
          setCurServiceType(undefined);
        }}
        dataSource={instance.agent.allTools}
        onOk={() => {
          setCurServiceType(undefined);
        }}
        loading={instance.agent.allToolsLoading}
        selectedRowKeys={instance.agent.tool.map((item) => item.id)}
        setSelectedRowKeys={(keys) => {
          instance.agent.updateSelectedToolList(keys);
        }}
      ></ToolModal>
    </div>
  );
};
