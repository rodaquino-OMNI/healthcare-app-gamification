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
        t: (key: string, _params?: any) => key,
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

jest.mock('src/web/shared/types/plan.types', () => ({
    ClaimType: {},
}));

jest.mock('src/web/shared/constants/routes', () => ({
    MOBILE_PLAN_ROUTES: {
        CLAIMS: 'Claims',
    },
}));

jest.mock('@web/design-system/src/tokens', () => ({
    colors: {
        neutral: { white: '#fff', black: '#000' },
        gray: { 30: '#ddd', 40: '#ccc', 50: '#888', 60: '#666' },
        semantic: { success: '#0f0', error: '#f00' },
        journeys: {
            plan: { primary: '#90f', background: '#f3e0ff', text: '#333', accent: '#b060f0', secondary: '#d0a0ff' },
        },
    },
    typography: {
        fontFamily: { body: 'System', heading: 'System', mono: 'Courier' },
        fontWeight: { bold: '700', semiBold: '600', medium: '500' },
    },
    spacing: {},
    borderRadius: {},
}));

jest.mock('@web/design-system/src/themes/base.theme', () => ({}));

import { ClaimSubmissionScreen } from '../ClaimSubmission';

describe('ClaimSubmissionScreen', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<ClaimSubmissionScreen />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the type selection step title', () => {
        const { getByText } = render(<ClaimSubmissionScreen />);
        expect(getByText('journeys.plan.claims.submission.typeTitle')).toBeTruthy();
    });

    it('displays claim type options', () => {
        const { getByText } = render(<ClaimSubmissionScreen />);
        expect(getByText('Medico')).toBeTruthy();
        expect(getByText('Odontologico')).toBeTruthy();
    });

    it('displays navigation buttons', () => {
        const { getByText } = render(<ClaimSubmissionScreen />);
        expect(getByText('common.buttons.back')).toBeTruthy();
        expect(getByText('common.buttons.next')).toBeTruthy();
    });
});
