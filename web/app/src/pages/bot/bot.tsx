import { view, singleton, BaseView } from '@difizen/mana-app';
import { forwardRef } from 'react';

export const LibroExecutionComponent = forwardRef<HTMLDivElement>(
  function LibroExecutionComponent() {
    return null;
  },
);

@singleton()
@view('libro-execution-view')
export class LibroExecutionView extends BaseView {
  override view = LibroExecutionComponent;
}
