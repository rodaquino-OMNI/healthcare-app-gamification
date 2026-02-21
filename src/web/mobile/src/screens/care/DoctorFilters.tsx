import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Select } from 'src/web/design-system/src/components/Select/Select';
import { Slider } from 'src/web/design-system/src/components/Slider/Slider';
import { Checkbox } from 'src/web/design-system/src/components/Checkbox/Checkbox';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { Touchable } from 'src/web/design-system/src/primitives/Touchable/Touchable';
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacingValues } from 'src/web/design-system/src/tokens/spacing';

const SPECIALTY_OPTIONS = [
  { label: 'Todas', value: 'todas' },
  { label: 'Cardiologia', value: 'cardiologia' },
  { label: 'Dermatologia', value: 'dermatologia' },
  { label: 'Ortopedia', value: 'ortopedia' },
  { label: 'Pediatria', value: 'pediatria' },
  { label: 'Neurologia', value: 'neurologia' },
  { label: 'Ginecologia', value: 'ginecologia' },
];

const GENDER_OPTIONS = [
  { label: 'Sem preferencia', value: 'sem_preferencia' },
  { label: 'Masculino', value: 'masculino' },
  { label: 'Feminino', value: 'feminino' },
];

/**
 * DoctorFilters screen provides filter options for refining doctor search results.
 *
 * Includes specialty, distance, rating, availability, insurance acceptance,
 * gender preference, and price range filters.
 *
 * Part of the Care Now journey (orange theme).
 */
const DoctorFilters: React.FC = () => {
  const navigation = useNavigation<any>();

  // Filter state
  const [specialty, setSpecialty] = useState('todas');
  const [distance, setDistance] = useState(25);
  const [minRating, setMinRating] = useState(0);
  const [availableToday, setAvailableToday] = useState(false);
  const [availableWeek, setAvailableWeek] = useState(false);
  const [acceptsInsurance, setAcceptsInsurance] = useState(false);
  const [genderPreference, setGenderPreference] = useState('sem_preferencia');
  const [priceMin, setPriceMin] = useState(100);
  const [priceMax, setPriceMax] = useState(800);

  /**
   * Resets all filters to their default values.
   */
  const handleClearFilters = useCallback(() => {
    setSpecialty('todas');
    setDistance(25);
    setMinRating(0);
    setAvailableToday(false);
    setAvailableWeek(false);
    setAcceptsInsurance(false);
    setGenderPreference('sem_preferencia');
    setPriceMin(100);
    setPriceMax(800);
  }, []);

  /**
   * Applies the selected filters and navigates back to the search screen.
   */
  const handleApplyFilters = useCallback(() => {
    // Filters would be passed back via params or context in a real implementation
    navigation.goBack();
  }, [navigation]);

  /**
   * Renders interactive star rating buttons.
   */
  const renderRatingSelector = () => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <View style={styles.ratingRow}>
        {stars.map((star) => (
          <Touchable
            key={star}
            onPress={() => setMinRating(star === minRating ? 0 : star)}
            accessibilityLabel={`Avaliacao minima ${star} estrelas`}
            accessibilityState={{ selected: minRating >= star }}
            style={[
              styles.starButton,
              minRating >= star && styles.starButtonActive,
            ]}
          >
            <Text
              fontSize="xl"
              color={
                minRating >= star
                  ? colors.journeys.care.primary
                  : colors.neutral.gray400
              }
            >
              {'\u2605'}
            </Text>
          </Touchable>
        ))}
        {minRating > 0 && (
          <Text fontSize="sm" color={colors.neutral.gray700}>
            {minRating}+ estrelas
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <JourneyHeader title="Filtros" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Specialty */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="md" testID="filter-specialty-label">
            Especialidade
          </Text>
          <View style={styles.sectionContent}>
            <Select
              options={SPECIALTY_OPTIONS}
              value={specialty}
              onChange={(val) => setSpecialty(val as string)}
              label="Selecionar especialidade"
              journey="care"
              testID="filter-specialty-select"
            />
          </View>
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="md">
            Distancia
          </Text>
          <Text fontSize="sm" color={colors.neutral.gray700}>
            Ate {distance} km
          </Text>
          <View style={styles.sectionContent}>
            <Slider
              min={1}
              max={50}
              step={1}
              value={distance}
              onChange={setDistance}
              journey="care"
              showValue
              accessibilityLabel="Distancia maxima em quilometros"
            />
          </View>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="md">
            Avaliacao Minima
          </Text>
          <View style={styles.sectionContent}>
            {renderRatingSelector()}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="md">
            Disponibilidade
          </Text>
          <View style={styles.sectionContent}>
            <Checkbox
              id="available-today"
              name="availability"
              value="today"
              checked={availableToday}
              onChange={() => setAvailableToday(!availableToday)}
              label="Disponivel hoje"
              journey="care"
              testID="filter-available-today"
            />
            <View style={styles.checkboxSpacer} />
            <Checkbox
              id="available-week"
              name="availability"
              value="week"
              checked={availableWeek}
              onChange={() => setAvailableWeek(!availableWeek)}
              label="Proximos 7 dias"
              journey="care"
              testID="filter-available-week"
            />
          </View>
        </View>

        {/* Insurance */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="md">
            Convenio
          </Text>
          <View style={styles.sectionContent}>
            <Checkbox
              id="accepts-insurance"
              name="insurance"
              value="accepts"
              checked={acceptsInsurance}
              onChange={() => setAcceptsInsurance(!acceptsInsurance)}
              label="Aceita meu plano"
              journey="care"
              testID="filter-accepts-insurance"
            />
          </View>
        </View>

        {/* Gender preference */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="md">
            Preferencia de Genero
          </Text>
          <View style={styles.sectionContent}>
            <Select
              options={GENDER_OPTIONS}
              value={genderPreference}
              onChange={(val) => setGenderPreference(val as string)}
              label="Selecionar genero"
              journey="care"
              testID="filter-gender-select"
            />
          </View>
        </View>

        {/* Price range */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="md">
            Faixa de Preco
          </Text>
          <Text fontSize="sm" color={colors.neutral.gray700}>
            R$ {priceMin} - R$ {priceMax}
          </Text>
          <View style={styles.sectionContent}>
            <Text fontSize="sm" color={colors.neutral.gray700}>
              Minimo: R$ {priceMin}
            </Text>
            <Slider
              min={50}
              max={1000}
              step={50}
              value={priceMin}
              onChange={(val) => {
                if (val < priceMax) setPriceMin(val);
              }}
              journey="care"
              showValue
              accessibilityLabel="Preco minimo"
            />
            <View style={styles.sliderSpacer} />
            <Text fontSize="sm" color={colors.neutral.gray700}>
              Maximo: R$ {priceMax}
            </Text>
            <Slider
              min={50}
              max={1000}
              step={50}
              value={priceMax}
              onChange={(val) => {
                if (val > priceMin) setPriceMax(val);
              }}
              journey="care"
              showValue
              accessibilityLabel="Preco maximo"
            />
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <View style={styles.buttonHalf}>
            <Button
              variant="secondary"
              journey="care"
              onPress={handleClearFilters}
              accessibilityLabel="Limpar todos os filtros"
              testID="clear-filters-button"
            >
              Limpar Filtros
            </Button>
          </View>
          <View style={styles.buttonHalf}>
            <Button
              variant="primary"
              journey="care"
              onPress={handleApplyFilters}
              accessibilityLabel="Aplicar filtros selecionados"
              testID="apply-filters-button"
            >
              Aplicar
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  section: {
    marginBottom: spacingValues.xl,
  },
  sectionContent: {
    marginTop: spacingValues.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.xs,
  },
  starButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacingValues.xs,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
  },
  starButtonActive: {
    borderColor: colors.journeys.care.primary,
    backgroundColor: `${colors.journeys.care.primary}15`,
  },
  checkboxSpacer: {
    height: spacingValues.sm,
  },
  sliderSpacer: {
    height: spacingValues.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacingValues.md,
    marginTop: spacingValues.md,
  },
  buttonHalf: {
    flex: 1,
  },
});

export default DoctorFilters;
