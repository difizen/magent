import type { ColorRegistry, VariableRegistry } from '@difizen/mana-app';
import { ColorContribution, VariableContribution } from '@difizen/mana-app';
import { singleton } from '@difizen/mana-app';

@singleton({ contrib: [ColorContribution, VariableContribution] })
export class ReactFlowThemeContribution
  implements ColorContribution, VariableContribution
{
  registerVariables(vars: VariableRegistry) {
    vars.register(
      ...[
        // --xy-edge-stroke-width
        {
          id: 'xy.edge.stroke.width',
          prefix: '',
          defaults: {
            dark: '2px',
            light: '2px',
          },
          description: '',
        },
      ],
    );
  }
  registerColors(colors: ColorRegistry): void {
    colors.register(
      ...[
        // --xy-edge-stroke-selected
        // --xy-edge-stroke
        {
          id: 'xy.edge.stroke.selected',
          prefix: '',
          defaults: {
            dark: '#1677FF',
            light: '#1677FF',
          },
          description: '',
        },
        {
          id: 'xy.edge.stroke',
          prefix: '',
          defaults: {
            dark: '#3b82f6',
            light: '#3b82f6',
          },
          description: '',
        },
      ],
    );
  }
}
