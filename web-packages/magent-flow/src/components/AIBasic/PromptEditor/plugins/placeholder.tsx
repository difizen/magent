import classNames from 'classnames';
import { memo } from 'react';

const Placeholder = ({
  compact,
  value,
  className,
}: {
  compact?: boolean;
  value?: string;
  className?: string;
}) => {
  return (
    <div
      className={classNames(
        className,
        'absolute top-0 left-0 h-full w-full text-sm text-gray-300 select-none pointer-events-none p-3',
        compact ? 'leading-5 text-[13px]' : 'leading-6 text-sm',
      )}
    >
      {value || "在这里写你的提示词，输入'{' 插入变量"}
    </div>
  );
};

export default memo(Placeholder);
