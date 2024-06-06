import { BaseView, view } from '@difizen/mana-app';
import { transient } from '@difizen/mana-app';
import { forwardRef } from 'react';

export const LibroAppComponent = forwardRef(function LibroAppComponent(props, ref) {
  return <div></div>;
});

@transient()
@view('chat-bot-app')
export class AppView extends BaseView {
  override view = LibroAppComponent;
}
