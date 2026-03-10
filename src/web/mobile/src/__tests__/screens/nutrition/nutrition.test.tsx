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
jest.mock('../../../constants/routes', () => ({ ROUTES: {} }));

// Screen imports — always after all mocks
import { DietaryGoals } from '../../../screens/health/nutrition/DietaryGoals';
import { FoodDiary } from '../../../screens/health/nutrition/FoodDiary';
import { FoodSearch } from '../../../screens/health/nutrition/FoodSearch';
import { MacroTracker } from '../../../screens/health/nutrition/MacroTracker';
import { MealDetail } from '../../../screens/health/nutrition/MealDetail';
import { MealLog } from '../../../screens/health/nutrition/MealLog';
import { NutritionExport } from '../../../screens/health/nutrition/NutritionExport';
import { NutritionHome } from '../../../screens/health/nutrition/NutritionHome';
import { NutritionInsights } from '../../../screens/health/nutrition/NutritionInsights';
import { WaterIntake } from '../../../screens/health/nutrition/WaterIntake';

describe('NutritionHome', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<NutritionHome />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('MealLog', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<MealLog />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('MealDetail', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<MealDetail />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('FoodDiary', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<FoodDiary />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('MacroTracker', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<MacroTracker />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('WaterIntake', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<WaterIntake />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('DietaryGoals', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<DietaryGoals />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('NutritionInsights', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<NutritionInsights />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('FoodSearch', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<FoodSearch />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('NutritionExport', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<NutritionExport />);
        expect(toJSON()).toBeTruthy();
    });
});
