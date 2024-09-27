import { useFlowsManagerStore } from '@flow/stores/flowsManagerStore.js';
import classNames from '@flow/utils/classnames.js';
import {
  RiColorFilterLine,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiFullscreenLine,
  RiZoomInLine,
  RiZoomOutLine,
  RiExpandUpDownLine,
  RiContractUpDownLine,
} from '@remixicon/react';
import { useReactFlow, useViewport } from '@xyflow/react';
import { Divider } from 'antd';
import type { HTMLAttributes } from 'react';

import { Popup } from '../AIBasic/Popup/index.js';
import { TipPopup } from '../AIBasic/TipPopup/index.js';

interface HoverBlockProps extends HTMLAttributes<HTMLDivElement> {
  tooltip?: React.ReactNode;
  disabled?: boolean;
}

export const HoverBlock = (props: HoverBlockProps) => {
  const { children, className, tooltip, disabled = false } = props;

  const Inner = (
    <div
      {...props}
      className={classNames(
        'flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-black/5',
        className,
        disabled ? 'cursor-not-allowed opacity-50' : '',
      )}
    >
      {children}
    </div>
  );

  if (!tooltip) {
    return Inner;
  }

  return <TipPopup title={tooltip}>{Inner}</TipPopup>;
};

const zoomOptions: ('Fit' | number)[] = [25, 50, 100, 125, 'Fit'];

export const Operator = () => {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  const { zoom } = useViewport();

  const handleZoom = (type: 'Fit' | number) => {
    if (typeof type === 'number') {
      zoomTo(type / 100);
      return;
    }

    fitView();
  };

  const undo = useFlowsManagerStore((state) => state.undo);
  const redo = useFlowsManagerStore((state) => state.redo);
  const hasPast = useFlowsManagerStore((state) => state.hasPast);

  const hasFuture = useFlowsManagerStore((state) => state.hasFuture);
  const autoLayout = useFlowsManagerStore((state) => state.autoLayout);
  const setNodesFolded = useFlowsManagerStore((state) => state.setNodesFolded);

  return (
    <div className="flex items-center mt-1 gap-2 absolute left-4 bottom-4 z-[9]">
      <div className="p-0.5 h-9 cursor-pointer text-[13px] text-gray-500 font-medium rounded-lg bg-white shadow-lg border-[0.5px] border-gray-100 w-[100%]">
        <div className="flex items-center justify-between h-8 rounded-lg">
          <HoverBlock
            onClick={(e) => {
              e.stopPropagation();
              zoomOut();
            }}
          >
            <RiZoomOutLine className="w-4 h-4" />
          </HoverBlock>
          <Popup
            panel={
              <>
                {zoomOptions.map((n) => (
                  <div
                    key={n}
                    onClick={() => handleZoom(n)}
                    className="flex items-center justify-between px-3 h-8 rounded-lg hover:bg-gray-50 cursor-pointer text-[13px] text-gray-600"
                  >
                    {typeof n === 'number' ? n + '%' : '自适应'}
                  </div>
                ))}
              </>
            }
            panelProps={{ anchor: { to: 'top', gap: 6 } }}
          >
            <HoverBlock className="w-10">{Math.round(zoom * 100)}%</HoverBlock>
          </Popup>

          <HoverBlock
            onClick={(e) => {
              e.stopPropagation();
              zoomIn();
            }}
          >
            <RiZoomInLine className="w-4 h-4" />
          </HoverBlock>
          <HoverBlock
            onClick={(e) => {
              e.stopPropagation();
              fitView();
            }}
          >
            <RiFullscreenLine className="w-4 h-4" />
          </HoverBlock>
        </div>
      </div>
      <div className="p-0.5 h-9 cursor-pointer text-[13px] text-gray-500 font-medium rounded-lg bg-white shadow-lg border-[0.5px] border-gray-100 w-[100%]">
        <div className="flex items-center justify-between h-8 rounded-lg">
          <HoverBlock
            tooltip="撤销"
            onClick={(e) => {
              e.stopPropagation();
              undo();
            }}
            disabled={!hasPast()}
          >
            <RiArrowGoBackLine className="w-4 h-4" />
          </HoverBlock>
          <HoverBlock
            tooltip="重做"
            disabled={!hasFuture()}
            onClick={(e) => {
              e.stopPropagation();
              redo();
            }}
          >
            <RiArrowGoForwardLine className="w-4 h-4" />
          </HoverBlock>
          <Divider type="vertical" className="mx-1" />
          <HoverBlock
            tooltip="折叠节点"
            onClick={(e) => {
              e.stopPropagation();
              setNodesFolded(true);
            }}
          >
            <RiContractUpDownLine className="w-4 h-4" />
          </HoverBlock>
          <HoverBlock
            tooltip="展开节点"
            onClick={(e) => {
              e.stopPropagation();
              setNodesFolded(false);
            }}
          >
            <RiExpandUpDownLine className="w-4 h-4" />
          </HoverBlock>
          <Divider type="vertical" className="mx-1" />
          <HoverBlock
            tooltip="自动布局"
            onClick={(e) => {
              e.stopPropagation();
              autoLayout();
            }}
          >
            <RiColorFilterLine className="w-4 h-4" />
          </HoverBlock>
        </div>
      </div>
    </div>
  );
};
