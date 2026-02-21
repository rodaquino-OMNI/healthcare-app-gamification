import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { typography, fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';

/**
 * Tipos de filtro de busca
 */
export type SearchFilter = 'all' | 'doctors' | 'medications' | 'articles';

/**
 * Abas de filtro
 */
const FILTER_TABS: { key: SearchFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'doctors', label: 'Medicos' },
  { key: 'medications', label: 'Medicamentos' },
  { key: 'articles', label: 'Artigos' },
];

interface FilterPanelProps {
  activeFilter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
}

/**
 * Filter tabs panel for search results.
 * Renders horizontal filter tabs for toggling between result categories.
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({ activeFilter, onFilterChange }) => (
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
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

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
