import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'AUSTA Design System',
  brandUrl: '/',
  colorPrimary: '#0066CC',
  colorSecondary: '#00C3F7',
  appBg: '#F8F9FA',
  appContentBg: '#FFFFFF',
  appBorderColor: '#E5E7EB',
  fontBase: '"Plus Jakarta Sans", sans-serif',
});

addons.setConfig({ theme });
