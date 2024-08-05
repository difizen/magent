/* eslint-disable react/prop-types */
import { BaseView, singleton, view } from '@difizen/mana-app';
import { Avatar, Button, Checkbox, Col, List, Row, Tag, Tooltip } from 'antd';
import { forwardRef, useEffect, useRef, useState } from 'react';

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

const mockData: ToolItem[] = [
  {
    nickname: 'Ant Design Title 1',
    id: '1',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
    description: '测试1',
    parameters: ['test1', 'test2', 'testhidden1', 'testhidden2', 'testhidden3'],
  },
  {
    nickname: 'Ant Design Title 2',
    id: '2',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
    description: '测试2',
    parameters: ['test3', 'test4'],
  },
  {
    nickname: 'Ant Design Title 3',
    id: '3',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
    description: '测试3',
    parameters: ['test5', 'test6'],
  },
  {
    nickname: 'Ant Design Title 4',
    id: '4',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
    description: '测试4',
    parameters: ['test7', 'test8'],
  },
  {
    nickname: 'Ant Design Title 1',
    id: '1',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
    description: '测试1',
    parameters: ['test1', 'test2', 'testhidden1', 'testhidden2', 'testhidden3'],
  },
  {
    nickname: 'Ant Design Title 2',
    id: '2',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
    description: '测试2',
    parameters: ['test3', 'test4'],
  },
  {
    nickname: 'Ant Design Title 3',
    id: '3',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
    description: '测试3',
    parameters: ['test5', 'test6'],
  },
  {
    nickname: 'Ant Design Title 4',
    id: '4',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
    description: '测试4',
    parameters: ['test7', 'test8'],
  },
  {
    nickname: 'Ant Design Title 1',
    id: '1',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
    description: '测试1',
    parameters: ['test1', 'test2', 'testhidden1', 'testhidden2', 'testhidden3'],
  },
  {
    nickname: 'Ant Design Title 2',
    id: '2',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
    description: '测试2',
    parameters: ['test3', 'test4'],
  },
  {
    nickname: 'Ant Design Title 3',
    id: '3',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
    description: '测试3',
    parameters: ['test5', 'test6'],
  },
  {
    nickname: 'Ant Design Title 4',
    id: '4',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
    description: '测试4',
    parameters: ['test7', 'test8'],
  },
  {
    nickname: 'Ant Design Title 1',
    id: '1',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
    description: '测试1',
    parameters: ['test1', 'test2', 'testhidden1', 'testhidden2', 'testhidden3'],
  },
  {
    nickname: 'Ant Design Title 2',
    id: '2',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
    description: '测试2',
    parameters: ['test3', 'test4'],
  },
  {
    nickname: 'Ant Design Title 3',
    id: '3',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
    description: '测试3',
    parameters: ['test5', 'test6'],
  },
  {
    nickname: 'Ant Design Title 4',
    id: '4',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
    description: '测试4',
    parameters: ['test7', 'test8'],
  },
];

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
        <Row>
          <Col span={8}>
            <div className="tool-lists-label-item">工具</div>
          </Col>
          <Col span={8}>
            <div className="tool-lists-label-item">入参</div>
          </Col>
          <Col span={8}>
            <div className="tool-lists-label-item">操作</div>
          </Col>
        </Row>
        <List
          itemLayout="horizontal"
          dataSource={mockData}
          renderItem={(item) => (
            <Row>
              <Col span={8}>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.nickname}
                    description={item.description}
                  />
                </List.Item>
              </Col>
              <Col span={8}>
                <TagList tags={item.parameters} maxWidth={180}></TagList>
              </Col>
              <Col span={8}>
                <div className="button-container">
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
                </div>
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
}
