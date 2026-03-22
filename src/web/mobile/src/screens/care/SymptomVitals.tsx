/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import type { Theme } from '@design-system/themes/base.theme';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useTheme } from 'styled-components/native';

import { ROUTES } from '@constants/routes';

import type { CareNavigationProp, CareStackParamList } from '../../navigation/types';

interface VitalsData {
    temperature: string;
    systolic: string;
    diastolic: string;
    heartRate: string;
    spo2: string;
}

interface VitalValidation {
    isValid: boolean;
    error: string;
}

const VITAL_RANGES = {
    temperature: { min: 35, max: 42, unit: 'celsius' },
    systolic: { min: 70, max: 250, unit: 'mmHg' },
    diastolic: { min: 40, max: 150, unit: 'mmHg' },
    heartRate: { min: 40, max: 200, unit: 'bpm' },
    spo2: { min: 70, max: 100, unit: 'percent' },
} as const;

/**
 * Validates a single vital sign value against its allowed range.
 * Empty values are considered valid (all fields are optional).
 */
const validateVital = (
    value: string,
    field: keyof typeof VITAL_RANGES,
    t: (key: string, params?: Record<string, string | number>) => string
): VitalValidation => {
    if (value.trim() === '') {
        return { isValid: true, error: '' };
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        return {
            isValid: false,
            error: t('journeys.care.symptomChecker.vitals.errors.invalidNumber'),
        };
    }

    const range = VITAL_RANGES[field];
    if (numValue < range.min || numValue > range.max) {
        return {
            isValid: false,
            error: t('journeys.care.symptomChecker.vitals.errors.outOfRange', {
                min: range.min,
                max: range.max,
            }),
        };
    }

    return { isValid: true, error: '' };
};

/**
 * Manual vitals entry screen for temperature, blood pressure,
 * heart rate, and SpO2. All fields are optional.
 * Feeds into the existing symptom checker flow at CARE_SYMPTOM_QUESTIONS.
 */
const SymptomVitals: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const navigation = useNavigation<CareNavigationProp>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareSymptomVitals'>>();
    const sessionId = route.params?.sessionId ?? '';

    const [vitals, setVitals] = useState<VitalsData>({
        temperature: '',
        systolic: '',
        diastolic: '',
        heartRate: '',
        spo2: '',
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const updateVital = (field: keyof VitalsData, value: string) => {
        const sanitized = value.replace(/[^0-9.]/g, '');
        setVitals((prev) => ({ ...prev, [field]: sanitized }));
    };

    const handleBlur = (field: string): void => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const getValidation = (field: keyof typeof VITAL_RANGES): VitalValidation => {
        return validateVital(
            vitals[field],
            field,
            t as (key: string, params?: Record<string, string | number>) => string
        );
    };

    const hasAnyErrors = (): boolean => {
        const fields: (keyof typeof VITAL_RANGES)[] = ['temperature', 'systolic', 'diastolic', 'heartRate', 'spo2'];
        return fields.some((field) => {
            const validation = getValidation(field);
            return !validation.isValid;
        });
    };

    const handleContinue = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_QUESTIONS, { sessionId });
    };

    const handleSkip = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_QUESTIONS, { sessionId });
    };

    const handleBack = (): void => {
        navigation.goBack();
    };

    const hasAnyVitals = (Object.values(vitals) as string[]).some((v) => v.trim() !== '');

    const renderVitalField = (
        field: keyof VitalsData & keyof typeof VITAL_RANGES,
        labelKey: string,
        unitKey: string,
        placeholderKey: string
    ) => {
        const validation = getValidation(field);
        const showError = touched[field] && !validation.isValid;

        return (
            <View style={styles.vitalField} key={field}>
                <Text variant="body" fontWeight="semiBold" journey="care">
                    {t(`journeys.care.symptomChecker.vitals.${labelKey}`)}
                </Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={[styles.textInput, showError && styles.textInputError]}
                        value={vitals[field]}
                        onChangeText={(value) => updateVital(field, value)}
                        onBlur={() => handleBlur(field)}
                        placeholder={t(`journeys.care.symptomChecker.vitals.${placeholderKey}`)}
                        placeholderTextColor={colors.neutral.gray400}
                        keyboardType="decimal-pad"
                        accessibilityLabel={t(`journeys.care.symptomChecker.vitals.${labelKey}`)}
                        testID={`vital-input-${field}`}
                    />
                    <Text fontSize="text-sm" color={colors.neutral.gray600}>
                        {t(`journeys.care.symptomChecker.vitals.units.${unitKey}`)}
                    </Text>
                </View>
                {showError && (
                    <Text fontSize="text-xs" color={colors.semantic.error} testID={`vital-error-${field}`}>
                        {validation.error}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.root}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text variant="heading" journey="care" testID="vitals-title">
                    {t('journeys.care.symptomChecker.vitals.title')}
                </Text>

                <Text variant="body" journey="care" testID="vitals-subtitle">
                    {t('journeys.care.symptomChecker.vitals.subtitle')}
                </Text>

                <Text variant="caption" color={colors.neutral.gray600} testID="vitals-optional-note">
                    {t('journeys.care.symptomChecker.vitals.optionalNote')}
                </Text>

                <Card journey="care" elevation="sm">
                    {renderVitalField('temperature', 'temperatureLabel', 'celsius', 'temperaturePlaceholder')}
                </Card>

                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.vitals.bloodPressureLabel')}
                    </Text>
                    <View style={styles.bpRow}>
                        <View style={styles.bpField}>
                            <Text fontSize="text-xs" color={colors.neutral.gray600}>
                                {t('journeys.care.symptomChecker.vitals.systolicLabel')}
                            </Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    touched.systolic && !getValidation('systolic').isValid && styles.textInputError,
                                ]}
                                value={vitals.systolic}
                                onChangeText={(value) => updateVital('systolic', value)}
                                onBlur={() => handleBlur('systolic')}
                                placeholder={t('journeys.care.symptomChecker.vitals.systolicPlaceholder')}
                                placeholderTextColor={colors.neutral.gray400}
                                keyboardType="decimal-pad"
                                accessibilityLabel={t('journeys.care.symptomChecker.vitals.systolicLabel')}
                                testID="vital-input-systolic"
                            />
                            {touched.systolic && !getValidation('systolic').isValid && (
                                <Text fontSize="text-xs" color={colors.semantic.error} testID="vital-error-systolic">
                                    {getValidation('systolic').error}
                                </Text>
                            )}
                        </View>
                        <Text fontSize="heading-md" color={colors.neutral.gray400}>
                            /
                        </Text>
                        <View style={styles.bpField}>
                            <Text fontSize="text-xs" color={colors.neutral.gray600}>
                                {t('journeys.care.symptomChecker.vitals.diastolicLabel')}
                            </Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    touched.diastolic && !getValidation('diastolic').isValid && styles.textInputError,
                                ]}
                                value={vitals.diastolic}
                                onChangeText={(value) => updateVital('diastolic', value)}
                                onBlur={() => handleBlur('diastolic')}
                                placeholder={t('journeys.care.symptomChecker.vitals.diastolicPlaceholder')}
                                placeholderTextColor={colors.neutral.gray400}
                                keyboardType="decimal-pad"
                                accessibilityLabel={t('journeys.care.symptomChecker.vitals.diastolicLabel')}
                                testID="vital-input-diastolic"
                            />
                            {touched.diastolic && !getValidation('diastolic').isValid && (
                                <Text fontSize="text-xs" color={colors.semantic.error} testID="vital-error-diastolic">
                                    {getValidation('diastolic').error}
                                </Text>
                            )}
                        </View>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.symptomChecker.vitals.units.mmHg')}
                        </Text>
                    </View>
                </Card>

                <Card journey="care" elevation="sm">
                    {renderVitalField('heartRate', 'heartRateLabel', 'bpm', 'heartRatePlaceholder')}
                </Card>

                <Card journey="care" elevation="sm">
                    {renderVitalField('spo2', 'spo2Label', 'percent', 'spo2Placeholder')}
                </Card>

                <View style={styles.buttonRow}>
                    <Button
                        variant="secondary"
                        onPress={handleBack}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.vitals.back')}
                        testID="back-button"
                    >
                        {t('journeys.care.symptomChecker.vitals.back')}
                    </Button>
                    {hasAnyVitals ? (
                        <Button
                            onPress={handleContinue}
                            journey="care"
                            disabled={hasAnyErrors()}
                            accessibilityLabel={t('journeys.care.symptomChecker.vitals.continue')}
                            testID="continue-button"
                        >
                            {t('journeys.care.symptomChecker.vitals.continue')}
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            onPress={handleSkip}
                            journey="care"
                            accessibilityLabel={t('journeys.care.symptomChecker.vitals.skip')}
                            testID="skip-button"
                        >
                            {t('journeys.care.symptomChecker.vitals.skip')}
                        </Button>
                    )}
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
        vitalField: {
            marginBottom: spacingValues.sm,
        },
        inputRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacingValues.sm,
            marginTop: spacingValues.xs,
        },
        bpRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacingValues.sm,
            marginTop: spacingValues.sm,
        },
        bpField: {
            flex: 1,
            gap: spacingValues['3xs'],
        },
        textInput: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            borderRadius: spacingValues.xs,
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.sm,
            fontSize: 16,
            color: colors.journeys.care.text,
            backgroundColor: theme.colors.background.default,
        },
        textInputError: {
            borderColor: colors.semantic.error,
            borderWidth: 2,
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacingValues.xl,
            gap: spacingValues.md,
        },
    });

export { SymptomVitals };
export default SymptomVitals;
