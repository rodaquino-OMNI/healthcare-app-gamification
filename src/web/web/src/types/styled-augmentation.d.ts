// Module augmentation for styled-components DefaultTheme
// Mirrors design-system/src/styled.d.ts so the web app sees the full Theme shape.
// The web tsconfig include pattern (**/*.ts) is relative to src/web/web/,
// so it cannot see ../design-system/src/styled.d.ts directly.
import 'styled-components';
import type { Theme } from 'design-system/themes/base.theme';

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
