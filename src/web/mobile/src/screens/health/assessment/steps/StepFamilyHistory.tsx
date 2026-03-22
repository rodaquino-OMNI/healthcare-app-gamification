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
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

interface FamilyHistoryData {
    conditions?: Record<string, FamilyCondition>;
}

interface StepProps {
    data: FamilyHistoryData;
    onUpdate: (field: keyof FamilyHistoryData, value: Record<string, FamilyCondition>) => void;
}

const FAMILY_CONDITION_KEYS = ['heartDisease', 'diabetes', 'cancer', 'stroke', 'hypertension', 'mentalHealth'] as const;

const RELATION_KEYS = ['parent', 'sibling', 'grandparent'] as const;

interface FamilyCondition {
    active: boolean;
    relation: string;
}

/**
 * StepFamilyHistory collects family medical history.
 * Card-based layout per condition with toggle and relation selector.
 */
export const StepFamilyHistory: React.FC<StepProps> = ({ data, onUpdate }) => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    const conditions: Record<string, FamilyCondition> = data.conditions || {};

    const handleToggleCondition = useCallback(
        (key: string) => {
            const current = conditions[key];
            if (current?.active) {
                const updated = { ...conditions };
                delete updated[key];
                onUpdate('conditions', updated);
            } else {
                onUpdate('conditions', {
                    ...conditions,
                    [key]: { active: true, relation: '' },
                });
            }
        },
        [conditions, onUpdate]
    );

    const handleRelationSelect = useCallback(
        (conditionKey: string, relation: string) => {
            onUpdate('conditions', {
                ...conditions,
                [conditionKey]: {
                    ...conditions[conditionKey],
                    relation,
                },
            });
        },
        [conditions, onUpdate]
    );

    return (
        <View style={styles.container} testID="step-family-history">
            {/* Title */}
            <Text variant="heading" fontSize="heading-lg" journey="health">
                {t('healthAssessment.familyHistory.title')}
            </Text>
            <Text fontSize="sm" color={colors.neutral.gray600} style={styles.subtitle}>
                {t('healthAssessment.familyHistory.subtitle')}
            </Text>

            {/* Condition Cards */}
            {FAMILY_CONDITION_KEYS.map((key) => {
                const condition = conditions[key];
                const isActive = condition?.active || false;

                return (
                    <Card key={key} journey="health" elevation="sm" padding="md">
                        <Touchable
                            onPress={() => handleToggleCondition(key)}
                            accessibilityLabel={t(`healthAssessment.familyHistory.${key}`)}
                            accessibilityRole="checkbox"
                            testID={`family-condition-${key}`}
                            style={styles.conditionToggle as unknown as React.CSSProperties}
                        >
                            <View style={styles.conditionRow}>
                                <View style={[styles.checkbox, isActive ? styles.checkboxActive : null]}>
                                    {isActive && (
                                        <Text fontSize="xs" color={colors.neutral.white} textAlign="center">
                                            {'\u2713'}
                                        </Text>
                                    )}
                                </View>
                                <Text
                                    fontSize="md"
                                    fontWeight={isActive ? 'semiBold' : 'regular'}
                                    color={isActive ? colors.journeys.health.text : colors.neutral.gray700}
                                >
                                    {t(`healthAssessment.familyHistory.${key}`)}
                                </Text>
                            </View>
                        </Touchable>

                        {/* Relation Selector (visible when active) */}
                        {isActive && (
                            <View style={styles.relationSection}>
                                <Text fontSize="sm" color={colors.neutral.gray600} style={styles.relationLabel}>
                                    {t('healthAssessment.familyHistory.relationLabel')}
                                </Text>
                                <View style={styles.relationRow}>
                                    {RELATION_KEYS.map((rel) => {
                                        const isSelected = condition?.relation === rel;
                                        return (
                                            <Touchable
                                                key={rel}
                                                onPress={() => handleRelationSelect(key, rel)}
                                                accessibilityLabel={t(`healthAssessment.familyHistory.relation_${rel}`)}
                                                accessibilityRole="button"
                                                testID={`relation-${key}-${rel}`}
                                                style={[styles.relationPill, isSelected && styles.relationPillActive]}
                                            >
                                                <Text
                                                    fontSize="xs"
                                                    fontWeight={isSelected ? 'semiBold' : 'regular'}
                                                    color={isSelected ? colors.neutral.white : colors.neutral.gray700}
                                                >
                                                    {t(`healthAssessment.familyHistory.relation_${rel}`)}
                                                </Text>
                                            </Touchable>
                                        );
                                    })}
                                </View>
                            </View>
                        )}
                    </Card>
                );
            })}
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            paddingTop: spacingValues.xl,
        },
        subtitle: {
            marginTop: spacingValues.xs,
            marginBottom: spacingValues.xl,
        },
        conditionToggle: {
            paddingVertical: spacingValues['3xs'],
        },
        conditionRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        checkbox: {
            width: 22,
            height: 22,
            borderRadius: borderRadiusValues.xs,
            borderWidth: 2,
            borderColor: theme.colors.border.default,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacingValues.sm,
        },
        checkboxActive: {
            backgroundColor: colors.journeys.health.primary,
            borderColor: colors.journeys.health.primary,
        },
        relationSection: {
            marginTop: spacingValues.sm,
            paddingTop: spacingValues.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.default,
        },
        relationLabel: {
            marginBottom: spacingValues.xs,
        },
        relationRow: {
            flexDirection: 'row',
            gap: spacingValues.xs,
        },
        relationPill: {
            flex: 1,
            paddingVertical: spacingValues.xs,
            borderRadius: borderRadiusValues.full,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            alignItems: 'center',
            backgroundColor: theme.colors.background.default,
        },
        relationPillActive: {
            backgroundColor: colors.journeys.health.secondary,
            borderColor: colors.journeys.health.secondary,
        },
    });

export default StepFamilyHistory;
