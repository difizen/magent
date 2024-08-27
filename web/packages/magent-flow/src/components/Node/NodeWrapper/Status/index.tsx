import { classNames } from '@/utils/basic';
import { Popover, Tag } from 'antd';
import React from 'react';

export enum RunStatusEnum {
  Success = 'success',
  Processing = 'processing',
  Warning = 'warning',
  Error = 'error',
}

export const RunStatusMap = {
  [RunStatusEnum.Success]: {
    Label: '运行成功',
    Color: 'green',
    Cssclsname: 'bg-green-50',
  },
  [RunStatusEnum.Processing]: {
    Label: '运行中',
    Color: 'blue',
    Cssclsname: 'bg-blue-50',
  },
  [RunStatusEnum.Warning]: {
    Label: '警告',
    Color: 'yellow',
    Cssclsname: 'bg-yellow-50',
  },
  [RunStatusEnum.Error]: {
    Label: '运行失败',
    Color: 'red',
    Cssclsname: 'bg-red-50',
  },
};

export interface RunResStatus {
  status: RunStatusEnum;
  runDuration: number;
  runInput?: Record<string, string>;
  runOutput?: Record<string, string>;
}

export const NodeStatus = (props: RunResStatus) => {
  const { status, runDuration } = props;

  const StatusInfo = RunStatusMap[status];
  return (
    <div
      className={classNames(
        StatusInfo.Cssclsname,
        'h-10 flex items-center justify-between px-3',
      )}
    >
      <div className="flex items-center gap-2 text-xs">
        {StatusInfo.Label}

        <Tag color="success">{`${runDuration}s`}</Tag>
      </div>
      <Popover
        placement="right"
        trigger={'click'}
        className="nocopy nodelete nodrag noundo"
        content={
          <>
            <div>输入：</div>
            <div>输出：</div>
          </>
        }
      >
        <span className="text-xs text-blue-500 cursor-pointer">运行结果</span>
      </Popover>
    </div>
  );
};
