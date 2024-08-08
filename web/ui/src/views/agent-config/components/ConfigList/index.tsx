import './index.less';
import { PlusOutlined } from '@ant-design/icons';
import { useInject, ViewInstance } from '@difizen/mana-app';
import type { CollapseProps } from 'antd';
import { Collapse, Space } from 'antd';
import { useCallback, useMemo, useState } from 'react';

import type { AgentConfigView } from '../../view.js';
import { SkillItem } from '../ItemCard/index.js';

import { KnowledgeModal } from './KnowledgeModal/index.js';

const clsPrefix = 'config-list';

type SkillAddKey = 'tool' | 'knowledge';
type OpeningSpeechAddKey = 'openingSpeech' | 'knowledge';
type AddKey = SkillAddKey | OpeningSpeechAddKey;

const SkillConfigCard = ({ onAdd }: { onAdd: (key: AddKey) => void }) => {
  const items: CollapseProps['items'] = useMemo(() => {
    return [
      {
        key: 'knowledge' as AddKey,
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
          <SkillItem
            icon={
              <img
                width={36}
                height={36}
                src={
                  'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
                }
              />
            }
            title="title"
            description="descriptiondescriptiondescription"
          ></SkillItem>
        ),
        style: {
          padding: 0,
        },
      },
      {
        key: 'tool' as AddKey,
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
          <SkillItem
            icon={
              <img
                width={36}
                height={36}
                src={
                  'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
                }
              />
            }
            title="title"
            description="descriptiondescriptiondescription"
          ></SkillItem>
        ),
        style: {
          padding: 0,
        },
      },
    ];
  }, [onAdd]);

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

  const [openKnowledge, setOpenKnowledge] = useState(false);
  const [curAddKey, setCurAddKey] = useState<AddKey | undefined>(undefined);

  const onAdd = useCallback((addKey: AddKey) => {
    setCurAddKey(addKey);
    if (addKey === 'knowledge') {
      setOpenKnowledge(true);
    }
  }, []);

  return (
    <div className={`${clsPrefix}-container`}>
      <Space direction="vertical" size={'large'} style={{ display: 'flex' }}>
        <SkillConfigCard onAdd={onAdd}></SkillConfigCard>
      </Space>

      <KnowledgeModal
        open={openKnowledge}
        onCancel={() => {
          setOpenKnowledge(false);
        }}
      ></KnowledgeModal>
    </div>
  );
};
