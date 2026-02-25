import React from 'react';
import { render } from '@testing-library/react-native';

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
  spacing: { '3xs': '2px', '2xs': '4px', xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '40px', '3xl': '48px', '4xl': '64px', '5xl': '80px' },
  spacingValues: { '3xs': 2, '4xs': 1, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 40, '3xl': 48, '4xl': 64, '5xl': 80 },
}));
jest.mock('../../../../../../design-system/src/tokens/typography', () => ({
  typography: {
    fontFamily: { body: 'System', heading: 'System', mono: 'System' },
    fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '18px', xl: '20px', 'text-xs': '12px', 'text-sm': '14px', 'text-md': '16px', 'text-lg': '18px', 'text-xl': '20px', 'heading-sm': '20px', 'heading-md': '22px', 'heading-lg': '26px' },
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
import { SleepHome } from '../SleepHome';
import { SleepLog } from '../SleepLog';
import { SleepQuality } from '../SleepQuality';
import { SleepDiary } from '../SleepDiary';
import { SleepTrends } from '../SleepTrends';
import { SleepGoals } from '../SleepGoals';
import { SleepDetail } from '../SleepDetail';
import { BedtimeRoutine } from '../BedtimeRoutine';
import { SmartAlarm } from '../SmartAlarm';
import { SleepInsights } from '../SleepInsights';
import { SleepDeviceSync } from '../SleepDeviceSync';
import { SleepExport } from '../SleepExport';

describe('SleepHome', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SleepHome navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SleepLog', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SleepLog navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SleepQuality', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SleepQuality navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SleepDiary', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SleepDiary navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SleepTrends', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SleepTrends navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SleepGoals', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SleepGoals navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SleepDetail', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SleepDetail navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('BedtimeRoutine', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<BedtimeRoutine navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SmartAlarm', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SmartAlarm navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SleepInsights', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SleepInsights navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SleepDeviceSync', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SleepDeviceSync navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SleepExport', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SleepExport navigation={jest.fn() as any} route={{ params: {} } as any} />);
    expect(toJSON()).toBeTruthy();
  });
});
