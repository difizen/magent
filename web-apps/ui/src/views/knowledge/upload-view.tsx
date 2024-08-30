import { InboxOutlined } from '@ant-design/icons';
import { BaseView, inject, singleton, view } from '@difizen/mana-app';
import { message, Upload } from 'antd';
import { forwardRef } from 'react';
import { history } from 'umi';
import { useParams } from 'umi';

import { MainView } from '@/modules/base-layout/main-view.js';
import type { NavigatablePage } from '@/modules/base-layout/protocol.js';

import './index.less';

const { Dragger } = Upload;

const viewId = 'magent-knowledge-upload';
export const uploadslot = `${viewId}-slot`;

const KnowledgeUploadComponent = forwardRef<HTMLDivElement>(
  function KnowledgeUploadComponent() {
    const { knowledgeId } = useParams();
    return (
      <div className={`${viewId}-wrapper`}>
        <Dragger
          className={`${viewId}-dragger`}
          name="file"
          multiple
          data={{
            knowledge_id: knowledgeId,
          }}
          method="post"
          action="/api/v1/knowledge/upload"
          listType="picture"
          onChange={(info) => {
            const { status } = info.file;
            if (status === 'done') {
              message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          }}
          // onDrop={(e) => {}}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading
            company data or other banned files.
          </p>
        </Dragger>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class KnowledgeUploadView extends BaseView implements NavigatablePage {
  @inject(MainView) protected mainView: MainView;

  override view = KnowledgeUploadComponent;

  override onViewUnmount(): void {
    this.mainView.active = undefined;
  }
  override onViewMount(): void {
    this.mainView.active = this;
  }

  goBack = () => history.push('/portal/knowledge');

  pageTitle = () => <>上传知识</>;
}
