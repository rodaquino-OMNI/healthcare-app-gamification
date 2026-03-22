import { Button } from '@design-system/components/Button/Button';
import { Checkbox } from '@design-system/components/Checkbox/Checkbox';
import { Select } from '@design-system/components/Select/Select';
import { Slider } from '@design-system/components/Slider/Slider';
import { Text } from '@design-system/primitives/Text/Text';
import { Touchable } from '@design-system/primitives/Touchable/Touchable';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';

import { JourneyHeader } from '@components/shared/JourneyHeader';

import type { CareStackParamList } from '../../navigation/types';

// Options are now inside the component to access t()

/**
 * DoctorFilters screen provides filter options for refining doctor search results.
 *
 * Includes specialty, distance, rating, availability, insurance acceptance,
 * gender preference, and price range filters.
 *
 * Part of the Care Now journey (orange theme).
 */
const DoctorFilters: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    const SPECIALTY_OPTIONS = [
        { label: t('journeys.care.doctorFilters.specialties.all'), value: 'todas' },
        { label: t('journeys.care.doctorFilters.specialties.cardiology'), value: 'cardiologia' },
        { label: t('journeys.care.doctorFilters.specialties.dermatology'), value: 'dermatologia' },
        { label: t('journeys.care.doctorFilters.specialties.orthopedics'), value: 'ortopedia' },
        { label: t('journeys.care.doctorFilters.specialties.pediatrics'), value: 'pediatria' },
        { label: t('journeys.care.doctorFilters.specialties.neurology'), value: 'neurologia' },
        { label: t('journeys.care.doctorFilters.specialties.gynecology'), value: 'ginecologia' },
    ];

    const GENDER_OPTIONS = [
        { label: t('journeys.care.doctorFilters.gender.noPreference'), value: 'sem_preferencia' },
        { label: t('journeys.care.doctorFilters.gender.male'), value: 'masculino' },
        { label: t('journeys.care.doctorFilters.gender.female'), value: 'feminino' },
    ];

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
    const renderRatingSelector = (): React.ReactElement | null => {
        const stars = [1, 2, 3, 4, 5];
        return (
            <View style={styles.ratingRow}>
                {stars.map((star) => (
                    <Touchable
                        key={star}
                        onPress={() => setMinRating(star === minRating ? 0 : star)}
                        accessibilityLabel={`Avaliacao minima ${star} estrelas`}
                        style={minRating >= star ? [styles.starButton, styles.starButtonActive] : styles.starButton}
                    >
                        <Text
                            fontSize="xl"
                            color={minRating >= star ? colors.journeys.care.primary : colors.neutral.gray400}
                        >
                            {'\u2605'}
                        </Text>
                    </Touchable>
                ))}
                {minRating > 0 && (
                    <Text fontSize="sm" color={colors.neutral.gray700}>
                        {t('journeys.care.doctorFilters.starsPlus', { count: minRating })}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.root}>
            <JourneyHeader title={t('journeys.care.doctorFilters.title')} showBackButton />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Specialty */}
                <View style={styles.section}>
                    <Text fontWeight="medium" fontSize="md" testID="filter-specialty-label">
                        {t('journeys.care.doctorFilters.specialty')}
                    </Text>
                    <View style={styles.sectionContent}>
                        <Select
                            options={SPECIALTY_OPTIONS}
                            value={specialty}
                            onChange={(val) => setSpecialty(val as string)}
                            label={t('journeys.care.doctorFilters.selectSpecialty')}
                            journey="care"
                            testID="filter-specialty-select"
                        />
                    </View>
                </View>

                {/* Distance */}
                <View style={styles.section}>
                    <Text fontWeight="medium" fontSize="md">
                        {t('journeys.care.doctorFilters.distance')}
                    </Text>
                    <Text fontSize="sm" color={colors.neutral.gray700}>
                        {t('journeys.care.doctorFilters.upToKm', { distance })}
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
                        {t('journeys.care.doctorFilters.minimumRating')}
                    </Text>
                    <View style={styles.sectionContent}>{renderRatingSelector()}</View>
                </View>

                {/* Availability */}
                <View style={styles.section}>
                    <Text fontWeight="medium" fontSize="md">
                        {t('journeys.care.doctorFilters.availability')}
                    </Text>
                    <View style={styles.sectionContent}>
                        <Checkbox
                            id="available-today"
                            name="availability"
                            value="today"
                            checked={availableToday}
                            onChange={() => setAvailableToday(!availableToday)}
                            label={t('journeys.care.doctorFilters.availableToday')}
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
                            label={t('journeys.care.doctorFilters.next7Days')}
                            journey="care"
                            testID="filter-available-week"
                        />
                    </View>
                </View>

                {/* Insurance */}
                <View style={styles.section}>
                    <Text fontWeight="medium" fontSize="md">
                        {t('journeys.care.doctorFilters.insurance')}
                    </Text>
                    <View style={styles.sectionContent}>
                        <Checkbox
                            id="accepts-insurance"
                            name="insurance"
                            value="accepts"
                            checked={acceptsInsurance}
                            onChange={() => setAcceptsInsurance(!acceptsInsurance)}
                            label={t('journeys.care.doctorFilters.acceptsMyPlan')}
                            journey="care"
                            testID="filter-accepts-insurance"
                        />
                    </View>
                </View>

                {/* Gender preference */}
                <View style={styles.section}>
                    <Text fontWeight="medium" fontSize="md">
                        {t('journeys.care.doctorFilters.genderPreference')}
                    </Text>
                    <View style={styles.sectionContent}>
                        <Select
                            options={GENDER_OPTIONS}
                            value={genderPreference}
                            onChange={(val) => setGenderPreference(val as string)}
                            label={t('journeys.care.doctorFilters.selectGender')}
                            journey="care"
                            testID="filter-gender-select"
                        />
                    </View>
                </View>

                {/* Price range */}
                <View style={styles.section}>
                    <Text fontWeight="medium" fontSize="md">
                        {t('journeys.care.doctorFilters.priceRange')}
                    </Text>
                    <Text fontSize="sm" color={colors.neutral.gray700}>
                        R$ {priceMin} - R$ {priceMax}
                    </Text>
                    <View style={styles.sectionContent}>
                        <Text fontSize="sm" color={colors.neutral.gray700}>
                            {t('journeys.care.doctorFilters.minimum')}: R$ {priceMin}
                        </Text>
                        <Slider
                            min={50}
                            max={1000}
                            step={50}
                            value={priceMin}
                            onChange={(val) => {
                                if (val < priceMax) {
                                    setPriceMin(val);
                                }
                            }}
                            journey="care"
                            showValue
                            accessibilityLabel="Preco minimo"
                        />
                        <View style={styles.sliderSpacer} />
                        <Text fontSize="sm" color={colors.neutral.gray700}>
                            {t('journeys.care.doctorFilters.maximum')}: R$ {priceMax}
                        </Text>
                        <Slider
                            min={50}
                            max={1000}
                            step={50}
                            value={priceMax}
                            onChange={(val) => {
                                if (val > priceMin) {
                                    setPriceMax(val);
                                }
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
                            {t('journeys.care.doctorFilters.clearFilters')}
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
                            {t('journeys.care.doctorFilters.apply')}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
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
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
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
