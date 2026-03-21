/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import type { Theme } from '@design-system/themes/base.theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

interface StepProps {
    data: Record<string, any>;
    onUpdate: (field: string, value: any) => void;
}

const WATER_INTAKE_OPTIONS = [
    { key: '<1L', fillLevel: 0.2 },
    { key: '1-2L', fillLevel: 0.5 },
    { key: '2-3L', fillLevel: 0.75 },
    { key: '3L+', fillLevel: 1.0 },
] as const;

const CAFFEINE_OPTIONS = ['none', '1-2cups', '3-4cups', '5+cups'] as const;

const SUGARY_DRINK_OPTIONS = ['never', 'rarely', 'daily', 'multipleDailyServings'] as const;

const GLASS_MAX_HEIGHT = 60;

export const StepWaterIntake: React.FC<StepProps> = ({ data, onUpdate }) => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Daily Water Intake */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.waterIntake.dailyTitle')}
            </Text>
            <View style={styles.waterRow}>
                {WATER_INTAKE_OPTIONS.map(({ key, fillLevel }) => {
                    const selected = data.dailyWaterIntake === key;
                    const fillHeight = fillLevel * GLASS_MAX_HEIGHT;
                    return (
                        <Touchable
                            key={key}
                            onPress={() => onUpdate('dailyWaterIntake', key)}
                            accessibilityLabel={t(`healthAssessment.waterIntake.daily.${key}`)}
                            accessibilityRole="button"
                            testID={`water-intake-${key}`}
                            style={[styles.waterCard, selected && styles.waterCardSelected] as any}
                        >
                            {/* Glass visualization */}
                            <View style={styles.glassContainer}>
                                <View style={styles.glass}>
                                    <View
                                        style={[
                                            styles.glassFill,
                                            {
                                                height: fillHeight,
                                                backgroundColor: selected
                                                    ? colors.journeys.health.primary
                                                    : colors.brand.primary,
                                                opacity: selected ? 1 : 0.4,
                                            },
                                        ]}
                                    />
                                </View>
                            </View>
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.journeys.health.primary : colors.neutral.gray700}
                                textAlign="center"
                                style={styles.waterLabel}
                            >
                                {t(`healthAssessment.waterIntake.daily.${key}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Caffeine Consumption */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.waterIntake.caffeineTitle')}
            </Text>
            <View style={styles.chipRow}>
                {CAFFEINE_OPTIONS.map((opt) => {
                    const selected = data.caffeineConsumption === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('caffeineConsumption', opt)}
                            accessibilityLabel={t(`healthAssessment.waterIntake.caffeine.${opt}`)}
                            accessibilityRole="button"
                            testID={`caffeine-${opt}`}
                            style={[styles.chip, selected && styles.chipSelected] as any}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.neutral.white : colors.neutral.gray700}
                            >
                                {t(`healthAssessment.waterIntake.caffeine.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Sugary Drinks */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.waterIntake.sugaryTitle')}
            </Text>
            <View style={styles.chipRow}>
                {SUGARY_DRINK_OPTIONS.map((opt) => {
                    const selected = data.sugaryDrinks === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('sugaryDrinks', opt)}
                            accessibilityLabel={t(`healthAssessment.waterIntake.sugary.${opt}`)}
                            accessibilityRole="button"
                            testID={`sugary-drinks-${opt}`}
                            style={[styles.chip, selected && styles.chipSelected] as any}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.neutral.white : colors.neutral.gray700}
                            >
                                {t(`healthAssessment.waterIntake.sugary.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Hydration Tip */}
            <Card journey="health" elevation="sm" padding="md" style={styles.tipCard}>
                <View style={styles.tipHeader}>
                    <Text fontSize="heading-lg" textAlign="center">
                        {'\uD83D\uDCA7'}
                    </Text>
                    <Text
                        fontSize="md"
                        fontWeight="semiBold"
                        color={colors.journeys.health.primary}
                        style={styles.tipTitle}
                    >
                        {t('healthAssessment.waterIntake.tipTitle')}
                    </Text>
                </View>
                <Text fontSize="sm" color={colors.neutral.gray600} style={styles.tipText}>
                    {t('healthAssessment.waterIntake.tipMessage')}
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
        waterRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: spacingValues.xs,
        },
        waterCard: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues['3xs'],
            borderRadius: borderRadiusValues.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        waterCardSelected: {
            borderColor: colors.journeys.health.primary,
            backgroundColor: colors.journeys.health.background,
        },
        glassContainer: {
            marginBottom: spacingValues.xs,
        },
        glass: {
            width: 32,
            height: GLASS_MAX_HEIGHT,
            borderRadius: borderRadiusValues.xs,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            justifyContent: 'flex-end',
            overflow: 'hidden',
        },
        glassFill: {
            width: '100%',
            borderRadius: borderRadiusValues['2xs'],
        },
        waterLabel: {
            marginTop: spacingValues['3xs'],
        },
        chipRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacingValues.xs,
        },
        chip: {
            paddingVertical: spacingValues.xs,
            paddingHorizontal: spacingValues.md,
            borderRadius: borderRadiusValues.full,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        chipSelected: {
            backgroundColor: colors.journeys.health.primary,
            borderColor: colors.journeys.health.primary,
        },
        tipCard: {
            marginTop: spacingValues.xl,
        },
        tipHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacingValues.xs,
        },
        tipTitle: {
            marginLeft: spacingValues.xs,
        },
        tipText: {
            lineHeight: 20,
        },
    });

export default StepWaterIntake;
