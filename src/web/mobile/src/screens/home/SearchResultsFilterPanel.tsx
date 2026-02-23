import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { typography, fontSizeValues } from '@design-system/tokens/typography';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';

/**
 * Tipos de filtro de busca
 */
export type SearchFilter = 'all' | 'doctors' | 'medications' | 'articles';

/**
 * Abas de filtro
 */
const FILTER_TABS: { key: SearchFilter; labelKey: string }[] = [
  { key: 'all', labelKey: 'searchScreens.filterAll' },
  { key: 'doctors', labelKey: 'searchScreens.filterDoctors' },
  { key: 'medications', labelKey: 'searchScreens.filterMedications' },
  { key: 'articles', labelKey: 'searchScreens.filterArticles' },
];

interface FilterPanelProps {
  activeFilter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
}

/**
 * Filter tabs panel for search results.
 * Renders horizontal filter tabs for toggling between result categories.
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({ activeFilter, onFilterChange }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.filterContainer}>
      {FILTER_TABS.map((tab) => {
        const isActive = activeFilter === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, isActive && styles.filterTabActive]}
            onPress={() => onFilterChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[20],
  },
  filterTab: {
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
    marginRight: spacingValues.xs,
  },
  filterTabActive: {
    backgroundColor: colors.brand.primary + '15',
  },
  filterTabText: {
    fontSize: fontSizeValues.sm,
    fontWeight: String(typography.fontWeight.medium) as '500',
    color: colors.gray[50],
  },
  filterTabTextActive: {
    color: colors.brand.primary,
    fontWeight: String(typography.fontWeight.semiBold) as '600',
  },
});
