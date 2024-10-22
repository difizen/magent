/* eslint-disable react/prop-types */
import {
  BaseView,
  ViewInstance,
  inject,
  singleton,
  useInject,
  view,
} from '@difizen/mana-app';
import { Col, List, Row } from 'antd';
import { forwardRef } from 'react';

import { TagList } from '../../components/tag-list/index.js';
import { PluginManager } from '../../plugin/plugin-manager.js';
import { ToolIcon } from '../../tool/icon/index.js';
import { ToolSpace } from '../../tool/tool-space.js';
import './index.less';

export interface ToolItem {
  nickname: string;
  id: string;
  avatar: string;
  description: string;
  parameters: string[];
}

const viewId = 'magent-tools';
export const slot = `${viewId}-slot`;

const ToolsViewComponent = forwardRef<HTMLDivElement>(
  function ToolsViewComponent(props, ref) {
    const instance = useInject<ToolsView>(ViewInstance);
    const space = instance.toolSpace;

    return (
      <div ref={ref} className={viewId}>
        <Row className={`${viewId}-list-header`}>
          <Col className={`${viewId}-list-header-label`} span={8}>
            工具
          </Col>
          <Col className={`${viewId}-list-header-label`} span={8}>
            入参
          </Col>
          <Col className={`${viewId}-list-header-label`} span={8}>
            操作
          </Col>
        </Row>
        <List
          className={`${viewId}-list`}
          itemLayout="horizontal"
          dataSource={space.list}
          renderItem={(item) => (
            <Row>
              <Col className={`${viewId}-list-item`} span={8}>
                <List.Item>
                  <List.Item.Meta
                    avatar={<ToolIcon shape="circle" size={32} data={item} />}
                    title={item.nickname}
                    description={item.description}
                  />
                </List.Item>
              </Col>
              <Col className={`${viewId}-list-item`} span={8}>
                <TagList tags={item.parameters} maxWidth={180}></TagList>
              </Col>
              <Col className={`${viewId}-list-item`} span={8}></Col>
            </Row>
          )}
        />
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class ToolsView extends BaseView {
  override view = ToolsViewComponent;

  @inject(ToolSpace) toolSpace: ToolSpace;
  @inject(PluginManager) pluginManager: PluginManager;

  override async onViewMount(): Promise<void> {
    await this.toolSpace.update();
  }
}
