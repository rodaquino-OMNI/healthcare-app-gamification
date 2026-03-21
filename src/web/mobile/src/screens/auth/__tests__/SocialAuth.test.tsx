import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

jest.mock('styled-components/native', () => {
    const RN = require('react-native');
    const styled = (Component: any) => (_strs: any) => (props: any) => <Component {...props} />;
    styled.View = (_strs: any) => (props: any) => <RN.View {...props} />;
    styled.Text = (_strs: any) => (props: any) => <RN.Text {...props} />;
    styled.SafeAreaView = (_strs: any) => (props: any) => <RN.View {...props} />;
    styled.TouchableOpacity = (_strs: any) => (props: any) => <RN.TouchableOpacity {...props} />;
    styled.ScrollView = (_strs: any) => (props: any) => <RN.ScrollView {...props} />;
    return {
        __esModule: true,
        default: styled,
        useTheme: () => ({
            colors: {
                background: { default: '#fff' },
                text: { default: '#000', muted: '#888', subtle: '#ccc', onBrand: '#fff' },
            },
        }),
    };
});

jest.mock('../../constants/routes', () => ({
    ROUTES: {
        SETTINGS_PRIVACY_POLICY: 'SettingsPrivacyPolicy',
        SETTINGS_TERMS: 'SettingsTerms',
    },
}));

jest.mock('src/web/shared/constants/routes', () => ({
    MOBILE_AUTH_ROUTES: {
        LOGIN: 'Login',
        REGISTER: 'Register',
    },
}));

jest.mock('../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        semantic: { error: '#f00' },
        brand: { primary: '#00f' },
        gray: { 20: '#eee', 30: '#ddd' },
        neutral: { white: '#fff', gray900: '#111', black: '#000' },
    },
}));

jest.mock('../../../../../design-system/src/tokens/typography', () => ({
    typography: { fontSize: {}, fontWeight: {}, fontFamily: { heading: 'System', body: 'System' } },
}));

jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '40px', '3xl': '48px' },
}));

jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadius: { sm: '4px', md: '8px' },
}));

jest.mock('../../../../../design-system/src/tokens/sizing', () => ({
    sizing: { icon: { sm: '20px' } },
}));

import SocialAuth from '../SocialAuth';

describe('SocialAuth', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<SocialAuth />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays social auth title', () => {
        const { getByText } = render(<SocialAuth />);
        expect(getByText('auth.socialAuth.title')).toBeTruthy();
    });

    it('renders social login buttons', () => {
        const { getByTestId } = render(<SocialAuth />);
        expect(getByTestId('social-auth-google')).toBeTruthy();
        expect(getByTestId('social-auth-apple')).toBeTruthy();
        expect(getByTestId('social-auth-facebook')).toBeTruthy();
    });

    it('renders LGPD consent checkbox', () => {
        const { getByTestId } = render(<SocialAuth />);
        expect(getByTestId('lgpd-consent-checkbox')).toBeTruthy();
    });
});
