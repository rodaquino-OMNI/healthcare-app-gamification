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

const SMOKING_STATUS = ['never', 'former', 'current'] as const;

const CIGARETTES_PER_DAY = ['1-5', '6-10', '11-20', '20+'] as const;

const YEARS_SMOKING = ['<1', '1-5', '5-10', '10+'] as const;

const ALCOHOL_FREQUENCY = ['never', 'occasionally', 'weekly', 'daily'] as const;

const DRINKS_PER_WEEK = ['1-3', '4-7', '8-14', '15+'] as const;

const DRUG_SCREENING = ['preferNotToAnswer', 'no', 'yes'] as const;

const showSmokingDetails = (status: string | undefined): boolean => status === 'current' || status === 'former';

const showAlcoholDetails = (frequency: string | undefined): boolean => frequency !== undefined && frequency !== 'never';

export const StepAlcoholTobacco: React.FC<StepProps> = ({ data, onUpdate }) => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Smoking Status */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.alcoholTobacco.smokingTitle')}
            </Text>
            <View style={styles.optionRow}>
                {SMOKING_STATUS.map((opt) => {
                    const selected = data.smokingStatus === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('smokingStatus', opt)}
                            accessibilityLabel={t(`healthAssessment.alcoholTobacco.smoking.${opt}`)}
                            accessibilityRole="button"
                            testID={`smoking-status-${opt}`}
                            style={[styles.radioCard, selected && styles.radioCardSelected] as any}
                        >
                            <View style={[styles.radioCircle, selected && styles.radioCircleSelected] as any}>
                                {selected && <View style={styles.radioInner} />}
                            </View>
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.journeys.health.text : colors.neutral.gray700}
                                style={styles.radioLabel}
                            >
                                {t(`healthAssessment.alcoholTobacco.smoking.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Smoking Details (conditional) */}
            {showSmokingDetails(data.smokingStatus) && (
                <>
                    <Text
                        fontSize="md"
                        fontWeight="medium"
                        color={colors.neutral.gray700}
                        style={styles.subSectionTitle}
                    >
                        {t('healthAssessment.alcoholTobacco.cigarettesPerDayTitle')}
                    </Text>
                    <View style={styles.chipRow}>
                        {CIGARETTES_PER_DAY.map((opt) => {
                            const selected = data.cigarettesPerDay === opt;
                            return (
                                <Touchable
                                    key={opt}
                                    onPress={() => onUpdate('cigarettesPerDay', opt)}
                                    accessibilityLabel={t(`healthAssessment.alcoholTobacco.cigarettesPerDay.${opt}`)}
                                    accessibilityRole="button"
                                    testID={`cigarettes-${opt}`}
                                    style={[styles.chip, selected && styles.chipSelected] as any}
                                >
                                    <Text
                                        fontSize="sm"
                                        fontWeight={selected ? 'semiBold' : 'regular'}
                                        color={selected ? colors.neutral.white : colors.neutral.gray700}
                                    >
                                        {t(`healthAssessment.alcoholTobacco.cigarettesPerDay.${opt}`)}
                                    </Text>
                                </Touchable>
                            );
                        })}
                    </View>

                    <Text
                        fontSize="md"
                        fontWeight="medium"
                        color={colors.neutral.gray700}
                        style={styles.subSectionTitle}
                    >
                        {t('healthAssessment.alcoholTobacco.yearsSmokingTitle')}
                    </Text>
                    <View style={styles.chipRow}>
                        {YEARS_SMOKING.map((opt) => {
                            const selected = data.yearsSmoking === opt;
                            return (
                                <Touchable
                                    key={opt}
                                    onPress={() => onUpdate('yearsSmoking', opt)}
                                    accessibilityLabel={t(`healthAssessment.alcoholTobacco.yearsSmoking.${opt}`)}
                                    accessibilityRole="button"
                                    testID={`years-smoking-${opt}`}
                                    style={[styles.chip, selected && styles.chipSelected] as any}
                                >
                                    <Text
                                        fontSize="sm"
                                        fontWeight={selected ? 'semiBold' : 'regular'}
                                        color={selected ? colors.neutral.white : colors.neutral.gray700}
                                    >
                                        {t(`healthAssessment.alcoholTobacco.yearsSmoking.${opt}`)}
                                    </Text>
                                </Touchable>
                            );
                        })}
                    </View>
                </>
            )}

            {/* Alcohol Consumption */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.alcoholTobacco.alcoholTitle')}
            </Text>
            <View style={styles.optionRow}>
                {ALCOHOL_FREQUENCY.map((opt) => {
                    const selected = data.alcoholFrequency === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('alcoholFrequency', opt)}
                            accessibilityLabel={t(`healthAssessment.alcoholTobacco.alcohol.${opt}`)}
                            accessibilityRole="button"
                            testID={`alcohol-frequency-${opt}`}
                            style={[styles.radioCard, selected && styles.radioCardSelected] as any}
                        >
                            <View style={[styles.radioCircle, selected && styles.radioCircleSelected] as any}>
                                {selected && <View style={styles.radioInner} />}
                            </View>
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.journeys.health.text : colors.neutral.gray700}
                                style={styles.radioLabel}
                            >
                                {t(`healthAssessment.alcoholTobacco.alcohol.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Drinks Per Week (conditional) */}
            {showAlcoholDetails(data.alcoholFrequency) && (
                <>
                    <Text
                        fontSize="md"
                        fontWeight="medium"
                        color={colors.neutral.gray700}
                        style={styles.subSectionTitle}
                    >
                        {t('healthAssessment.alcoholTobacco.drinksPerWeekTitle')}
                    </Text>
                    <View style={styles.chipRow}>
                        {DRINKS_PER_WEEK.map((opt) => {
                            const selected = data.drinksPerWeek === opt;
                            return (
                                <Touchable
                                    key={opt}
                                    onPress={() => onUpdate('drinksPerWeek', opt)}
                                    accessibilityLabel={t(`healthAssessment.alcoholTobacco.drinksPerWeek.${opt}`)}
                                    accessibilityRole="button"
                                    testID={`drinks-per-week-${opt}`}
                                    style={[styles.chip, selected && styles.chipSelected] as any}
                                >
                                    <Text
                                        fontSize="sm"
                                        fontWeight={selected ? 'semiBold' : 'regular'}
                                        color={selected ? colors.neutral.white : colors.neutral.gray700}
                                    >
                                        {t(`healthAssessment.alcoholTobacco.drinksPerWeek.${opt}`)}
                                    </Text>
                                </Touchable>
                            );
                        })}
                    </View>
                </>
            )}

            {/* Drug Use Screening */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.alcoholTobacco.drugScreeningTitle')}
            </Text>
            <View style={styles.optionRow}>
                {DRUG_SCREENING.map((opt) => {
                    const selected = data.drugScreening === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('drugScreening', opt)}
                            accessibilityLabel={t(`healthAssessment.alcoholTobacco.drugScreening.${opt}`)}
                            accessibilityRole="button"
                            testID={`drug-screening-${opt}`}
                            style={[styles.radioCard, selected && styles.radioCardSelected] as any}
                        >
                            <View style={[styles.radioCircle, selected && styles.radioCircleSelected] as any}>
                                {selected && <View style={styles.radioInner} />}
                            </View>
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.journeys.health.text : colors.neutral.gray700}
                                style={styles.radioLabel}
                            >
                                {t(`healthAssessment.alcoholTobacco.drugScreening.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Health Impact Info Card */}
            <Card journey="health" elevation="sm" padding="md" style={styles.infoCard}>
                <View style={styles.infoHeader}>
                    <Text fontSize="md" fontWeight="semiBold" color={colors.semantic.warning}>
                        {t('healthAssessment.alcoholTobacco.infoTitle')}
                    </Text>
                </View>
                <Text fontSize="sm" color={colors.neutral.gray600} style={styles.infoText}>
                    {t('healthAssessment.alcoholTobacco.infoMessage')}
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
        subSectionTitle: {
            marginTop: spacingValues.md,
            marginBottom: spacingValues.xs,
        },
        optionRow: {
            gap: spacingValues.xs,
        },
        radioCard: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.md,
            borderRadius: borderRadiusValues.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        radioCardSelected: {
            borderColor: colors.journeys.health.primary,
            backgroundColor: colors.journeys.health.background,
        },
        radioCircle: {
            width: 20,
            height: 20,
            borderRadius: borderRadiusValues.full,
            borderWidth: 2,
            borderColor: theme.colors.border.default,
            alignItems: 'center',
            justifyContent: 'center',
        },
        radioCircleSelected: {
            borderColor: colors.journeys.health.primary,
        },
        radioInner: {
            width: 10,
            height: 10,
            borderRadius: borderRadiusValues.full,
            backgroundColor: colors.journeys.health.primary,
        },
        radioLabel: {
            marginLeft: spacingValues.sm,
            flex: 1,
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
        infoCard: {
            marginTop: spacingValues.xl,
            borderLeftWidth: 3,
            borderLeftColor: colors.semantic.warning,
        },
        infoHeader: {
            marginBottom: spacingValues.xs,
        },
        infoText: {
            lineHeight: 20,
        },
    });

export default StepAlcoholTobacco;
