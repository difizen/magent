import { Controls, MiniMap } from '@xyflow/react';
import React from 'react';

export const FlowController = () => {
  return (
    <>
      <MiniMap
        style={{
          width: 102,
          height: 72,
        }}
        className="!absolute !left-4 !bottom-14 z-[9] !m-0 !w-[102px] !h-[72px] !border-[0.5px] !border-black/8 !rounded-lg !shadow-lg"
      />

      <Controls orientation={'horizontal'}></Controls>
    </>
  );
};
