import { Tag, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import './index.less';

export interface TagListProps {
  tags: string[];
  maxWidth: number;
}
export const TagList: React.FC<TagListProps> = ({ tags, maxWidth }: TagListProps) => {
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
        <Tag bordered={false} key={index}>
          {tag}
        </Tag>
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
          <Tag bordered={false}>+{hiddenTags.length} more</Tag>
        </Tooltip>
      )}
    </div>
  );
};
