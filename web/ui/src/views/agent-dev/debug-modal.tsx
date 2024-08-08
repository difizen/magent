import { CopyOutlined, DownOutlined } from '@ant-design/icons';
import type { ModalItem, ModalItemProps } from '@difizen/mana-app';
import { useInject, ViewInstance } from '@difizen/mana-app';
import { ViewContext } from '@difizen/mana-app';
import type { TreeDataNode } from 'antd';
import { Avatar } from 'antd';
import { Col, Drawer, Row, Select, Tree } from 'antd';
import { useState } from 'react';

import { DefaultToolIcon } from '../../modules/tool/tool-icon.js';
import { DefaultLogo } from '../agent-config/components/model-selector/logos.js';
import type { ChatView } from '../chat/view.js';

import { copy2clipboard } from './utils.js';

export function DebugModalComponentContext(props: ModalItemProps<{ chat: ChatView }>) {
  const { data } = props;
  if (!data) {
    return null;
  }
  return (
    <ViewContext view={data.chat}>
      <DebugModalComponent {...props} />
    </ViewContext>
  );
}
export function DebugModalComponent({
  visible,
  close,
  data,
}: ModalItemProps<{ chat: ChatView }>) {
  const chat = useInject<ChatView>(ViewInstance);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  let messages = chat.session?.messages || [];
  messages = messages.filter((item) => item.tokenUsage);
  const selectedMessage = messages.find((item) => item.id?.toString() === selected);
  const invocationChain = [...(selectedMessage?.invocationChain || [])];
  const treeData: TreeDataNode[] = [
    {
      title: '用户输入',
      key: 'user-input',
      icon: (
        <Avatar size="small" src={'https://api.dicebear.com/7.x/miniavs/svg?seed=1'} />
      ),
      children: invocationChain.map((item) => {
        let iconSrc = undefined;
        if (item.type === 'llm') {
          iconSrc = <DefaultLogo />;
        }
        if (item.type === 'agent') {
          iconSrc = <DefaultLogo />;
        }
        if (item.type === 'tool') {
          iconSrc = <DefaultToolIcon />;
        }
        return {
          title: item.source,
          key: item.source,
          icon: iconSrc ? <Avatar size="small" src={iconSrc} /> : undefined,
        };
      }),
    },
  ];
  return (
    <Drawer title="调试详情" onClose={close} open={visible} width={622}>
      <div className="magent-debug">
        <div className="magent-select-container">
          <Select
            defaultValue={messages[0]?.id?.toString() || undefined}
            style={{ width: 508 }}
            onSelect={(e) => {
              setSelected(e);
            }}
            options={messages.map((item) => {
              return { value: item.id?.toString(), label: item.messages[0].content };
            })}
          />
        </div>

        {selectedMessage && (
          <div className="magent-summary-container">
            <div className="magent-summary-title-container">
              <div className="magent-summary-title-data">
                {`耗时 ${selectedMessage?.responseTime} | ${selectedMessage?.tokenUsage?.total_tokens} Tokens`}
              </div>
            </div>
            <div className="magent-des-container">
              {selectedMessage.id && (
                <Row>
                  <Col span={24}>
                    <div className="magent-des-item">
                      <span className="magent-des-key">{`message_id: `}</span>
                      <span className="magent-des-value">{selectedMessage.id}</span>
                      <CopyOutlined
                        className="magent-des-icon"
                        onClick={() =>
                          copy2clipboard(selectedMessage.id?.toString() || '')
                        }
                      />
                    </div>
                  </Col>
                </Row>
              )}
              <Row>
                <Col span={12}>
                  <div className="magent-des-item">
                    <span className="magent-des-key">{`开始时间: `}</span>
                    <span className="magent-des-value">
                      {selectedMessage?.startTime?.format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="magent-des-item">
                    <span className="magent-des-key">{`结束时间: `}</span>
                    <span className="magent-des-value">
                      {selectedMessage?.endTime?.format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
        {invocationChain.length > 0 && (
          <Tree
            showLine
            showIcon
            switcherIcon={<DownOutlined />}
            defaultExpandedKeys={['0-0-0']}
            treeData={treeData}
          />
        )}
      </div>
    </Drawer>
  );
}

export const DebugModal: ModalItem = {
  id: 'debug.modal',
  component: DebugModalComponentContext,
};
