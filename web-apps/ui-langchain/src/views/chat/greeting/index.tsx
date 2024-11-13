import type { ChatView } from '@difizen/magent-chat';
import { useInject, ViewInstance } from '@difizen/mana-app';
import './index.less';

const prefixCls = 'magent-langchain-chat-greeting';

const demos = [
  { id: 'demo-1', title: '大模型能做什么？', content: '大模型能做什么？' },
  { id: 'demo-2', title: '需要多少训练数据？', content: '需要多少训练数据？' },
  { id: 'demo-3', title: '模型有多大？', content: '模型有多大？' },
  { id: 'demo-4', title: '哪些领域能用？', content: '哪些领域能用？' },
  { id: 'demo-5', title: '多久更新一次？', content: '多久更新一次？' },
  { id: 'demo-6', title: '性能如何评估？', content: '性能如何评估？' },
  { id: 'demo-7', title: '如何确保安全？', content: '如何确保安全？' },
  { id: 'demo-8', title: '支持哪些语言？', content: '支持哪些语言？' },
  { id: 'demo-9', title: '如何保护隐私？', content: '如何保护隐私？' },
  { id: 'demo-10', title: '未来发展趋势？', content: '未来发展趋势？' },
];

export const Greeting = () => {
  const instance = useInject<ChatView>(ViewInstance);

  return (
    <div className={`${prefixCls}`}>
      <div className={`${prefixCls}-greet`}>
        <div className={`${prefixCls}-greet-title`}>你好，我是AI Chat Bot</div>
        <div className={`${prefixCls}-greet-content`}>
          切勿输入公司内部信息，包括不限于业务数据、目标策略、个人信息等。
        </div>
      </div>
      <div className={`${prefixCls}-demos`}>
        <div className={`${prefixCls}-demos-title`}>💡 试试这样问</div>
        <div className={`${prefixCls}-demos-container`}>
          {demos.map((demo) => (
            <div
              className={`${prefixCls}-demos-demo`}
              key={demo.id}
              onClick={() => {
                instance.sendMessage(demo.content);
              }}
            >
              {demo.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
