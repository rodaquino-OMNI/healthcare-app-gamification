/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizingValues } from '@design-system/tokens/sizing';
import { spacingValues } from '@design-system/tokens/spacing';
import { Quest } from '@shared/types/gamification.types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/** Extended quest type with category for section grouping. */
export interface CategorizedQuest extends Quest {
    category: 'daily' | 'weekly' | 'special';
}

export interface QuestListItemProps {
    /** The quest item to render */
    item: CategorizedQuest;
    /** Theme instance for dynamic styles */
    theme: Theme;
    /** Callback invoked when the quest item is pressed */
    onPress: (questId: string) => void;
}

/**
 * Returns the journey color for a given journey string.
 */
const getJourneyColor = (journey: string): string => {
    switch (journey) {
        case 'health':
            return colors.journeys.health.primary;
        case 'care':
            return colors.journeys.care.primary;
        case 'plan':
            return colors.journeys.plan.primary;
        default:
            return colors.brand.primary;
    }
};

/**
 * Renders a single quest item with icon, title, description,
 * journey indicator, and progress bar.
 */
export const QuestListItem: React.FC<QuestListItemProps> = ({ item, theme, onPress }) => {
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const journeyColor = getJourneyColor(item.journey);
    const progressPercent = item.total > 0 ? (item.progress / item.total) * 100 : 0;

    return (
        <TouchableOpacity
            testID="gamification-quest-card"
            onPress={() => onPress(item.id)}
            style={styles.questItem}
            accessibilityLabel={t('gamification.quests.questAccessibility', {
                title: item.title,
                journey: item.journey,
                percent: Math.round(progressPercent),
            })}
            accessibilityHint={t('gamification.quests.questHint')}
        >
            <View style={styles.questIconContainer}>
                <Text style={styles.questIcon}>{item.icon}</Text>
            </View>
            <View style={styles.questContent}>
                <View style={styles.questHeader}>
                    <Text style={styles.questTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    {item.completed && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                </View>
                <Text style={styles.questDescription} numberOfLines={1}>
                    {item.description}
                </Text>
                <View style={styles.questMeta}>
                    <View style={[styles.journeyDot, { backgroundColor: journeyColor }]} />
                    <Text style={[styles.journeyText, { color: journeyColor }]}>
                        {item.journey.charAt(0).toUpperCase() + item.journey.slice(1)}
                    </Text>
                </View>
                <View testID="gamification-quest-progress" style={styles.progressBarContainer}>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${Math.min(progressPercent, 100)}%`, backgroundColor: journeyColor },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {item.progress}/{item.total}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        questItem: {
            flexDirection: 'row',
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.md,
            padding: spacingValues.sm,
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 2,
            elevation: 2,
        },
        questIconContainer: {
            width: sizingValues.component.lg,
            height: sizingValues.component.lg,
            borderRadius: borderRadiusValues.md,
            backgroundColor: theme.colors.background.subtle,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacingValues.sm,
        },
        questIcon: {
            fontSize: 24,
        },
        questContent: {
            flex: 1,
        },
        questHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        questTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text.default,
            flex: 1,
        },
        checkmark: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.semantic.success,
            marginLeft: spacingValues.xs,
        },
        questDescription: {
            fontSize: 13,
            color: theme.colors.text.muted,
            marginTop: spacingValues['4xs'],
        },
        questMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacingValues.xs,
        },
        journeyDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginRight: spacingValues['3xs'],
        },
        journeyText: {
            fontSize: 12,
            fontWeight: '500',
        },
        progressBarContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacingValues.xs,
        },
        progressBarBg: {
            flex: 1,
            height: 6,
            backgroundColor: theme.colors.background.subtle,
            borderRadius: borderRadiusValues.full,
            overflow: 'hidden',
            marginRight: spacingValues.xs,
        },
        progressBarFill: {
            height: 6,
            borderRadius: borderRadiusValues.full,
        },
        progressText: {
            fontSize: 11,
            fontWeight: '500',
            color: theme.colors.text.muted,
            minWidth: 36,
            textAlign: 'right',
        },
    });
