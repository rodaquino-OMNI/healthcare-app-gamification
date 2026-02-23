/* eslint-disable @typescript-eslint/no-empty-interface */
import 'styled-components';
import { Theme } from './themes/base.theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    breakpoints?: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }

  export type ThemeProps<T = DefaultTheme> = {
    theme: T;
  };

  export type ThemeType = DefaultTheme;

  export type StyledProps<P> = P & { theme: DefaultTheme };
}
