/**
 * Augments styled-components DefaultTheme so that theme interpolations
 * in styled-components/native tagged templates (e.g. `${({ theme }) => theme.colors...}`)
 * are properly typed.
 *
 * styled-components/native re-exports DefaultTheme from 'styled-components',
 * so augmenting the base module covers both.
 */
import 'styled-components';
import 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';

declare module 'styled-components' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}

declare module 'styled-components/native' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}
