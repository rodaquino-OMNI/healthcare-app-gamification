/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import type { Theme } from '@design-system/themes/base.theme';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

interface StepProps {
    data: Record<string, any>;
    onUpdate: (field: string, value: any) => void;
}

const FREQUENCY_OPTIONS = ['never', '1-2x', '3-4x', '5+'] as const;

const EXERCISE_TYPES = [
    { key: 'walking', emoji: '\uD83D\uDEB6' },
    { key: 'running', emoji: '\uD83C\uDFC3' },
    { key: 'swimming', emoji: '\uD83C\uDFCA' },
    { key: 'cycling', emoji: '\uD83D\uDEB4' },
    { key: 'gym', emoji: '\uD83C\uDFCB\uFE0F' },
    { key: 'yoga', emoji: '\uD83E\uDDD8' },
    { key: 'dance', emoji: '\uD83D\uDC83' },
    { key: 'sports', emoji: '\u26BD' },
] as const;

const DURATION_OPTIONS = ['15min', '30min', '45min', '60min+'] as const;

export const StepExercise: React.FC<StepProps> = ({ data, onUpdate }) => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    const selectedTypes: string[] = data.exerciseTypes ?? [];

    const handleToggleType = useCallback(
        (typeKey: string) => {
            const updated = selectedTypes.includes(typeKey)
                ? selectedTypes.filter((k) => k !== typeKey)
                : [...selectedTypes, typeKey];
            onUpdate('exerciseTypes', updated);
        },
        [selectedTypes, onUpdate]
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Frequency */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.exercise.frequencyTitle')}
            </Text>
            <View style={styles.optionRow}>
                {FREQUENCY_OPTIONS.map((opt) => {
                    const selected = data.exerciseFrequency === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('exerciseFrequency', opt)}
                            accessibilityLabel={t(`healthAssessment.exercise.frequency.${opt}`)}
                            accessibilityRole="button"
                            testID={`exercise-frequency-${opt}`}
                            style={[styles.optionChip, selected && styles.optionChipSelected] as any}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.neutral.white : colors.neutral.gray700}
                            >
                                {t(`healthAssessment.exercise.frequency.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Exercise Types */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.exercise.typeTitle')}
            </Text>
            <View style={styles.typeGrid}>
                {EXERCISE_TYPES.map(({ key, emoji }) => {
                    const selected = selectedTypes.includes(key);
                    return (
                        <Touchable
                            key={key}
                            onPress={() => handleToggleType(key)}
                            accessibilityLabel={t(`healthAssessment.exercise.type.${key}`)}
                            accessibilityRole="button"
                            testID={`exercise-type-${key}`}
                            style={[styles.typeCard, selected && styles.typeCardSelected] as any}
                        >
                            <Text fontSize="heading-xl" textAlign="center">
                                {emoji}
                            </Text>
                            <Text
                                fontSize="xs"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.neutral.white : colors.neutral.gray700}
                                textAlign="center"
                                style={styles.typeLabel}
                            >
                                {t(`healthAssessment.exercise.type.${key}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Duration */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.exercise.durationTitle')}
            </Text>
            <View style={styles.optionRow}>
                {DURATION_OPTIONS.map((opt) => {
                    const selected = data.exerciseDuration === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('exerciseDuration', opt)}
                            accessibilityLabel={t(`healthAssessment.exercise.duration.${opt}`)}
                            accessibilityRole="button"
                            testID={`exercise-duration-${opt}`}
                            style={[styles.optionChip, selected && styles.optionChipSelected] as any}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.neutral.white : colors.neutral.gray700}
                            >
                                {t(`healthAssessment.exercise.duration.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Tip Card */}
            <Card journey="health" elevation="sm" padding="md" style={styles.tipCard}>
                <Text fontSize="sm" color={colors.neutral.gray600}>
                    {t('healthAssessment.exercise.tip')}
                </Text>
            </Card>
        </ScrollView>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        scrollContent: {
            paddingHorizontal: spacingValues.md,
            paddingBottom: spacingValues['3xl'],
        },
        sectionTitle: {
            marginTop: spacingValues.xl,
            marginBottom: spacingValues.sm,
        },
        optionRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacingValues.xs,
        },
        optionChip: {
            paddingVertical: spacingValues.xs,
            paddingHorizontal: spacingValues.md,
            borderRadius: borderRadiusValues.full,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        optionChipSelected: {
            backgroundColor: colors.journeys.health.primary,
            borderColor: colors.journeys.health.primary,
        },
        typeGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacingValues.sm,
        },
        typeCard: {
            width: '22%',
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues['3xs'],
            borderRadius: borderRadiusValues.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        typeCardSelected: {
            backgroundColor: colors.journeys.health.primary,
            borderColor: colors.journeys.health.primary,
        },
        typeLabel: {
            marginTop: spacingValues['3xs'],
        },
        tipCard: {
            marginTop: spacingValues.xl,
        },
    });

export default StepExercise;
