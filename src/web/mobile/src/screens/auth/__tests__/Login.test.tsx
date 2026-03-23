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

jest.mock('react-hook-form', () => ({
    useForm: () => ({
        watch: jest.fn(() => ''),
        handleSubmit: jest.fn((fn: unknown) => fn),
        setError: jest.fn(),
        formState: {
            errors: {},
            isSubmitting: false,
            touchedFields: {},
        },
    }),
}));

jest.mock('zod', () => ({
    z: {
        object: jest.fn(() => ({})),
        string: jest.fn(() => ({
            min: jest.fn().mockReturnThis(),
            email: jest.fn().mockReturnThis(),
        })),
    },
}));

jest.mock('@hookform/resolvers/zod', () => ({
    zodResolver: jest.fn(() => jest.fn()),
}));

jest.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({
        signIn: jest.fn(),
        signOut: jest.fn(),
    }),
}));

jest.mock('src/web/shared/constants/routes', () => ({
    MOBILE_AUTH_ROUTES: {
        LOGIN: 'Login',
        REGISTER: 'Register',
        FORGOT_PASSWORD: 'ForgotPassword',
    },
}));

jest.mock('src/web/design-system/src/components/Input/Input', () => ({
    Input: (props: any) => {
        const { View } = require('react-native');
        return <View testID={props.testID || 'mock-input'} />;
    },
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
    Button: ({ children, ...props }: any) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity testID={props.testID || 'mock-button'} onPress={props.onPress}>
                <Text>{children}</Text>
            </TouchableOpacity>
        );
    },
}));

jest.mock('../components/shared/LoadingIndicator', () => ({
    LoadingIndicator: () => null,
}));

jest.mock('src/web/design-system/src/primitives/Box/Box', () => ({
    Box: ({ children }: any) => {
        const { View } = require('react-native');
        return <View>{children}</View>;
    },
}));

jest.mock('src/web/design-system/src/primitives/Text/Text', () => ({
    Text: ({ children }: any) => {
        const { Text: RNText } = require('react-native');
        return <RNText>{children}</RNText>;
    },
}));

jest.mock('../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        semantic: { error: '#f00' },
        brand: { primary: '#00f' },
        journeys: { health: { primary: '#0f0' } },
    },
}));

jest.mock('../../../../../design-system/src/tokens/typography', () => ({
    typography: { fontSize: {}, fontWeight: {}, fontFamily: {} },
}));

jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
    spacing: {},
    spacingValues: {},
}));

import LoginScreen from '../Login';

describe('LoginScreen', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<LoginScreen />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the AUSTA brand name', () => {
        const { getByText } = render(<LoginScreen />);
        expect(getByText('AUSTA')).toBeTruthy();
    });

    it('displays login title translation key', () => {
        const { getByText } = render(<LoginScreen />);
        expect(getByText('auth.login.title')).toBeTruthy();
    });
});
