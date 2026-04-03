import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { shadows } from 'design-system/tokens/shadows';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import { createGlobalStyle } from 'styled-components';

/**
 * Application theme configuration for styled-components ThemeProvider.
 * Uses design system tokens so styled components can access them via props.theme.
 */
export const theme = {
    colors,
    shadows,
    spacing,
    borderRadius,
    typography,
};

/**
 * Global styles applied across the entire application.
 */
export const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background-color: #F8F9FA;
        color: #212529;
        line-height: 1.5;
    }
`;

export type Theme = typeof theme;
