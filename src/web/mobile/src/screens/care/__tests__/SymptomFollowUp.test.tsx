import React from 'react';
import { render } from '@testing-library/react-native';

// Navigation mock
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn(), dispatch: jest.fn(), setOptions: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: (cb: () => void) => cb(),
}));

// i18n mock
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

// styled-components mock
jest.mock('styled-components/native', () => {
    const RN = jest.requireActual('react-native');
    return {
        __esModule: true,
        default: {
            View: RN.View,
            Text: RN.Text,
            TouchableOpacity: RN.TouchableOpacity,
            ScrollView: RN.ScrollView,
            Image: RN.Image,
            TextInput: RN.TextInput,
            FlatList: RN.FlatList,
            SafeAreaView: RN.SafeAreaView,
        },
        useTheme: () => ({
            colors: {
                primary: { main: '#007AFF', light: '#4DA3FF', dark: '#0055CC' },
                background: { default: '#fff', paper: '#f5f5f5', subtle: '#f5f5f5', muted: '#eee' },
                text: {
                    primary: '#000',
                    secondary: '#666',
                    default: '#000',
                    muted: '#888',
                    onBrand: '#fff',
                    subtle: '#ccc',
                },
                border: { light: '#ddd', default: '#ddd', muted: '#e0e0e0' },
                error: { main: '#f00' },
                success: { main: '#0f0' },
                warning: { main: '#fa0' },
            },
            spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
            borderRadius: { sm: 4, md: 8, lg: 16, full: 9999 },
            typography: {
                fontSize: { sm: 12, md: 14, lg: 16, xl: 20 },
                fontWeight: { regular: '400', medium: '500', bold: '700' },
            },
        }),
        css: (...args: unknown[]) => args,
        ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
    };
});

// DS token mocks
jest.mock('../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        brand: { primary: '#00f', secondary: '#0af' },
        semantic: { error: '#f00', success: '#0f0', warning: '#fa0', info: '#00f' },
        neutral: { white: '#fff', black: '#000', gray900: '#111', gray100: '#f5f5f5' },
        gray: {
            10: '#f9f9f9',
            20: '#eee',
            30: '#ddd',
            40: '#ccc',
            50: '#aaa',
            60: '#888',
            70: '#666',
            80: '#444',
            90: '#222',
        },
        journeys: {
            health: { primary: '#0f0', background: '#e8ffe8' },
            care: { primary: '#f90', background: '#fff3e0' },
            plan: { primary: '#90f', background: '#f3e0ff' },
        },
    },
}));
jest.mock('../../../../../design-system/src/tokens/typography', () => ({
    typography: {
        fontFamily: { body: 'System', heading: 'System', mono: 'System' },
        fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px',
            'text-xs': '12px',
            'text-sm': '14px',
            'text-md': '16px',
            'text-lg': '18px',
            'text-xl': '20px',
            'heading-sm': '20px',
            'heading-md': '22px',
            'heading-lg': '26px',
        },
        fontWeight: { regular: '400', medium: '500', semiBold: '600', bold: '700' },
        letterSpacing: { wide: '0.5px' },
    },
    fontSizeValues: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        'text-xs': 12,
        'text-sm': 14,
        'text-md': 16,
        'text-lg': 18,
        'heading-sm': 20,
    },
}));
jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
    spacing: {
        '3xs': '2px',
        '2xs': '4px',
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
        '4xl': '64px',
        '5xl': '80px',
    },
    spacingValues: {
        '3xs': 2,
        '4xs': 1,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 40,
        '3xl': 48,
        '4xl': 64,
        '5xl': 80,
    },
}));
jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadius: { xs: '2px', sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
    borderRadiusValues: { xs: 2, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
}));
jest.mock('../../../../../design-system/src/tokens/sizing', () => ({
    sizing: { component: { sm: '32px', md: '44px', lg: '56px' }, icon: { sm: '16px', md: '24px', lg: '32px' } },
}));
jest.mock('../../../../../design-system/src/themes/base.theme', () => ({}));

// Routes mock
jest.mock('../../../../constants/routes', () => ({ ROUTES: {} }));
jest.mock('@constants/routes', () => ({ ROUTES: {} }));

// Navigation types mock
jest.mock('../../../../navigation/types', () => ({}));

// Expo vector icons mock
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
    MaterialIcons: 'MaterialIcons',
    MaterialCommunityIcons: 'MaterialCommunityIcons',
    FontAwesome: 'FontAwesome',
    Feather: 'Feather',
}));

// Screen import — always after all mocks
import SymptomFollowUp from '../SymptomFollowUp';

describe('SymptomFollowUp', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<SymptomFollowUp />);
        expect(toJSON()).toBeTruthy();
    });

    it('matches snapshot', () => {
        const { toJSON } = render(<SymptomFollowUp />);
        expect(toJSON()).toMatchSnapshot();
    });
});
