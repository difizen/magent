import { ChatView } from '@difizen/magent-chat';
import { Deferred, ViewRender } from '@difizen/mana-app';
import {
  ViewInstance,
  inject,
  singleton,
  useInject,
  view,
  BaseView,
  prop,
  ViewManager,
} from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { message } from 'antd';
import { forwardRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Greeting } from './greeting/index.js';

import './index.less';
import { getExtension, isAllowedImageType, uploadFileAsBase64 } from './utils.js';

const viewId = 'magent-langchain-chat';
export const slot = `${viewId}-slot`;

const AgentChatComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<LangchainChatView>(ViewInstance);

    return (
      <div ref={ref} className={`${viewId}-layout`}>
        <BoxPanel className={`${viewId}-layout-container`} direction="left-to-right">
          <BoxPanel.Pane className={`${viewId}-layout-chat`} flex={1}>
            {instance.chat && <ViewRender view={instance.chat} />}
          </BoxPanel.Pane>
          {/* <BoxPanel.Pane className="magent-agent-chat-layout-history">
            {instance.sessions && <ViewRender view={instance.sessions} />}
          </BoxPanel.Pane> */}
        </BoxPanel>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class LangchainChatView extends BaseView {
  @inject(ViewManager) viewManager: ViewManager;
  override view = AgentChatComponent;

  @prop()
  chat?: ChatView;

  initializing?: Promise<void>;
  defaultSessionCreating?: Promise<void>;
  ready: Promise<void>;
  protected readyDeferred: Deferred<void> = new Deferred();

  constructor() {
    super();
    this.ready = this.readyDeferred.promise;
  }

  disposed?: boolean | undefined;

  handleUploadImage = async (
    event: any,
    update: (params: {
      images: { key: string; url: string }[] | undefined;
      videos: { key: string; url: string; thumb: string }[] | undefined;
    }) => void,
  ) => {
    const files = event.target.files;

    if (!files) {
      return;
    }
    if (files && files.length > 10) {
      message.warning('最多支持上传10张图片, 请重新选择');
      return;
    }

    const selectedFiles = Object.values(files);

    const inValidFileType = selectedFiles.filter(
      (file: any) => !isAllowedImageType(file.type),
    );

    if (inValidFileType && inValidFileType.length > 0) {
      message.error(
        `暂不支持 ${inValidFileType.concat(
          '/',
        )} 格式的图片文件，支持的图片格式有: '.bmp', '.jpg','.jpeg', '.png', '.gif', '.webp'`,
      );
      return;
    }

    Promise.all(
      selectedFiles.map(async (file: any) => {
        const { name } = file;

        const extension = getExtension(name);

        const newFileName = `${uuidv4()}.${extension}`;
        // 文件名有中文的话 返回的 视频或图片因为转义的原因可能无法访问，在上传前统一处理文件名
        const newFile = new File([file], newFileName, {
          type: file.type,
          lastModified: file.lastModified,
        });

        const imageUrl = await uploadFileAsBase64(newFile);
        if (imageUrl) {
          return { url: imageUrl, key: newFileName };
        } else {
          throw new Error();
        }
      }),
    )
      .then((images) => {
        message.success('图片上传成功');
        update({ images, videos: undefined });
        return images;
      })
      .catch(() => {
        message.error('图片上传失败');
      });
  };

  protected reset = () => {
    this.initializing = undefined;
    this.defaultSessionCreating = undefined;
    this.readyDeferred = new Deferred();
    this.ready = this.readyDeferred.promise;
  };

  protected async initialize() {
    const chatView = await this.viewManager.getOrCreateView(ChatView, {
      id: 'langchain',
      stream: true,
    });
    chatView.Greeting = Greeting;
    chatView.allowUploadingImage = true;
    chatView.handleUploadImage = this.handleUploadImage;
    this.chat = chatView;
  }

  override onViewMount(): void {
    this.initialize();
  }
}
