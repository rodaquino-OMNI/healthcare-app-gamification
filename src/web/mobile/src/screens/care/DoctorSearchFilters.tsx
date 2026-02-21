import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Select } from 'src/web/design-system/src/components/Select/Select';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacingValues } from 'src/web/design-system/src/tokens/spacing';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SPECIALTIES = [
  'Todos',
  'Cardiologia',
  'Dermatologia',
  'Ortopedia',
  'Pediatria',
  'Neurologia',
  'Ginecologia',
];

export const SORT_OPTIONS = [
  { label: 'Relevancia', value: 'relevancia' },
  { label: 'Avaliacao', value: 'avaliacao' },
  { label: 'Distancia', value: 'distancia' },
  { label: 'Preco', value: 'preco' },
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
export const SpecialtyTabs: React.FC<SpecialtyTabsProps> = ({ selectedSpecialty, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.tabsContainer}
    contentContainerStyle={styles.tabsContent}
  >
    {SPECIALTIES.map((specialty, index) => (
      <TouchableOpacity
        key={specialty}
        onPress={() => onSelect(index)}
        style={[
          styles.tab,
          selectedSpecialty === index && styles.tabActive,
        ]}
        accessibilityLabel={`Filtrar por ${specialty}`}
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
          {specialty}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

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
}) => (
  <View style={styles.controlsRow}>
    <View style={styles.sortContainer}>
      <Select
        options={SORT_OPTIONS}
        value={sortBy}
        onChange={(val) => onSortChange(val as string)}
        label="Ordenar"
        journey="care"
        testID="sort-select"
      />
    </View>
    <TouchableOpacity
      onPress={onToggleView}
      style={styles.viewToggle}
      accessibilityLabel={isMapView ? 'Mudar para lista' : 'Mudar para mapa'}
    >
      <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.primary}>
        {isMapView ? 'Lista' : 'Mapa'}
      </Text>
    </TouchableOpacity>
  </View>
);

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
