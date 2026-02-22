import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { baseTheme, healthTheme, careTheme, planTheme, darkTheme } from '../src/themes';

const themeMap: Record<string, typeof baseTheme> = {
  health: healthTheme,
  care: careTheme,
  plan: planTheme,
};

const preview: Preview = {
  globalTypes: {
    journey: {
      description: 'Journey theme',
      toolbar: {
        title: 'Journey',
        icon: 'paintbrush',
        items: [
          { value: 'health', title: 'Health' },
          { value: 'care', title: 'Care' },
          { value: 'plan', title: 'Plan' },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Color mode',
      toolbar: {
        title: 'Mode',
        icon: 'sun',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    journey: 'health',
    mode: 'light',
  },
  decorators: [
    (Story, context) => {
      const journey = context.globals.journey || 'health';
      const mode = context.globals.mode || 'light';
      const theme = mode === 'dark' ? darkTheme : (themeMap[journey] || healthTheme);
      return (
        <ThemeProvider theme={theme}>
          <div style={{ padding: '1rem' }}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
