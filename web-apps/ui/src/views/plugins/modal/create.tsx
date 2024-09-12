import path from 'path';

import type { ModalItem, ModalItemProps } from '@difizen/mana-app';
import { useInject } from '@difizen/mana-app';
import type { FormInstance } from 'antd';
import { Button, Form, Input, Space } from 'antd';
import { Modal } from 'antd';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { AvatarUpload } from '@/components/avatar-upload/index.js';
import { RequestHelper } from '@/modules/axios-client/request.js';
import { PluginIcon } from '@/modules/plugin/icon/index.js';
import './index.less';
import { PluginManager } from '@/modules/plugin/plugin-manager.js';

export const PluginCreateModalId = 'magent-plugin-creation';
interface SubmitButtonProps {
  form: FormInstance;
}

const SubmitButton: React.FC<PropsWithChildren<SubmitButtonProps>> = (
  props: PropsWithChildren<SubmitButtonProps>,
) => {
  const { form, children } = props;
  const [submittable, setSubmittable] = useState<boolean>(false);

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button
      onClick={() => form.submit()}
      type="primary"
      htmlType="submit"
      disabled={!submittable}
    >
      {children}
    </Button>
  );
};

const UploadButton = (props: { imageUrl?: string }) => {
  const { imageUrl } = props;
  return imageUrl ? (
    <PluginIcon
      className="magent-agents-modal-avatar-uploader-content-icon"
      data={{ avatar: imageUrl }}
    />
  ) : (
    <PluginIcon className="magent-agents-modal-avatar-uploader-content-icon magent-agents-modal-avatar-uploader-content-default-icon" />
  );
};

export const PluginModalComponent = (props: ModalItemProps<any>) => {
  const pluginManager = useInject(PluginManager);
  const req = useInject(RequestHelper);
  const { visible, close } = props;
  const [form] = Form.useForm<{
    id: string;
    avatar?: string;
    nickname: string;
    description?: string;
    openapi_desc: string;
  }>();
  const idValue = Form.useWatch('id', form);

  return (
    <Modal
      className={`${PluginCreateModalId}`}
      open={visible}
      onCancel={() => close()}
      width={640}
      title="新建插件"
      footer={
        <Space>
          <Button htmlType="reset" onClick={close}>
            取消
          </Button>
          <SubmitButton form={form}>确认</SubmitButton>
        </Space>
      }
    >
      <Form
        className={`${PluginCreateModalId}-form`}
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={async (values) => {
          const meta = {
            id: values.id,
            nickname: values.nickname,
            avatar: values.avatar,
            description: values.description,
            openapi_desc: values.openapi_desc,
            toolset: [],
          };
          const res = await pluginManager.create(meta);
          if (res.status === 200) {
            close();
            pluginManager.updatePublic();
          }
        }}
        onFinishFailed={console.error}
        initialValues={{ plannerId: 'rag_planner' }}
      >
        <Form.Item
          name="id"
          label="id"
          rules={[
            { required: true },
            () => ({
              async validator(_, value) {
                const res = await req.get<boolean>(`/api/v1/common/is_id_unique`, {
                  id: value,
                  type: 'tool',
                });
                if (res.status !== 200 || res.data === false) {
                  throw new Error(`${value} 已存在，请更换其他 id`);
                }
              },
            }),
          ]}
        >
          <Input placeholder="给插件一个独一无二的 id" />
        </Form.Item>
        <Form.Item name="nickname" label="名称" rules={[{ required: true }]}>
          <Input placeholder="给你的插件起个名字" />
        </Form.Item>

        <Form.Item
          name="openapi_desc"
          label="OpenAPI Schema"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={5} placeholder="通过 OpenAPI Schema 导入工具" />
        </Form.Item>
        <Form.Item name="avatar" label="头像">
          <AvatarUpload
            disabled={!idValue}
            data={(file) => {
              const extname = path.extname(file.name);
              const filename = `${idValue}${extname}`;
              return {
                file,
                filename,
              };
            }}
            AvatarRender={UploadButton}
          />
        </Form.Item>
        <Form.Item name="description" label="描述" rules={[]}>
          <Input.TextArea placeholder="介绍一下你的插件吧" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const PluginCreateModal: ModalItem = {
  id: PluginCreateModalId,
  component: PluginModalComponent,
};
