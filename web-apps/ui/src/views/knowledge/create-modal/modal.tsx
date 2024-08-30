import type { ModalItem, ModalItemProps } from '@difizen/mana-app';
import { useInject, useMount } from '@difizen/mana-app';
import { Form, Input, message, Modal } from 'antd';
import { useCallback, useMemo } from 'react';
import { history } from 'umi';

import { RequestHelper } from '@/modules/axios-client/request.js';

import { KnowledgeManager } from '../../../modules/knowledge/knowledge-manager.js';
import { KnowledgeSpace } from '../../../modules/knowledge/knowledge-space.js';
import { KnowledgeModalId } from '../protocol.js';
import { KnowledgeView } from '../view.js';

import './index.less';

export const KnowledgeModalComponent = (
  props: ModalItemProps<{ type: 'create' | 'edit'; knowledge_id?: string }>,
) => {
  const knowledgeSpace = useInject(KnowledgeSpace);
  const knowledgeManager = useInject(KnowledgeManager);
  const instance = useInject(KnowledgeView);
  const req = useInject(RequestHelper);

  const { visible, close, data } = props;

  const [form] = Form.useForm();

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
        const id = await knowledgeManager.createKnowledge(formValues);
        if (id) {
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
      className="magent-knowledge-creation-modal"
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
        className="magent-knowledge-creation-modal-form"
        form={form}
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
                  type: 'knowledge',
                });
                if (res.status !== 200 || res.data === false) {
                  throw new Error(`${value} 已存在，请更换其他 id`);
                }
              },
            }),
          ]}
        >
          <Input placeholder="给知识一个独一无二的 id" />
        </Form.Item>
        <Form.Item required label={'名称'} name="nickname">
          <Input placeholder="给知识一个名字" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input placeholder="描述一下它" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const KnowledgeModal: ModalItem = {
  id: KnowledgeModalId,
  component: KnowledgeModalComponent,
};
