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

const MAX_PRIORITIES = 3;

const GOAL_KEYS = [
    'weightLoss',
    'fitness',
    'sleepImprovement',
    'stressManagement',
    'nutrition',
    'diseasePrevention',
    'mentalHealth',
    'energy',
    'flexibility',
] as const;

const GOAL_EMOJIS: Record<string, string> = {
    weightLoss: '\u2696\uFE0F',
    fitness: '\uD83C\uDFCB\uFE0F',
    sleepImprovement: '\uD83D\uDCA4',
    stressManagement: '\uD83E\uDDD8',
    nutrition: '\uD83E\uDD57',
    diseasePrevention: '\uD83D\uDEE1\uFE0F',
    mentalHealth: '\uD83E\uDDE0',
    energy: '\u26A1',
    flexibility: '\uD83E\uDD38',
};

export const StepHealthGoals: React.FC<StepProps> = ({ data, onUpdate }) => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    const selectedGoals: string[] = data.healthGoals ?? [];
    const priorities: string[] = data.goalPriorities ?? [];

    const handleToggleGoal = useCallback(
        (goal: string) => {
            const isSelected = selectedGoals.includes(goal);
            const updatedGoals = isSelected ? selectedGoals.filter((g) => g !== goal) : [...selectedGoals, goal];
            onUpdate('healthGoals', updatedGoals);

            if (isSelected) {
                onUpdate(
                    'goalPriorities',
                    priorities.filter((p) => p !== goal)
                );
            }
        },
        [selectedGoals, priorities, onUpdate]
    );

    const handleTogglePriority = useCallback(
        (goal: string) => {
            if (!selectedGoals.includes(goal)) {
                return;
            }
            const isPriority = priorities.includes(goal);
            if (isPriority) {
                onUpdate(
                    'goalPriorities',
                    priorities.filter((p) => p !== goal)
                );
            } else if (priorities.length < MAX_PRIORITIES) {
                onUpdate('goalPriorities', [...priorities, goal]);
            }
        },
        [selectedGoals, priorities, onUpdate]
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Goal Selection */}
            <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                {t('healthAssessment.healthGoals.title')}
            </Text>
            <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
                {t('healthAssessment.healthGoals.subtitle')}
            </Text>

            <View style={styles.goalGrid}>
                {GOAL_KEYS.map((goal) => {
                    const selected = selectedGoals.includes(goal);
                    return (
                        <Touchable
                            key={goal}
                            onPress={() => handleToggleGoal(goal)}
                            accessibilityLabel={t(`healthAssessment.healthGoals.goals.${goal}`)}
                            accessibilityRole="checkbox"
                            testID={`goal-${goal}`}
                            style={[styles.goalChip, selected && styles.goalChipSelected] as any}
                        >
                            <Text fontSize="heading-md" textAlign="center">
                                {GOAL_EMOJIS[goal]}
                            </Text>
                            <Text
                                fontSize="sm"
                                fontWeight={selected ? 'semiBold' : 'regular'}
                                color={selected ? colors.journeys.health.text : colors.neutral.gray700}
                                textAlign="center"
                            >
                                {t(`healthAssessment.healthGoals.goals.${goal}`)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Priority Selection */}
            {selectedGoals.length > 0 && (
                <>
                    <Text variant="heading" fontSize="lg" journey="health" style={styles.sectionTitle}>
                        {t('healthAssessment.healthGoals.priorityTitle')}
                    </Text>
                    <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
                        {t('healthAssessment.healthGoals.prioritySubtitle', { max: MAX_PRIORITIES })}
                    </Text>

                    <View style={styles.chipGrid}>
                        {selectedGoals.map((goal) => {
                            const isPriority = priorities.includes(goal);
                            const rank = priorities.indexOf(goal) + 1;
                            return (
                                <Touchable
                                    key={goal}
                                    onPress={() => handleTogglePriority(goal)}
                                    accessibilityLabel={t(`healthAssessment.healthGoals.goals.${goal}`)}
                                    accessibilityRole="button"
                                    testID={`priority-${goal}`}
                                    style={[styles.priorityChip, isPriority && styles.priorityChipSelected] as any}
                                >
                                    {isPriority && (
                                        <View style={styles.priorityBadge}>
                                            <Text fontSize="xs" fontWeight="bold" color={colors.neutral.white}>
                                                {String(rank)}
                                            </Text>
                                        </View>
                                    )}
                                    <Text
                                        fontSize="sm"
                                        fontWeight={isPriority ? 'semiBold' : 'regular'}
                                        color={isPriority ? colors.neutral.white : colors.neutral.gray700}
                                    >
                                        {t(`healthAssessment.healthGoals.goals.${goal}`)}
                                    </Text>
                                </Touchable>
                            );
                        })}
                    </View>
                </>
            )}

            {/* Tip Card */}
            <Card journey="health" elevation="sm" padding="md" style={styles.tipCard}>
                <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                    {t('healthAssessment.healthGoals.tipTitle')}
                </Text>
                <Text fontSize="sm" color={colors.neutral.gray600} style={styles.tipText}>
                    {t('healthAssessment.healthGoals.tipMessage')}
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
        goalGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacingValues.xs,
        },
        goalChip: {
            width: '31%',
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.xs,
            borderRadius: borderRadiusValues.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        goalChipSelected: {
            borderColor: colors.journeys.health.primary,
            backgroundColor: colors.journeys.health.background,
        },
        chipGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacingValues.xs,
        },
        priorityChip: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacingValues.xs,
            paddingHorizontal: spacingValues.md,
            borderRadius: borderRadiusValues.full,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
            gap: spacingValues.xs,
        },
        priorityChipSelected: {
            backgroundColor: colors.journeys.health.primary,
            borderColor: colors.journeys.health.primary,
        },
        priorityBadge: {
            width: 20,
            height: 20,
            borderRadius: borderRadiusValues.full,
            backgroundColor: colors.semantic.success,
            alignItems: 'center',
            justifyContent: 'center',
        },
        tipCard: {
            marginTop: spacingValues.xl,
            borderLeftWidth: 3,
            borderLeftColor: colors.journeys.health.primary,
        },
        tipText: {
            marginTop: spacingValues.xs,
            lineHeight: 20,
        },
    });

export default StepHealthGoals;
