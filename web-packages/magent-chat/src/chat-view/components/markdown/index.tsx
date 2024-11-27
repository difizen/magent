import { Modal } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import './index.less';

// const PreBlock = (...args:any) => {
//   console.log(args)
//   return <div>pre</div>
// }

export interface MarkdownProps {
  children: any;
  className?: string;
  type?: 'message' | 'content';
  components?: Record<string, any>;
  remarkPlugins?: any[];
  rehypePlugins?: any[];
}

export function ImageModal({ src, alt }: any) {
  const [visible, setVisible] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
      });
    };
  }, [src]);

  if (alt === 'cursor') {
    return (
      <div
        style={{
          display: 'inline-block',
          transform: 'translateY(3px)',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            cursor: 'pointer',
            userSelect: 'none',
            width: '2px',
            height: '15px',
          }}
        />
      </div>
    );
  }

  const maxModalWidth = window.innerWidth * 0.8; // 80% of the viewport width
  const maxModalHeight = window.innerHeight * 0.8; // 80% of the viewport height

  let adjustedWidth, adjustedHeight;

  const aspectRatio = imageDimensions.width / imageDimensions.height;

  if (imageDimensions.width > maxModalWidth) {
    adjustedWidth = maxModalWidth;
    adjustedHeight = adjustedWidth / aspectRatio;
  } else if (imageDimensions.height > maxModalHeight) {
    adjustedHeight = maxModalHeight;
    adjustedWidth = adjustedHeight * aspectRatio;
  } else {
    adjustedWidth = imageDimensions.width;
    adjustedHeight = imageDimensions.height;
  }

  return (
    <div>
      <img
        src={src}
        alt={alt}
        style={{ cursor: 'pointer' }}
        onClick={() => setVisible(true)}
        onLoad={() => {
          // 解决生成图片没有滚动到最下方的问题。
          document.getElementById('chat-main-scroll')?.scrollIntoView(false);
        }}
      />
      <Modal
        open={visible}
        closeIcon={false}
        footer={null}
        width={adjustedWidth + 30}
        onCancel={() => setVisible(false)}
        bodyStyle={{
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: adjustedHeight,
        }}
      >
        <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0}>
          <TransformComponent>
            <img
              src={src}
              alt={alt}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </TransformComponent>
        </TransformWrapper>
      </Modal>
    </div>
  );
}

export const DefaultMarkdown = (props: MarkdownProps) => {
  const { type = 'message', className, ...mdProps } = props;

  useEffect(() => {
    const links = document.querySelectorAll('a');
    for (let i = 0, length = links.length; i < length; i++) {
      if (links[i].hostname !== window.location.hostname) {
        links[i].target = '_blank';
      }
    }
  }, [props.children]);

  return (
    <ReactMarkdown
      className={classNames(
        `chat-msg-md`,
        type === 'content' && `chat-msg-md-content`,
        type === 'message' && `chat-msg-md-message`,
        className,
      )}
      {...mdProps}
    >
      {props.children}
    </ReactMarkdown>
  );
};
