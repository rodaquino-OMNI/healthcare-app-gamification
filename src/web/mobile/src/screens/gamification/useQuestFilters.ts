import { useState, useMemo } from 'react';
import type { CategorizedQuest } from './QuestListItem';

export type TabFilter = 'active' | 'available' | 'completed';

export interface QuestFilterTab {
  key: TabFilter;
  labelKey: string;
}

export const TABS: QuestFilterTab[] = [
  { key: 'active', labelKey: 'gamification.quests.tabActive' },
  { key: 'available', labelKey: 'gamification.quests.tabAvailable' },
  { key: 'completed', labelKey: 'gamification.quests.tabCompleted' },
];

export interface QuestStats {
  total: number;
  completed: number;
  active: number;
}

export interface QuestFiltersResult {
  activeTab: TabFilter;
  setActiveTab: (tab: TabFilter) => void;
  filteredQuests: CategorizedQuest[];
  sections: { title: string; data: CategorizedQuest[] }[];
  stats: QuestStats;
}

/**
 * Custom hook that encapsulates quest filtering logic:
 * - Computes stats (total, active, completed)
 * - Filters quests by selected tab (active/available/completed)
 * - Groups filtered quests into daily/weekly/special sections
 *
 * @param quests - The full list of categorized quests
 * @param t - i18n translation function for section headers
 */
export function useQuestFilters(
  quests: CategorizedQuest[],
  t: (key: string) => string,
): QuestFiltersResult {
  const [activeTab, setActiveTab] = useState<TabFilter>('active');

  const stats = useMemo<QuestStats>(() => {
    const total = quests.length;
    const completed = quests.filter((q) => q.completed).length;
    const active = quests.filter((q) => !q.completed && q.progress > 0).length;
    return { total, completed, active };
  }, [quests]);

  const filteredQuests = useMemo<CategorizedQuest[]>(() => {
    switch (activeTab) {
      case 'active':
        return quests.filter((q) => !q.completed && q.progress > 0);
      case 'available':
        return quests.filter((q) => !q.completed && q.progress === 0);
      case 'completed':
        return quests.filter((q) => q.completed);
      default:
        return quests;
    }
  }, [quests, activeTab]);

  const sections = useMemo(() => {
    const daily = filteredQuests.filter((q) => q.category === 'daily');
    const weekly = filteredQuests.filter((q) => q.category === 'weekly');
    const special = filteredQuests.filter((q) => q.category === 'special');

    const result: { title: string; data: CategorizedQuest[] }[] = [];
    if (daily.length > 0) result.push({ title: t('gamification.quests.sectionDaily'), data: daily });
    if (weekly.length > 0) result.push({ title: t('gamification.quests.sectionWeekly'), data: weekly });
    if (special.length > 0) result.push({ title: t('gamification.quests.sectionSpecial'), data: special });
    return result;
  }, [filteredQuests, t]);

  return { activeTab, setActiveTab, filteredQuests, sections, stats };
}
