/* eslint-disable react/prop-types */
import {
  BaseView,
  ViewInstance,
  inject,
  prop,
  singleton,
  useInject,
  view,
} from '@difizen/mana-app';
import { Col, List, Row } from 'antd';
import { forwardRef, useState } from 'react';

import { KnowledgeIcon } from '../../modules/knowledge/knowledge-icon.js';
import { KnowledgeManager } from '../../modules/knowledge/knowledge-manager.js';
import type {
  KnowledgeModel,
  KnowledgeModelOption,
} from '../../modules/knowledge/protocol.js';

import './index.less';

const viewId = 'magent-knowledge';
export const slot = `${viewId}-slot`;

const KnowledgeViewComponent = forwardRef<HTMLDivElement>(
  function ToolsViewComponent(props, ref) {
    const instance = useInject<KnowledgeView>(ViewInstance);
    const [selectedItems, setSelectedItems] = useState<KnowledgeModelOption[]>([]);

    const handSelect = (item: KnowledgeModelOption) => {
      if (selectedItems.findIndex((selectedItem) => selectedItem.id === item.id) > -1) {
        setSelectedItems(
          selectedItems.filter((selectedItem) => selectedItem.id !== item.id),
        );
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    };
    return (
      <div ref={ref} className={viewId}>
        <Row className={`${viewId}-list-header`}>
          <Col className={`${viewId}-list-header-label`} span={8}>
            工具
          </Col>
          <Col className={`${viewId}-list-header-label`} span={8}>
            简介
          </Col>
          <Col className={`${viewId}-list-header-label`} span={8}>
            操作
          </Col>
        </Row>
        <List
          className={`${viewId}-list`}
          itemLayout="horizontal"
          dataSource={instance.list}
          renderItem={(item) => (
            <List.Item>
              <Row className={`${viewId}-list-item`}>
                <Col className={`${viewId}-list-item-col`} span={8}>
                  <KnowledgeIcon shape="circle" size={32} data={item} />
                  {item.nickname}
                </Col>
                <Col
                  style={{ paddingLeft: 24 }}
                  className={`${viewId}-list-item-col`}
                  span={8}
                >
                  {item.description}
                </Col>
                <Col className={`${viewId}-list-item-col`} span={8}></Col>
              </Row>
            </List.Item>
          )}
        />
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class KnowledgeView extends BaseView {
  @inject(KnowledgeManager) manager: KnowledgeManager;

  @prop()
  list: KnowledgeModel[] = [];

  override view = KnowledgeViewComponent;
  @prop()
  loadig = false;

  async update() {
    const options = await this.manager.getKnowledge();
    this.list = options.map(this.manager.getOrCreateKnowledge);
  }

  override async onViewMount(): Promise<void> {
    this.loadig = true;
    this.update();
    this.loadig = false;
  }
}
