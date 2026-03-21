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

jest.mock('styled-components/native', () => ({
    useTheme: () => ({
        colors: {
            background: { default: '#fff', subtle: '#f5f5f5' },
            text: { default: '#000', muted: '#888' },
            border: { default: '#ddd' },
        },
    }),
}));

jest.mock('@web/mobile/src/components/shared/EmptyState', () => ({
    EmptyState: () => null,
}));

jest.mock('@web/mobile/src/components/shared/LoadingIndicator', () => ({
    LoadingIndicator: () => null,
}));

jest.mock('@web/mobile/src/hooks/useClaims', () => ({
    useClaims: () => ({ claims: [], isLoading: false, error: null }),
}));

jest.mock('@web/mobile/src/hooks/useCoverage', () => ({
    useCoverage: () => ({ coverage: [], isLoading: false, error: null }),
}));

jest.mock('@web/mobile/src/hooks/useAuth', () => ({
    useAuth: () => ({
        session: { accessToken: 'mock-token' },
        getUserFromToken: () => ({ id: 'user-123', sub: 'user-123' }),
    }),
}));

jest.mock('@web/mobile/src/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: any) => {
        const { View, Text } = require('react-native');
        return (
            <View testID="mock-journey-header">
                <Text>{title}</Text>
            </View>
        );
    },
}));

jest.mock('@web/design-system/src/tokens/colors', () => ({
    colors: {
        neutral: { white: '#fff', black: '#000' },
        gray: { 30: '#ddd', 40: '#ccc', 50: '#888', 60: '#666' },
        semantic: { successBg: '#e6ffe6', warningBg: '#fff3e0', errorBg: '#ffe6e6' },
        journeys: {
            plan: { primary: '#90f', background: '#f3e0ff', text: '#333', accent: '#b060f0', secondary: '#d0a0ff' },
        },
    },
}));

jest.mock('@web/design-system/src/tokens/spacing', () => ({
    spacingValues: { xs: 4, sm: 8, md: 16, lg: 20, '3xs': 2, '4xs': 1 },
}));

jest.mock('@web/design-system/src/tokens/typography', () => ({
    fontSizeValues: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
}));

jest.mock('@web/design-system/src/tokens/borderRadius', () => ({
    borderRadiusValues: { md: 8, lg: 12, full: 9999, sm: 4 },
}));

jest.mock('@web/design-system/src/themes/base.theme', () => ({}));

import PlanDashboard from '../Dashboard';

describe('PlanDashboard', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<PlanDashboard />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the journey header', () => {
        const { getByTestId } = render(<PlanDashboard />);
        expect(getByTestId('mock-journey-header')).toBeTruthy();
    });

    it('displays the insurance card plan name', () => {
        const { getByText } = render(<PlanDashboard />);
        expect(getByText('AUSTA Care Plan')).toBeTruthy();
    });
});
