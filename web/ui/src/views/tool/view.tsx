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

import './index.less';
import { ToolIcon } from '../../modules/tool/tool-icon.js';
import { ToolSpace } from '../../modules/tool/tool-space.js';

export interface ToolItem {
  nickname: string;
  id: string;
  avatar: string;
  description: string;
  parameters: string[];
}

const viewId = 'magent-tools';
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

const ToolsViewComponent = forwardRef<HTMLDivElement>(
  function ToolsViewComponent(props, ref) {
    const instance = useInject<ToolsView>(ViewInstance);
    const space = instance.toolSpace;
    const [selectedItems, setSelectedItems] = useState<ToolItem[]>([]);

    const handSelect = (item: ToolItem) => {
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
                    avatar={<ToolIcon shape="circle" size={32} tool={item} />}
                    title={item.nickname}
                    description={item.description}
                  />
                </List.Item>
              </Col>
              <Col className={`${viewId}-list-item`} span={8}>
                <TagList tags={item.parameters} maxWidth={180}></TagList>
              </Col>
              <Col className={`${viewId}-list-item`} span={8}>
                {/* <div className="button-container">
                  <Button
                    type="text"
                    onClick={() => handSelect(item)}
                    style={{ background: 'white', color: '#1677ff' }}
                  >
                    {selectedItems.findIndex(
                      (selectedItem) => selectedItem.id === item.id,
                    ) > -1
                      ? '移除'
                      : '添加'}
                  </Button>
                </div> */}
              </Col>
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
  @prop()
  loadig = false;

  @inject(ToolSpace) toolSpace: ToolSpace;

  override async onViewMount(): Promise<void> {
    this.loadig = true;
    await this.toolSpace.update();
    this.loadig = false;
  }
}
