import { CopyOutlined, DislikeOutlined, LikeOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';

import type { BaseChatMessageItemModel, BaseChatMessageModel } from '../../../index.js';

export function MessageOp({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  message,
  item,
}: {
  message: BaseChatMessageModel;
  item: BaseChatMessageItemModel;
}) {
  return (
    <div style={{ paddingTop: 8, display: 'flex' }}>
      {/* <div
            className={'chat-message-retry'}
            onClick={() => {
              // TODO:
            }}
          >
            <ReloadOutlined style={{ marginRight: '5px' }} />
            重新生成
          </div> */}
      <div className={'chat-message-actions'}>
        <span key="action-tag-3" className={`chat-message-action-tag`}>
          <LikeOutlined />
        </span>
        <span key="action-tag-2" className={`chat-message-action-tag`}>
          <DislikeOutlined />
        </span>
        <span
          key="action-tag-1"
          className={`chat-message-action-tag`}
          onClick={() => {
            copy(item.content);
          }}
        >
          <CopyOutlined />
        </span>
      </div>
    </div>
  );
}
