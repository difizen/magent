import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { ModalItem, ModalItemProps } from '@difizen/mana-app';
import { useInject, useMount } from '@difizen/mana-app';
import { Button, Row } from 'antd';
import { Collapse } from 'antd';
import { Modal } from 'antd';
import { useState } from 'react';

import { TagList } from '@/components/tag-list/index.js';
import { PluginManager } from '@/modules/plugin/plugin-manager.js';
import { ToolIcon } from '@/modules/tool/icon/index.js';
import type { ToolMeta, ToolModel } from '@/modules/tool/protocol.js';

import { ToolsModalId } from '../protocol.js';
import './index.less';

const prefix = 'magent-plugins-modal';

const AddBtn = (props: ToolSelectProps & { tool: ToolModel }) => {
  const { dataProvider, onChange, tool } = props;
  const added = dataProvider.tool.find((t) => t.id === tool.id);

  const [hovered, setHovered] = useState(false);

  if (!added) {
    return (
      <Button
        onClick={() => {
          onChange?.([...dataProvider.tool, tool.toMeta()]);
        }}
      >
        添加
      </Button>
    );
  }
  return (
    <div
      onMouseOver={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      {hovered ? (
        <Button
          onClick={() => {
            onChange?.([...dataProvider.tool].filter((item) => item.id !== tool.id));
          }}
          danger
          icon={<CloseOutlined />}
        >
          移除
        </Button>
      ) : (
        <Button icon={<CheckOutlined />}>已添加</Button>
      )}
    </div>
  );
};

interface ToolSelectProps {
  dataProvider: { tool: ToolMeta[] };
  onChange?: (tool: ToolMeta[]) => void;
  expandAll?: boolean;
}
export const ToolsModalComponent = (props: ModalItemProps<ToolSelectProps>) => {
  const plugins = useInject(PluginManager);
  const { visible, close } = props;
  const { dataProvider, onChange, expandAll } = props.data || {};

  useMount(() => {
    plugins.updatePublic();
  });

  if (!dataProvider) {
    return null;
  }

  // const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
  //   onChange?.(
  //     toolSpace.list
  //       .filter((item) => newSelectedRowKeys.includes(item.id))
  //       .map((item) => item.toMeta()),
  //   );
  // };

  const extraProps: any = {};
  if (expandAll && plugins.publicList.length > 0) {
    extraProps['activeKey'] = plugins.publicList.map((item) => item.id.toString());
  }

  return (
    <Modal
      open={visible}
      onCancel={() => close()}
      width={1080}
      title="选择工具"
      footer={null}
      className={`${prefix}`}
    >
      <Collapse
        bordered={false}
        // defaultActiveKey={['1']}
        className={`${prefix}-list`}
        expandIcon={() => <></>}
        {...extraProps}
        // style={{ background: token.colorBgContainer }}
        items={plugins.publicList.map((item) => {
          return {
            key: item.id.toString(),
            // label: item.nickname,
            label: (
              <div className={`${prefix}-list-row`}>
                <Row className={`${prefix}-list-row-content`}>
                  <div className={`${prefix}-list-item`}>
                    <div className={`${prefix}-list-item-info`}>
                      <ToolIcon size={52} data={item} />
                      <div className={`${prefix}-list-item-info-text`}>
                        <label className={`${prefix}-list-item-info-name`}>
                          {item.nickname}
                        </label>
                        <label className={`${prefix}-list-item-info-desc`}>
                          {item.description}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={`${prefix}-list-item`}>
                    <TagList
                      tags={item.toolset.map((item) =>
                        item.openapi_schema && item.openapi_schema['method']
                          ? `${item.openapi_schema['method']}: ${item.openapi_schema['path']}`
                          : item.nickname,
                      )}
                      maxWidth={400}
                    ></TagList>
                  </div>
                </Row>
              </div>
            ),

            children: item.toolset.map((tool) => (
              <Row key={tool.id} className={`${prefix}-tool`}>
                <div className={`${prefix}-tool-item`}>
                  <div className={`${prefix}-tool-item-info`}>
                    <label className={`${prefix}-tool-item-info-name`}>
                      {tool.nickname}
                    </label>
                    <label className={`${prefix}-tool-item-info-desc`}>
                      {tool.description}
                    </label>
                  </div>
                </div>

                <div className={`${prefix}-tool-item ${prefix}-tool-actions`}>
                  {props.data && <AddBtn tool={tool} {...props.data}></AddBtn>}
                </div>
              </Row>
            )),
          };
        })}
      />
    </Modal>
  );
};

export const ToolsModal: ModalItem = {
  id: ToolsModalId,
  component: ToolsModalComponent,
};
