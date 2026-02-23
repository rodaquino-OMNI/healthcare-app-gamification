/**
 * Theme hook that provides access to the current theme.
 * Wraps styled-components useTheme with proper typing.
 */

import { useTheme as useStyledTheme } from 'styled-components/native';

/**
 * Custom hook that provides access to the current theme.
 * @returns Object containing the theme and toggleTheme function
 */
export function useTheme() {
  const theme = useStyledTheme() as any;

  return {
    theme: {
      colors: {
        journey: {
          health: theme?.colors?.journey?.health || '#4CAF50',
          care: theme?.colors?.journey?.care || '#2196F3',
          plan: theme?.colors?.journey?.plan || '#9C27B0',
        },
        brand: {
          primary: theme?.colors?.brand?.primary || '#1976D2',
        },
        background: {
          default: theme?.colors?.background?.default || '#FFFFFF',
        },
        text: {
          primary: theme?.colors?.text?.primary || '#212121',
          secondary: theme?.colors?.text?.secondary || '#757575',
        },
        ...theme?.colors,
      },
      ...theme,
    },
    toggleTheme: () => {
      // Theme toggle is handled by ThemeContext
    },
  };
}

export default useTheme;
