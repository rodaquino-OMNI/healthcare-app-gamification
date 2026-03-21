/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from 'styled-components/native';

import type { WellnessNavigationProp } from '../../navigation/types';

/**
 * Plan item category type.
 */
type PlanCategory = 'exercise' | 'nutrition' | 'mindfulness' | 'sleep';

/**
 * Represents a single item in the daily wellness plan.
 */
interface PlanItem {
    id: string;
    titleKey: string;
    descriptionKey: string;
    category: PlanCategory;
    completed: boolean;
    icon: string;
    timeKey: string;
}

/**
 * Category config for visual display.
 */
interface CategoryConfig {
    key: PlanCategory;
    labelKey: string;
    icon: string;
}

const CATEGORIES: CategoryConfig[] = [
    { key: 'exercise', labelKey: 'journeys.health.wellness.dailyPlan.categoryExercise', icon: '\u{1F3CB}' },
    { key: 'nutrition', labelKey: 'journeys.health.wellness.dailyPlan.categoryNutrition', icon: '\u{1F957}' },
    { key: 'mindfulness', labelKey: 'journeys.health.wellness.dailyPlan.categoryMindfulness', icon: '\u{1F9D8}' },
    { key: 'sleep', labelKey: 'journeys.health.wellness.dailyPlan.categorySleep', icon: '\u{1F634}' },
];

/**
 * Mock daily plan items for development.
 */
const MOCK_PLAN_ITEMS: PlanItem[] = [
    {
        id: 'plan-001',
        titleKey: 'journeys.health.wellness.dailyPlan.morningStretch',
        descriptionKey: 'journeys.health.wellness.dailyPlan.morningStretchDesc',
        category: 'exercise',
        completed: true,
        icon: '\u{1F3CB}',
        timeKey: 'journeys.health.wellness.dailyPlan.time7am',
    },
    {
        id: 'plan-002',
        titleKey: 'journeys.health.wellness.dailyPlan.healthyBreakfast',
        descriptionKey: 'journeys.health.wellness.dailyPlan.healthyBreakfastDesc',
        category: 'nutrition',
        completed: true,
        icon: '\u{1F957}',
        timeKey: 'journeys.health.wellness.dailyPlan.time8am',
    },
    {
        id: 'plan-003',
        titleKey: 'journeys.health.wellness.dailyPlan.morningMeditation',
        descriptionKey: 'journeys.health.wellness.dailyPlan.morningMeditationDesc',
        category: 'mindfulness',
        completed: false,
        icon: '\u{1F9D8}',
        timeKey: 'journeys.health.wellness.dailyPlan.time9am',
    },
    {
        id: 'plan-004',
        titleKey: 'journeys.health.wellness.dailyPlan.hydrationCheck',
        descriptionKey: 'journeys.health.wellness.dailyPlan.hydrationCheckDesc',
        category: 'nutrition',
        completed: false,
        icon: '\u{1F4A7}',
        timeKey: 'journeys.health.wellness.dailyPlan.time10am',
    },
    {
        id: 'plan-005',
        titleKey: 'journeys.health.wellness.dailyPlan.lunchWalk',
        descriptionKey: 'journeys.health.wellness.dailyPlan.lunchWalkDesc',
        category: 'exercise',
        completed: false,
        icon: '\u{1F6B6}',
        timeKey: 'journeys.health.wellness.dailyPlan.time12pm',
    },
    {
        id: 'plan-006',
        titleKey: 'journeys.health.wellness.dailyPlan.breathingBreak',
        descriptionKey: 'journeys.health.wellness.dailyPlan.breathingBreakDesc',
        category: 'mindfulness',
        completed: false,
        icon: '\u{1F32C}',
        timeKey: 'journeys.health.wellness.dailyPlan.time3pm',
    },
    {
        id: 'plan-007',
        titleKey: 'journeys.health.wellness.dailyPlan.balancedDinner',
        descriptionKey: 'journeys.health.wellness.dailyPlan.balancedDinnerDesc',
        category: 'nutrition',
        completed: false,
        icon: '\u{1F372}',
        timeKey: 'journeys.health.wellness.dailyPlan.time7pm',
    },
    {
        id: 'plan-008',
        titleKey: 'journeys.health.wellness.dailyPlan.eveningWindDown',
        descriptionKey: 'journeys.health.wellness.dailyPlan.eveningWindDownDesc',
        category: 'sleep',
        completed: false,
        icon: '\u{1F634}',
        timeKey: 'journeys.health.wellness.dailyPlan.time9pm',
    },
    {
        id: 'plan-009',
        titleKey: 'journeys.health.wellness.dailyPlan.gratitudeJournal',
        descriptionKey: 'journeys.health.wellness.dailyPlan.gratitudeJournalDesc',
        category: 'mindfulness',
        completed: false,
        icon: '\u{1F4D3}',
        timeKey: 'journeys.health.wellness.dailyPlan.time930pm',
    },
    {
        id: 'plan-010',
        titleKey: 'journeys.health.wellness.dailyPlan.sleepRoutine',
        descriptionKey: 'journeys.health.wellness.dailyPlan.sleepRoutineDesc',
        category: 'sleep',
        completed: false,
        icon: '\u{1F319}',
        timeKey: 'journeys.health.wellness.dailyPlan.time10pm',
    },
];

/**
 * CompanionDailyPlanScreen displays a personalized daily wellness checklist
 * with progress tracking and category indicators.
 */
export const CompanionDailyPlanScreen: React.FC = () => {
    const navigation = useNavigation<WellnessNavigationProp>();
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const [planItems, setPlanItems] = useState<PlanItem[]>(MOCK_PLAN_ITEMS);

    const completedCount = planItems.filter((item) => item.completed).length;
    const totalCount = planItems.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const toggleItem = useCallback((itemId: string) => {
        setPlanItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item))
        );
    }, []);

    const getCategoryColor = (category: PlanCategory): string => {
        switch (category) {
            case 'exercise':
                return colors.journeys.care.primary;
            case 'nutrition':
                return colors.journeys.health.primary;
            case 'mindfulness':
                return colors.brand.secondary;
            case 'sleep':
                return colors.brand.tertiary;
        }
    };

    const renderProgressHeader = (): React.ReactElement | null => (
        <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>{t('journeys.health.wellness.dailyPlan.progressTitle')}</Text>
            <View style={styles.progressRow}>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
                </View>
                <Text style={styles.progressText}>
                    {t('journeys.health.wellness.dailyPlan.progressCount', {
                        completed: completedCount,
                        total: totalCount,
                    })}
                </Text>
            </View>
            <Text style={styles.progressPercentage}>
                {t('journeys.health.wellness.dailyPlan.progressPercent', {
                    percent: progressPercentage,
                })}
            </Text>

            {/* Category summary */}
            <View style={styles.categorySummary}>
                {CATEGORIES.map((cat) => {
                    const catItems = planItems.filter((i) => i.category === cat.key);
                    const catCompleted = catItems.filter((i) => i.completed).length;
                    return (
                        <View key={cat.key} style={styles.categoryBadge}>
                            <Text style={styles.categoryIcon}>{cat.icon}</Text>
                            <Text style={styles.categoryCount}>
                                {catCompleted}/{catItems.length}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );

    const renderPlanItem = ({ item }: { item: PlanItem }): React.ReactElement | null => (
        <TouchableOpacity
            style={[styles.planItem, item.completed && styles.planItemCompleted]}
            onPress={() => toggleItem(item.id)}
            accessibilityLabel={t(item.titleKey)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.completed }}
            testID={`plan-item-${item.id}`}
        >
            {/* Checkbox */}
            <View
                style={[
                    styles.checkbox,
                    item.completed && [styles.checkboxChecked, { backgroundColor: getCategoryColor(item.category) }],
                ]}
            >
                {item.completed && <Text style={styles.checkmark}>{'\u2713'}</Text>}
            </View>

            {/* Content */}
            <View style={styles.planItemContent}>
                <View style={styles.planItemHeader}>
                    <Text style={styles.planItemIcon}>{item.icon}</Text>
                    <Text style={[styles.planItemTitle, item.completed && styles.planItemTitleCompleted]}>
                        {t(item.titleKey)}
                    </Text>
                </View>
                <Text style={[styles.planItemDescription, item.completed && styles.planItemDescCompleted]}>
                    {t(item.descriptionKey)}
                </Text>
                <View style={styles.planItemMeta}>
                    <Text style={styles.planItemTime}>{t(item.timeKey)}</Text>
                    <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(item.category) }]} />
                    <Text style={styles.planItemCategory}>
                        {t(CATEGORIES.find((c) => c.key === item.category)?.labelKey ?? '')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} testID="wellness-daily-plan-screen">
            <View style={styles.headerBar}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    accessibilityLabel={t('common.buttons.back')}
                >
                    <Text style={styles.backArrow}>{'\u2190'}</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>{t('journeys.health.wellness.dailyPlan.screenTitle')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                data={planItems}
                keyExtractor={(item) => item.id}
                renderItem={renderPlanItem}
                ListHeaderComponent={renderProgressHeader}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                testID="daily-plan-list"
            />
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.subtle,
        },
        headerBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            backgroundColor: colors.brand.primary,
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backArrow: {
            fontSize: 20,
            color: theme.colors.text.onBrand,
            fontWeight: '600',
        },
        screenTitle: {
            flex: 1,
            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.text.onBrand,
            textAlign: 'center',
        },
        headerSpacer: {
            width: 40,
        },
        listContent: {
            paddingHorizontal: spacingValues.md,
            paddingBottom: spacingValues['5xl'],
        },
        progressCard: {
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.lg,
            padding: spacingValues.md,
            marginTop: spacingValues.md,
            marginBottom: spacingValues.md,
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
        },
        progressTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.colors.text.default,
            marginBottom: spacingValues.sm,
        },
        progressRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacingValues.sm,
        },
        progressBarContainer: {
            flex: 1,
            height: 8,
            backgroundColor: theme.colors.border.default,
            borderRadius: 4,
        },
        progressBar: {
            height: 8,
            backgroundColor: colors.semantic.success,
            borderRadius: 4,
        },
        progressText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text.default,
        },
        progressPercentage: {
            fontSize: 13,
            color: theme.colors.text.muted,
            marginTop: spacingValues['3xs'],
        },
        categorySummary: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: spacingValues.md,
        },
        categoryBadge: {
            alignItems: 'center',
            gap: spacingValues['4xs'],
        },
        categoryIcon: {
            fontSize: 20,
        },
        categoryCount: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.colors.text.muted,
        },
        planItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: spacingValues.md,
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.md,
        },
        planItemCompleted: {
            opacity: 0.7,
        },
        checkbox: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: theme.colors.border.default,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacingValues.sm,
            marginTop: spacingValues['4xs'],
        },
        checkboxChecked: {
            borderColor: 'transparent',
        },
        checkmark: {
            fontSize: 14,
            color: theme.colors.text.onBrand,
            fontWeight: '700',
        },
        planItemContent: {
            flex: 1,
        },
        planItemHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacingValues.xs,
        },
        planItemIcon: {
            fontSize: 18,
        },
        planItemTitle: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.colors.text.default,
            flex: 1,
        },
        planItemTitleCompleted: {
            textDecorationLine: 'line-through',
            color: theme.colors.text.muted,
        },
        planItemDescription: {
            fontSize: 13,
            color: theme.colors.text.muted,
            marginTop: spacingValues['3xs'],
        },
        planItemDescCompleted: {
            textDecorationLine: 'line-through',
        },
        planItemMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacingValues.xs,
            gap: spacingValues.xs,
        },
        planItemTime: {
            fontSize: 12,
            color: theme.colors.text.muted,
            fontWeight: '500',
        },
        categoryDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
        },
        planItemCategory: {
            fontSize: 12,
            color: theme.colors.text.muted,
        },
        separator: {
            height: spacingValues.xs,
        },
    });

export default CompanionDailyPlanScreen;
