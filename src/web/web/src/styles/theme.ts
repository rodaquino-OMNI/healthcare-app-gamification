import { createGlobalStyle } from 'styled-components';

/**
 * Application theme configuration for styled-components ThemeProvider.
 */
export const theme = {
    colors: {
        primary: '#0ACF83',
        secondary: '#00B8D9',
        background: '#F8F9FA',
        text: '#212529',
        error: '#DC3545',
        warning: '#FFC107',
        success: '#28A745',
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '9999px',
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: {
            sm: '12px',
            md: '14px',
            lg: '16px',
            xl: '20px',
        },
    },
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
