import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => key,
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

jest.mock('./QuestListItem', () => ({
  QuestListItem: ({ item }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={`quest-item-${item.id}`}>
        <Text>{item.title}</Text>
      </View>
    );
  },
  CategorizedQuest: {},
}));

jest.mock('./useQuestFilters', () => ({
  useQuestFilters: () => ({
    activeTab: 'active',
    setActiveTab: jest.fn(),
    sections: [
      {
        title: 'Daily',
        data: [
          { id: 'q-001', title: 'Morning Health Check', description: 'Log vitals', journey: 'health', icon: '🎯', progress: 1, total: 1, completed: false, category: 'daily' },
        ],
      },
    ],
    stats: { total: 12, active: 9, completed: 3 },
  }),
  TABS: [
    { key: 'active', labelKey: 'gamification.quests.tabActive' },
    { key: 'available', labelKey: 'gamification.quests.tabAvailable' },
    { key: 'completed', labelKey: 'gamification.quests.tabCompleted' },
  ],
}));

jest.mock('src/web/design-system/src/tokens/colors', () => ({
  colors: {
    brand: { primary: '#00f' },
    neutral: { black: '#000' },
    semantic: { success: '#0f0' },
    journeys: { health: { primary: '#0f0' } },
  },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
  spacingValues: { xs: 4, sm: 8, md: 16, lg: 24, '3xs': 2, '4xs': 1, '5xl': 80, '2xl': 32 },
}));

jest.mock('src/web/design-system/src/tokens/borderRadius', () => ({
  borderRadiusValues: { lg: 12, full: 9999 },
}));

jest.mock('src/web/design-system/src/tokens/sizing', () => ({
  sizingValues: { component: { sm: 32 } },
}));

jest.mock('../../../../design-system/src/themes/base.theme', () => ({}));

import QuestList from '../QuestList';

describe('QuestList', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<QuestList />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the screen title', () => {
    const { getByText } = render(<QuestList />);
    expect(getByText('gamification.quests.screenTitle')).toBeTruthy();
  });

  it('displays the summary card with stats', () => {
    const { getByText } = render(<QuestList />);
    expect(getByText('12')).toBeTruthy();
    expect(getByText('9')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });
});
