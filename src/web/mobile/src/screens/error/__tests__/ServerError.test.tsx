import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

jest.mock('../../../../design-system/src/tokens/colors', () => ({
    colors: {
        brand: { primary: '#00f' },
        gray: { 20: '#eee', 30: '#ddd', 50: '#888' },
        semantic: { errorBg: '#ffe6e6', infoBg: '#e6f0ff', success: '#0f0', error: '#f00' },
        journeys: {
            health: { primary: '#0f0', background: '#e8ffe8' },
            care: { primary: '#f90', background: '#fff3e0' },
            plan: { primary: '#90f', background: '#f3e0ff' },
        },
        neutral: { white: '#fff', black: '#000' },
    },
}));

jest.mock('../../../../design-system/src/tokens/typography', () => ({
    typography: {
        fontFamily: { heading: 'System', body: 'System' },
        fontWeight: { bold: '700', semiBold: '600', medium: '500', regular: '400' },
        fontSize: {
            'heading-xl': '24px',
            'heading-md': '20px',
            'text-md': '16px',
            'text-sm': '14px',
            'text-xs': '12px',
        },
    },
    fontSizeValues: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24 },
}));

jest.mock('../../../../design-system/src/tokens/spacing', () => ({
    spacing: {
        '4xs': '1px',
        '3xs': '2px',
        '2xs': '4px',
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
    },
    spacingValues: {
        '4xs': 1,
        '3xs': 2,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 20,
        xl: 24,
        '2xl': 32,
    },
}));

jest.mock('../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadius: { xs: '4px', sm: '4px', md: '8px', lg: '12px', full: '9999px' },
    borderRadiusValues: { xs: 4, sm: 4, md: 8, lg: 12, full: 9999 },
}));

jest.mock('../../../../design-system/src/tokens/sizing', () => ({
    sizing: { component: { sm: '32px', md: '40px', lg: '48px', xl: '64px' } },
    sizingValues: { component: { sm: 32, md: 40, lg: 48, xl: 64 } },
}));

jest.mock('../../constants/routes', () => ({
    ROUTES: { HELP_CONTACT: 'HelpContact' },
}));

import { ServerError } from '../ServerError';

describe('ServerError', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<ServerError />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the server error title testID', () => {
        const { getByTestId } = render(<ServerError />);
        expect(getByTestId('server-error-title')).toBeTruthy();
    });

    it('displays the retry button', () => {
        const { getByTestId } = render(<ServerError />);
        expect(getByTestId('server-error-retry')).toBeTruthy();
    });

    it('displays the support button', () => {
        const { getByTestId } = render(<ServerError />);
        expect(getByTestId('server-error-support')).toBeTruthy();
    });

    it('calls onRetry when retry is pressed', () => {
        const onRetry = jest.fn();
        const { getByTestId } = render(<ServerError onRetry={onRetry} />);
        getByTestId('server-error-retry').props.onPress();
        expect(onRetry).toHaveBeenCalledTimes(1);
    });
});
