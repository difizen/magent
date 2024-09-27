import type { PopoverPanelProps } from '@headlessui/react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

export const Popup = (props: {
  children: React.ReactNode;
  panel: React.ReactNode;
  panelProps?: PopoverPanelProps;
}) => {
  const { children, panelProps, panel } = props;
  return (
    <Popover className="relative">
      <PopoverButton>{children}</PopoverButton>
      <PopoverPanel className="flex flex-col" {...panelProps}>
        {
          <div className="z-[9] p-1 bg-white rounded-lg shadow-sm border-[0.5px] border-gray-200 w-[116px]">
            {panel}
          </div>
        }
      </PopoverPanel>
    </Popover>
  );
};
