import {
  view,
  singleton,
  BaseView,
  ViewInstance,
  useInject,
  inject,
  prop,
  useObserve,
  ViewRender,
  ViewManager,
} from '@difizen/mana-app';
import type { RadioChangeEvent } from 'antd';
import { Button, Radio, Spin } from 'antd';
import { forwardRef } from 'react';

export const LibroExecutionComponent = forwardRef<HTMLDivElement>(
  function LibroExecutionComponent(props, ref) {
    return null;
  },
);

@singleton()
@view('libro-execution-view')
export class LibroExecutionView extends BaseView {
  override view = LibroExecutionComponent;
}
