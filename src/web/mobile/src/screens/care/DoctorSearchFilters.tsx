import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Select } from '@design-system/components/Select/Select';
import { Text } from '@design-system/primitives/Text/Text';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SPECIALTIES_KEYS = [
  'journeys.care.doctorSearch.specialtyAll',
  'journeys.care.doctorSearch.cardiology',
  'journeys.care.doctorSearch.dermatology',
  'journeys.care.doctorSearch.orthopedics',
  'journeys.care.doctorSearch.pediatrics',
  'journeys.care.doctorSearch.neurology',
  'journeys.care.doctorSearch.gynecology',
];

export const SORT_OPTION_KEYS = [
  { labelKey: 'journeys.care.doctorSearch.sortRelevance', value: 'relevancia' },
  { labelKey: 'journeys.care.doctorSearch.sortRating', value: 'avaliacao' },
  { labelKey: 'journeys.care.doctorSearch.sortDistance', value: 'distancia' },
  { labelKey: 'journeys.care.doctorSearch.sortPrice', value: 'preco' },
];

// ---------------------------------------------------------------------------
// SpecialtyTabs
// ---------------------------------------------------------------------------

interface SpecialtyTabsProps {
  selectedSpecialty: number;
  onSelect: (index: number) => void;
}

/**
 * Horizontal scrollable specialty filter tabs.
 */
export const SpecialtyTabs: React.FC<SpecialtyTabsProps> = ({ selectedSpecialty, onSelect }) => {
  const { t } = useTranslation();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
      contentContainerStyle={styles.tabsContent}
    >
      {SPECIALTIES_KEYS.map((key, index) => (
        <TouchableOpacity
          key={key}
          onPress={() => onSelect(index)}
          style={[
            styles.tab,
            selectedSpecialty === index && styles.tabActive,
          ]}
          accessibilityLabel={t('journeys.care.doctorSearch.filterBy', { specialty: t(key) })}
          accessibilityState={{ selected: selectedSpecialty === index }}
        >
          <Text
            fontSize="sm"
            fontWeight={selectedSpecialty === index ? 'medium' : 'regular'}
            color={
              selectedSpecialty === index
                ? colors.neutral.white
                : colors.journeys.care.primary
            }
          >
            {t(key)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// ---------------------------------------------------------------------------
// ControlsRow
// ---------------------------------------------------------------------------

interface ControlsRowProps {
  sortBy: string;
  onSortChange: (v: string) => void;
  isMapView: boolean;
  onToggleView: () => void;
}

/**
 * Sort select and list/map view toggle row.
 */
export const ControlsRow: React.FC<ControlsRowProps> = ({
  sortBy,
  onSortChange,
  isMapView,
  onToggleView,
}) => {
  const { t } = useTranslation();
  const sortOptions = SORT_OPTION_KEYS.map(opt => ({ label: t(opt.labelKey), value: opt.value }));
  return (
    <View style={styles.controlsRow}>
      <View style={styles.sortContainer}>
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(val) => onSortChange(val as string)}
          label={t('journeys.care.doctorSearch.sort')}
          journey="care"
          testID="sort-select"
        />
      </View>
      <TouchableOpacity
        onPress={onToggleView}
        style={styles.viewToggle}
        accessibilityLabel={isMapView ? t('journeys.care.doctorSearch.switchToList') : t('journeys.care.doctorSearch.switchToMap')}
      >
        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.primary}>
          {isMapView ? t('journeys.care.doctorSearch.list') : t('journeys.care.doctorSearch.map')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  tabsContainer: {
    maxHeight: 48,
    marginTop: spacingValues.sm,
  },
  tabsContent: {
    paddingHorizontal: spacingValues.md,
    gap: spacingValues.xs,
    alignItems: 'center',
  },
  tab: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    borderRadius: spacingValues.xl,
    borderWidth: 1,
    borderColor: colors.journeys.care.primary,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.journeys.care.primary,
    borderColor: colors.journeys.care.primary,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md,
    paddingTop: spacingValues.sm,
    paddingBottom: spacingValues.xs,
  },
  sortContainer: {
    flex: 1,
    marginRight: spacingValues.sm,
  },
  viewToggle: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    borderRadius: spacingValues.xs,
    borderWidth: 1,
    borderColor: colors.journeys.care.primary,
  },
});
