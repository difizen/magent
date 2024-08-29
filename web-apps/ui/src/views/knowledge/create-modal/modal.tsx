import type { ModalItem, ModalItemProps } from '@difizen/mana-app';
import { useInject, useMount } from '@difizen/mana-app';
import { Form, Input, message, Modal } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { history } from 'umi';

import { KnowledgeManager } from '../../../modules/knowledge/knowledge-manager.js';
import { KnowledgeSpace } from '../../../modules/knowledge/knowledge-space.js';
import { KnowledgeModalId } from '../protocol.js';
import { KnowledgeView } from '../view.js';

export const KnowledgeModalComponent = (
  props: ModalItemProps<{ type: 'create' | 'edit'; knowledge_id?: string }>,
) => {
  const knowledgeSpace = useInject(KnowledgeSpace);
  const knowledgeManager = useInject(KnowledgeManager);
  const instance = useInject(KnowledgeView);

  const { visible, close, data } = props;

  const [form] = Form.useForm();

  const [nameValue, setName] = useState<string | undefined>(undefined);
  const [idValue, setId] = useState<string | undefined>(undefined);

  useMount(() => {
    knowledgeSpace.update();
  });

  const strategiesValues = useMemo(
    () => ({
      create: {
        title: '创建知识库',
        okText: '创建',
      },
      edit: {
        title: '编辑知识库',
        okText: '确定',
      },
    }),
    [],
  );

  const strategiesMethod = useMemo(
    () => ({
      create: async () => {
        const formValues = form.getFieldsValue();
        const id = await knowledgeManager.createKnowledge(
          formValues.nickname,
          formValues.description,
        );
        if (id) {
          setId(id);
          message.success('创建成功');
          history.push(`/portal/knowledge/${id}/upload`);
        }
        close();
      },
      edit: async () => {
        if (!data?.knowledge_id) {
          return;
        }
        const formValues = form.getFieldsValue();
        const id = await knowledgeManager.updateKnowledge({
          id: data.knowledge_id,
          nickname: formValues.nickname,
          description: formValues.description,
        });
        if (id) {
          setId(id);
          message.success('更新成功');
          await instance.update();
        }
        close();
      },
    }),
    [close, data, form, instance, knowledgeManager],
  );

  const submit = useCallback(async () => {
    const method = strategiesMethod[data?.type || 'create'];
    if (method) {
      await method();
    } else {
      console.error('Invalid type');
    }
  }, [data, strategiesMethod]);

  return (
    <Modal
      className="magent-knowledge-create-modal-form"
      open={visible}
      width={640}
      title={strategiesValues[data?.type || 'create'].title}
      onCancel={() => close()}
      cancelText="取消"
      onOk={() => submit()}
      okText={strategiesValues[data?.type || 'create'].okText}
    >
      <Form
        layout="vertical"
        form={form}
        onFieldsChange={(changed) => {
          const idChanged = changed.find(
            (item) =>
              item.name instanceof Array &&
              item.name.length === 1 &&
              item.name[0] === 'nickname',
          );
          if (idChanged && idChanged.validated) {
            setName(idChanged.value);
          }
        }}
      >
        <Form.Item required label={'名称'} name="nickname">
          <Input />
        </Form.Item>
        {/* <Form.Item name="avatar" label="头像">
          <AvatarUpload
            disabled={!nameValue}
            data={(file) => {
              const extname = path.extname(file.name);
              const filename = `${nameValue}${extname}`;
              return {
                file,
                filename,
              };
            }}
            AvatarRender={UploadButton}
          />
        </Form.Item> */}
        <Form.Item label="描述" name="description">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const KnowledgeModal: ModalItem = {
  id: KnowledgeModalId,
  component: KnowledgeModalComponent,
};
