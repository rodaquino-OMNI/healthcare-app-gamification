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

interface MoodAssessmentData {
    moodRating?: number;
    moodFrequency?: string;
    recentMoodChanges?: string;
    sleepImpact?: string;
}

interface StepProps {
    data: MoodAssessmentData;
    onUpdate: (field: keyof MoodAssessmentData, value: string | number) => void;
}

const MOOD_LEVELS = [
    { key: 1, emoji: '\uD83D\uDE04', color: colors.semantic.success },
    { key: 2, emoji: '\uD83D\uDE42', color: colors.semantic.success },
    { key: 3, emoji: '\uD83D\uDE10', color: colors.semantic.warning },
    { key: 4, emoji: '\uD83D\uDE1E', color: colors.semantic.warning },
    { key: 5, emoji: '\uD83D\uDE22', color: colors.semantic.error },
] as const;

const MOOD_FREQUENCY = ['always', 'often', 'sometimes', 'rarely'] as const;

const SLEEP_IMPACT = ['yes', 'sometimes', 'no'] as const;

export const StepMoodAssessment: React.FC<StepProps> = ({ data, onUpdate }) => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Mood Rating */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.moodAssessment.moodTitle')}
            </Text>
            <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
                {t('healthAssessment.moodAssessment.moodSubtitle')}
            </Text>
            <View style={styles.moodRow}>
                {MOOD_LEVELS.map(({ key, emoji, color }) => {
                    const selected = data.moodRating === key;
                    return (
                        <Touchable
                            key={key}
                            onPress={() => onUpdate('moodRating', key)}
                            accessibilityLabel={t(`healthAssessment.moodAssessment.mood.${key}`)}
                            accessibilityRole="button"
                            testID={`mood-rating-${key}`}
                            style={[
                                styles.moodCard,
                                selected && {
                                    borderColor: color,
                                    backgroundColor: colors.journeys.health.background,
                                },
                            ]}
                        >
                            <Text fontSize="heading-xl" textAlign="center">
                                {emoji}
                            </Text>
                            <Text
                                fontSize="xs"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? color : colors.neutral.gray600}
                                textAlign="center"
                            >
                                {t(`healthAssessment.moodAssessment.mood.${key}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Mood Frequency */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.moodAssessment.frequencyTitle')}
            </Text>
            <View style={styles.optionList}>
                {MOOD_FREQUENCY.map((freq) => {
                    const selected = data.moodFrequency === freq;
                    return (
                        <Touchable
                            key={freq}
                            onPress={() => onUpdate('moodFrequency', freq)}
                            accessibilityLabel={t(`healthAssessment.moodAssessment.frequency.${freq}`)}
                            accessibilityRole="button"
                            testID={`mood-frequency-${freq}`}
                            style={[styles.optionCard, selected ? styles.optionCardSelected : null]}
                        >
                            <View style={[styles.radioCircle, selected ? styles.radioCircleSelected : null]}>
                                {selected && <View style={styles.radioInner} />}
                            </View>
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.journeys.health.text : colors.neutral.gray700}
                                style={styles.optionLabel}
                            >
                                {t(`healthAssessment.moodAssessment.frequency.${freq}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Recent Changes */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.moodAssessment.recentChangesTitle')}
            </Text>
            <View style={styles.chipRow}>
                {(['yes', 'no'] as const).map((opt) => {
                    const selected = data.recentMoodChanges === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('recentMoodChanges', opt)}
                            accessibilityLabel={t(`healthAssessment.moodAssessment.yesNo.${opt}`)}
                            accessibilityRole="button"
                            testID={`recent-changes-${opt}`}
                            style={[styles.chip, selected ? styles.chipSelected : null]}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.neutral.white : colors.neutral.gray700}
                            >
                                {t(`healthAssessment.moodAssessment.yesNo.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Sleep Impact */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.moodAssessment.sleepImpactTitle')}
            </Text>
            <View style={styles.chipRow}>
                {SLEEP_IMPACT.map((opt) => {
                    const selected = data.sleepImpact === opt;
                    return (
                        <Touchable
                            key={opt}
                            onPress={() => onUpdate('sleepImpact', opt)}
                            accessibilityLabel={t(`healthAssessment.moodAssessment.sleepImpact.${opt}`)}
                            accessibilityRole="button"
                            testID={`sleep-impact-${opt}`}
                            style={[styles.chip, selected ? styles.chipSelected : null]}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.neutral.white : colors.neutral.gray700}
                            >
                                {t(`healthAssessment.moodAssessment.sleepImpact.${opt}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Info Card */}
            <Card journey="health" elevation="sm" padding="md" style={styles.infoCard}>
                <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                    {t('healthAssessment.moodAssessment.tipTitle')}
                </Text>
                <Text fontSize="sm" color={colors.neutral.gray600} style={styles.infoText}>
                    {t('healthAssessment.moodAssessment.tipMessage')}
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
            marginBottom: spacingValues.xs,
        },
        subtitle: {
            marginBottom: spacingValues.md,
        },
        moodRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: spacingValues.xs,
        },
        moodCard: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            borderRadius: borderRadiusValues.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        optionList: {
            gap: spacingValues.xs,
        },
        optionCard: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.md,
            borderRadius: borderRadiusValues.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        optionCardSelected: {
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
        optionLabel: {
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
            borderLeftColor: colors.journeys.health.primary,
        },
        infoText: {
            marginTop: spacingValues.xs,
            lineHeight: 20,
        },
    });

export default StepMoodAssessment;
