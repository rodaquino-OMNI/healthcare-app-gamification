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
            text: { default: '#000', muted: '#888', onBrand: '#fff' },
            border: { default: '#ddd' },
        },
    }),
}));

jest.mock('../../../constants/routes', () => ({
    ROUTES: {
        HEALTH_METRIC_DETAIL: 'HealthMetricDetail',
        HEALTH_ADD_METRIC: 'HealthAddMetric',
    },
}));

jest.mock('../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        semantic: { success: '#0f0', error: '#f00' },
        gray: { 50: '#888' },
        journeys: { health: { primary: '#0f0' } },
        neutral: { black: '#000' },
    },
}));

jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
    spacingValues: { xs: 4, sm: 8, md: 16, '2xl': 32, '3xs': 2, '3xl': 48, '4xl': 64 },
}));

jest.mock('../../../../../design-system/src/tokens/typography', () => ({
    fontSizeValues: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
}));

jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadiusValues: { md: 8, full: 9999 },
}));

jest.mock('../../../../../design-system/src/themes/base.theme', () => ({}));

import { HomeMetricsScreen } from '../HomeMetrics';

describe('HomeMetricsScreen', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<HomeMetricsScreen />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the metrics header title', () => {
        const { getByText } = render(<HomeMetricsScreen />);
        expect(getByText('journeys.health.metrics.title')).toBeTruthy();
    });

    it('displays add metric button', () => {
        const { getByText } = render(<HomeMetricsScreen />);
        expect(getByText('journeys.health.metrics.addMetric')).toBeTruthy();
    });
});
