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
import { Col, List, Row, Tag, Tooltip } from 'antd';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { KnowledgeIcon } from '../../modules/knowledge/knowledge-icon.js';
import { KnowledgeManager } from '../../modules/knowledge/knowledge-manager.js';
import type {
  KnowledgeModel,
  KnowledgeModelOption,
} from '../../modules/knowledge/protocol.js';

import './index.less';

const viewId = 'magent-knowledge';
export const slot = `${viewId}-slot`;

const TagList: React.FC<{
  tags: string[];
  maxWidth: number;
}> = ({ tags, maxWidth }) => {
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [hiddenTags, setHiddenTags] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measureTagWidth = (tag: string) => {
      if (measurementRef.current) {
        measurementRef.current.innerText = tag;
        return measurementRef.current.getBoundingClientRect().width;
      }
      return 0;
    };
    const width = maxWidth - 78;
    let currentWidth = 0;
    const visible = [];
    const hidden = [];

    for (const tag of tags) {
      const tagWidth = measureTagWidth(tag) + 8; // 加上 Tag 组件的 padding 和 margin
      if (currentWidth + tagWidth <= width) {
        visible.push(tag);
        currentWidth += tagWidth;
      } else {
        hidden.push(tag);
      }
    }
    setVisibleTags(visible);
    setHiddenTags(hidden);
  }, [tags, maxWidth]);

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth,
      }}
      className="tag-list-container"
    >
      <div
        ref={measurementRef}
        style={{ visibility: 'hidden', position: 'absolute', whiteSpace: 'nowrap' }}
      />
      {visibleTags.map((tag, index) => (
        <Tag key={index}>{tag}</Tag>
      ))}
      {hiddenTags.length > 0 && (
        <Tooltip
          title={
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {hiddenTags.map((tag) => (
                <div key={tag}>{tag}</div>
              ))}
            </div>
          }
        >
          <Tag>+{hiddenTags.length} more</Tag>
        </Tooltip>
      )}
    </div>
  );
};

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
    const options = await this.manager.getTools();
    this.list = options.map(this.manager.getOrCreateKnowledge);
  }

  override async onViewMount(): Promise<void> {
    this.loadig = true;
    this.update();
    this.loadig = false;
  }
}
