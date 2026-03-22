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

interface SleepData {
    sleepHours?: string;
    sleepQuality?: string;
    sleepIssues?: string[];
    regularSchedule?: string;
}

interface StepProps {
    data: SleepData;
    onUpdate: (field: keyof SleepData, value: string | string[]) => void;
}

const SLEEP_HOURS = ['4h', '5h', '6h', '7h', '8h', '9h', '10h+'] as const;

const SLEEP_QUALITY = ['poor', 'fair', 'good', 'excellent'] as const;

const SLEEP_ISSUES = ['insomnia', 'snoring', 'sleepApnea', 'restlessLegs', 'nightmares'] as const;

const QUALITY_COLORS: Record<string, string> = {
    poor: colors.semantic.error,
    fair: colors.semantic.warning,
    good: colors.semantic.success,
    excellent: colors.journeys.health.primary,
};

export const StepSleep: React.FC<StepProps> = ({ data, onUpdate }) => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    const selectedIssues: string[] = data.sleepIssues ?? [];

    const handleToggleIssue = useCallback(
        (issue: string) => {
            const updated = selectedIssues.includes(issue)
                ? selectedIssues.filter((i) => i !== issue)
                : [...selectedIssues, issue];
            onUpdate('sleepIssues', updated);
        },
        [selectedIssues, onUpdate]
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Sleep Hours */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.sleep.hoursTitle')}
            </Text>
            <View style={styles.hoursRow}>
                {SLEEP_HOURS.map((opt) => {
                    const selected = data.sleepHours === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('sleepHours', opt)}
                            accessibilityLabel={t(`healthAssessment.sleep.hours.${opt}`)}
                            accessibilityRole="button"
                            testID={`sleep-hours-${opt}`}
                            style={[styles.hourChip, selected ? styles.hourChipSelected : null]}
                        >
                            <Text fontSize="heading-lg" textAlign="center">
                                {'\uD83C\uDF19'}
                            </Text>
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.neutral.white : colors.neutral.gray700}
                                textAlign="center"
                            >
                                {t(`healthAssessment.sleep.hours.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Sleep Quality */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.sleep.qualityTitle')}
            </Text>
            <View style={styles.qualityRow}>
                {SLEEP_QUALITY.map((opt) => {
                    const selected = data.sleepQuality === opt;
                    const indicatorColor = QUALITY_COLORS[opt];
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('sleepQuality', opt)}
                            accessibilityLabel={t(`healthAssessment.sleep.quality.${opt}`)}
                            accessibilityRole="button"
                            testID={`sleep-quality-${opt}`}
                            style={[
                                styles.qualityCard,
                                selected && {
                                    borderColor: indicatorColor,
                                    backgroundColor: colors.journeys.health.background,
                                },
                            ]}
                        >
                            <View style={[styles.qualityIndicator, { backgroundColor: indicatorColor }]} />
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.journeys.health.text : colors.neutral.gray700}
                                textAlign="center"
                            >
                                {t(`healthAssessment.sleep.quality.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Sleep Issues */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.sleep.issuesTitle')}
            </Text>
            {SLEEP_ISSUES.map((issue) => {
                const selected = selectedIssues.includes(issue);
                return (
                    <Touchable
                        key={issue}
                        onPress={() => handleToggleIssue(issue)}
                        accessibilityLabel={t(`healthAssessment.sleep.issues.${issue}`)}
                        accessibilityRole="checkbox"
                        testID={`sleep-issue-${issue}`}
                        style={[styles.issueRow, selected ? styles.issueRowSelected : null]}
                    >
                        <View style={[styles.checkbox, selected ? styles.checkboxSelected : null]}>
                            {selected && (
                                <Text fontSize="xs" color={colors.neutral.white} textAlign="center">
                                    {'\u2713'}
                                </Text>
                            )}
                        </View>
                        <Text
                            fontSize="sm"
                            fontWeight={selected ? 'semiBold' : 'regular'}
                            color={selected ? colors.journeys.health.text : colors.neutral.gray700}
                            style={styles.issueLabel}
                        >
                            {t(`healthAssessment.sleep.issues.${issue}`)}
                        </Text>
                    </Touchable>
                );
            })}

            {/* Regular Schedule Toggle */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.sleep.scheduleTitle')}
            </Text>
            <View style={styles.toggleRow}>
                {(['yes', 'no'] as const).map((opt) => {
                    const selected = data.regularSchedule === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('regularSchedule', opt)}
                            accessibilityLabel={t(`healthAssessment.sleep.schedule.${opt}`)}
                            accessibilityRole="button"
                            testID={`sleep-schedule-${opt}`}
                            style={[styles.toggleChip, selected ? styles.toggleChipSelected : null]}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.neutral.white : colors.neutral.gray700}
                            >
                                {t(`healthAssessment.sleep.schedule.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Tip Card */}
            <Card journey="health" elevation="sm" padding="md" style={styles.tipCard}>
                <Text fontSize="sm" color={colors.neutral.gray600}>
                    {t('healthAssessment.sleep.tip')}
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
        hoursRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacingValues.xs,
        },
        hourChip: {
            alignItems: 'center',
            paddingVertical: spacingValues.xs,
            paddingHorizontal: spacingValues.sm,
            borderRadius: borderRadiusValues.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        hourChipSelected: {
            backgroundColor: colors.journeys.health.primary,
            borderColor: colors.journeys.health.primary,
        },
        qualityRow: {
            flexDirection: 'row',
            gap: spacingValues.xs,
        },
        qualityCard: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            borderRadius: borderRadiusValues.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        qualityIndicator: {
            width: 8,
            height: 8,
            borderRadius: borderRadiusValues.full,
            marginBottom: spacingValues['3xs'],
        },
        issueRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.md,
            marginBottom: spacingValues.xs,
            borderRadius: borderRadiusValues.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        issueRowSelected: {
            borderColor: colors.journeys.health.primary,
            backgroundColor: colors.journeys.health.background,
        },
        checkbox: {
            width: 20,
            height: 20,
            borderRadius: borderRadiusValues.xs,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkboxSelected: {
            backgroundColor: colors.journeys.health.primary,
            borderColor: colors.journeys.health.primary,
        },
        issueLabel: {
            marginLeft: spacingValues.sm,
            flex: 1,
        },
        toggleRow: {
            flexDirection: 'row',
            gap: spacingValues.sm,
        },
        toggleChip: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            borderRadius: borderRadiusValues.full,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        toggleChipSelected: {
            backgroundColor: colors.journeys.health.primary,
            borderColor: colors.journeys.health.primary,
        },
        tipCard: {
            marginTop: spacingValues.xl,
        },
    });

export default StepSleep;
