/* eslint-disable react/prop-types */
import {
  BaseView,
  ModalService,
  ViewInstance,
  inject,
  prop,
  singleton,
  useInject,
  view,
} from '@difizen/mana-app';
import { Button, Col, List, message, Row, Space } from 'antd';
import { forwardRef, useState } from 'react';

import { KnowledgeIcon } from '@/modules/knowledge/knowledge-icon.js';
import { KnowledgeManager } from '@/modules/knowledge/knowledge-manager.js';
import type {
  KnowledgeModel,
  KnowledgeModelOption,
} from '@/modules/knowledge/protocol.js';

import './index.less';
import { KnowledgeModal } from './create-modal/modal.js';
import { history } from 'umi';

const viewId = 'magent-knowledge';
export const slot = `${viewId}-slot`;

const KnowledgeViewComponent = forwardRef<HTMLDivElement>(
  function ToolsViewComponent(props, ref) {
    const instance = useInject<KnowledgeView>(ViewInstance);
    const [selectedItems, setSelectedItems] = useState<KnowledgeModelOption[]>([]);

    const modalService = useInject<ModalService>(ModalService);

    return (
      <div ref={ref} className={viewId}>
        <Row className={`${viewId}-list-header`}>
          <Col className={`${viewId}-list-header-label`} span={8}>
            知识
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
                <Col
                  style={{ paddingLeft: 24 }}
                  className={`${viewId}-list-item-col`}
                  span={8}
                >
                  <Space size={24}>
                    <a
                      onClick={() =>
                        modalService.openModal(KnowledgeModal, {
                          type: 'edit',
                          knowledge_id: item.id,
                        })
                      }
                    >
                      编辑
                    </a>
                    <a
                      onClick={() =>
                        history.push(`/portal/knowledge/${item.id}/upload`)
                      }
                    >
                      上传
                    </a>
                    <a
                      onClick={async () => {
                        const res = await instance.manager.deleteKnowledge(item.id);
                        if (res) {
                          message.success('删除成功');
                          await instance.update();
                        }
                      }}
                    >
                      删除
                    </a>
                  </Space>
                </Col>
              </Row>
            </List.Item>
          )}
        />

        <div className="magent-knowledge-creation">
          <Button
            onClick={() => {
              modalService.openModal(KnowledgeModal, { type: 'create' });
            }}
            type="default"
          >
            新增知识库
          </Button>
        </div>
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
    const options = await this.manager.getAll();
    this.list = options.map(this.manager.getOrCreate);
  }

  override async onViewMount(): Promise<void> {
    this.loadig = true;
    this.update();
    this.loadig = false;
  }
}
