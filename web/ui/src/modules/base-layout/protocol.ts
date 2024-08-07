import { View } from '@difizen/mana-app';
import type { ReactNode } from 'react';

export interface NavigatablePage extends View {
  goBack: () => void;
  pageTitle: () => ReactNode;
}

export const NavigatablePageType = {
  is(data: View): data is NavigatablePage {
    return data && View.is(data) && 'goBack' in data && 'pageTitle' in data;
  },
};
