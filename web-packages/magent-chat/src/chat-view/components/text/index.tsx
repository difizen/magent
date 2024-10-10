import './index.less';

export const TextMessage = ({ content }: any) => {
  return (
    <div className={`text-message-text`}>
      <span className={`text-message-textPop`}>{content}</span>
    </div>
  );
};
