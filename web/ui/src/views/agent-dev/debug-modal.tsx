import { CopyOutlined } from '@ant-design/icons';
import type { ModalItem, ModalItemProps } from '@difizen/mana-app';
import { Col, Drawer, Row, Select } from 'antd';
import { useEffect } from 'react';

import { copy2clipboard } from './utils.js';

export function DebugModalComponent({ visible, close }: ModalItemProps<void>) {
  const mockRes = {
    success: true,
    data: {
      output: '2023年巴菲特减持比亚迪的原因是xxxxxxxx',
      response_time: 16654,
      token_usages: 1837,
      start_time: '2024-07-24 16:00:00',
      end_time: '2024-07-24 16:01:00',
      invocation_chain: ['google_search', 'demo_rag_agent'],
      message_id: 'xxxxx',
      session_id: 'xxxxx',
    },
  };
  // useEffect(() => {
  // viewManager
  //   .getOrCreateView<ConfigurationPanelView>(ConfigurationPanelView)
  //   .then((view) => {
  //     const config = configRegistry.getConfigurationByNamespace(
  //       [LibroUserSettingsNamespace],
  //       false,
  //     );
  //     view.configurationNodes = config;
  //     view.className = 'libro-settings-modal';
  //     setSettingEditorView(view);
  //     return;
  //   })
  //   .catch((e) => {
  //     //
  //   });
  // }, []);

  return (
    <Drawer title="调试详情" onClose={close} open={visible} width={622}>
      <div className="magent-debug">
        <div className="magent-select-container">
          <Select
            defaultValue="lucy"
            style={{ width: 508 }}
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'lucy', label: 'Lucy' },
              { value: 'Yiminghe', label: 'yiminghe' },
              { value: 'disabled', label: 'Disabled', disabled: true },
            ]}
          />
        </div>
        <div className="magent-summary-container">
          <div className="magent-summary-title-container">
            <div className="magent-summary-title-data">
              {`耗时 ${mockRes.data.response_time} | ${mockRes.data.token_usages} Tokens`}
            </div>
          </div>
          <div className="magent-des-container">
            <Row>
              <Col span={24}>
                <div className="magent-des-item">
                  <span className="magent-des-key">{`message_id: `}</span>
                  <span className="magent-des-value">{mockRes.data.message_id}</span>
                  <CopyOutlined
                    className="magent-des-icon"
                    onClick={() => copy2clipboard(mockRes.data.message_id)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div className="magent-des-item">
                  <span className="magent-des-key">{`开始时间: `}</span>
                  <span className="magent-des-value">{mockRes.data.start_time}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="magent-des-item">
                  <span className="magent-des-key">{`结束时间: `}</span>
                  <span className="magent-des-value">{mockRes.data.end_time}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="magent-des-item">
                  <span className="magent-des-key">{`首字母回复耗时: `}</span>
                  <span className="magent-des-value">{mockRes.data.response_time}</span>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export const DebugModal: ModalItem = {
  id: 'debug.modal',
  component: DebugModalComponent,
};
