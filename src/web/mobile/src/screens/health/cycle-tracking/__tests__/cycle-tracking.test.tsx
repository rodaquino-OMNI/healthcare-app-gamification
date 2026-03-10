import { render } from '@testing-library/react-native';
import React from 'react';

// Navigation mock
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
}));

// i18n mock
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

// styled-components mock
jest.mock('styled-components/native', () => ({
    useTheme: () => ({
        colors: {
            background: { default: '#fff', subtle: '#f5f5f5', muted: '#eee' },
            text: { default: '#000', muted: '#888', onBrand: '#fff', subtle: '#ccc' },
            border: { default: '#ddd', muted: '#e0e0e0' },
        },
    }),
}));

// DS token mocks
jest.mock('../../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        brand: { primary: '#00f' },
        semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
        neutral: { white: '#fff', black: '#000', gray900: '#111' },
        gray: { 10: '#f9f9f9', 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#aaa', 70: '#666' },
        journeys: {
            health: { primary: '#0f0', background: '#e8ffe8' },
            care: { primary: '#f90', background: '#fff3e0' },
            plan: { primary: '#90f', background: '#f3e0ff' },
        },
    },
}));
jest.mock('../../../../../../design-system/src/tokens/spacing', () => ({
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
jest.mock('../../../../../../design-system/src/tokens/typography', () => ({
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
}));
jest.mock('../../../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadius: { xs: '4px', sm: '4px', md: '8px', lg: '12px', full: '9999px' },
}));
jest.mock('../../../../../../design-system/src/tokens/sizing', () => ({
    sizing: { component: { sm: '32px', md: '44px', lg: '56px' }, icon: { md: '24px' } },
}));
jest.mock('../../../../../../design-system/src/themes/base.theme', () => ({}));

// Routes mock
jest.mock('../../../../constants/routes', () => ({ ROUTES: {} }));

// Screen imports — always after all mocks
import { CycleAnalysis } from '../CycleAnalysis';
import { CycleArticleDetail } from '../CycleArticleDetail';
import { CycleCalendar } from '../CycleCalendar';
import { CycleHistory } from '../CycleHistory';
import { CycleHome } from '../CycleHome';
import { CycleInsights } from '../CycleInsights';
import { CycleReminders } from '../CycleReminders';
import { CycleSettings } from '../CycleSettings';
import { ExportCycleReport } from '../ExportCycleReport';
import { FertilityWindow } from '../FertilityWindow';
import { LogFlowIntensity } from '../LogFlowIntensity';
import { LogPeriodStart } from '../LogPeriodStart';
import { LogSymptoms } from '../LogSymptoms';
import { PartnerSharing } from '../PartnerSharing';
import { PMSPredictions } from '../PMSPredictions';

describe('CycleHome', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<CycleHome />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('CycleCalendar', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<CycleCalendar />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('LogPeriodStart', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<LogPeriodStart />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('LogSymptoms', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<LogSymptoms />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('LogFlowIntensity', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<LogFlowIntensity />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('FertilityWindow', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<FertilityWindow />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('PMSPredictions', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<PMSPredictions />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('CycleHistory', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<CycleHistory />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('CycleAnalysis', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<CycleAnalysis />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('CycleInsights', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<CycleInsights />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('CycleArticleDetail', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<CycleArticleDetail />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('CycleReminders', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<CycleReminders />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('PartnerSharing', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<PartnerSharing />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('CycleSettings', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<CycleSettings />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('ExportCycleReport', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<ExportCycleReport />);
        expect(toJSON()).toBeTruthy();
    });
});
