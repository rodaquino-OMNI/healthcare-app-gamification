/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { fontSizeValues } from '@design-system/tokens/typography';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';

import type { HomeTabScreenNavigationProp } from '../../navigation/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GoalProgress {
    id: string;
    title: string;
    percentage: number;
    completed: boolean;
}

export interface JourneyCard {
    id: string;
    title: string;
    description: string;
    primaryColor: string;
    backgroundColor: string;
    route: string;
}

export interface WeeklyBar {
    day: string;
    health: number;
    care: number;
    plan: number;
}

export interface LegendLabels {
    health: string;
    care: string;
    plan: string;
}

export const CHART_MAX_HEIGHT = 80;

// ---------------------------------------------------------------------------
// ChartPreview
// ---------------------------------------------------------------------------

interface ChartPreviewProps {
    navigation: HomeTabScreenNavigationProp;
    bars: WeeklyBar[];
    legendLabels: LegendLabels;
    viewDetailsLabel: string;
    viewDetailsAccessibilityLabel: string;
    healthDashboardRoute: string;
}

/**
 * Weekly activity chart preview with stacked bars and legend.
 */
export const ChartPreview: React.FC<ChartPreviewProps> = ({
    navigation,
    bars,
    legendLabels,
    viewDetailsLabel,
    viewDetailsAccessibilityLabel,
    healthDashboardRoute: _healthDashboardRoute,
}) => {
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    return (
        <View style={styles.chartCard}>
            <View style={styles.chartArea}>
                {bars.map((bar) => (
                    <View key={bar.day} style={styles.chartColumn}>
                        <View style={styles.chartBarContainer}>
                            <View
                                style={[
                                    styles.chartBar,
                                    {
                                        height: bar.health * CHART_MAX_HEIGHT,
                                        backgroundColor: colors.journeys.health.primary,
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    styles.chartBar,
                                    {
                                        height: bar.care * CHART_MAX_HEIGHT * 0.5,
                                        backgroundColor: colors.journeys.care.primary,
                                        marginTop: spacingValues['3xs'],
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    styles.chartBar,
                                    {
                                        height: bar.plan * CHART_MAX_HEIGHT * 0.3,
                                        backgroundColor: colors.journeys.plan.primary,
                                        marginTop: spacingValues['3xs'],
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.chartDayLabel}>{bar.day}</Text>
                    </View>
                ))}
            </View>

            {/* Chart legend */}
            <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.journeys.health.primary }]} />
                    <Text style={styles.legendText}>{legendLabels.health}</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.journeys.care.primary }]} />
                    <Text style={styles.legendText}>{legendLabels.care}</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.journeys.plan.primary }]} />
                    <Text style={styles.legendText}>{legendLabels.plan}</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate('Health', { screen: 'HealthDashboard' })}
                accessibilityRole="link"
                accessibilityLabel={viewDetailsAccessibilityLabel}
            >
                <Text style={styles.viewDetailsLink}>{viewDetailsLabel}</Text>
            </TouchableOpacity>
        </View>
    );
};

// ---------------------------------------------------------------------------
// GoalsSection
// ---------------------------------------------------------------------------

interface GoalsSectionProps {
    goals: GoalProgress[];
    completedLabel: string;
}

/**
 * Goal progress cards section.
 */
export const GoalsSection: React.FC<GoalsSectionProps> = ({ goals, completedLabel }) => {
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    return (
        <>
            {goals.map((goal) => (
                <View key={goal.id} style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                        <Text style={styles.goalTitle}>{goal.title}</Text>
                        <Text style={[styles.goalPercentage, goal.completed && styles.goalPercentageCompleted]}>
                            {goal.percentage}%
                        </Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${goal.percentage}%`,
                                    backgroundColor: goal.completed
                                        ? colors.semantic.success
                                        : colors.journeys.health.primary,
                                },
                            ]}
                        />
                    </View>
                    {goal.completed && <Text style={styles.goalCompletedText}>{completedLabel}</Text>}
                </View>
            ))}
        </>
    );
};

// ---------------------------------------------------------------------------
// JourneysSection
// ---------------------------------------------------------------------------

interface JourneysSectionProps {
    navigation: HomeTabScreenNavigationProp;
    journeys: JourneyCard[];
}

/**
 * Journey navigation cards section.
 */
export const JourneysSection: React.FC<JourneysSectionProps> = ({ navigation, journeys }) => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    const handleJourneyPress = useCallback(
        (route: string) => {
            switch (route) {
                case 'HealthDashboard':
                    navigation.navigate('Health', { screen: 'HealthDashboard' });
                    break;
                case 'CareDashboard':
                    navigation.navigate('Care', { screen: 'CareDashboard' });
                    break;
                case 'PlanDashboard':
                    navigation.navigate('Plan', { screen: 'PlanDashboard' });
                    break;
                default:
                    break;
            }
        },
        [navigation]
    );

    return (
        <>
            {journeys.map((journey) => (
                <TouchableOpacity
                    key={journey.id}
                    style={styles.journeyCard}
                    onPress={() => handleJourneyPress(journey.route)}
                    accessibilityRole="button"
                    accessibilityLabel={t('home.navigateTo', { title: journey.title })}
                >
                    <View style={[styles.journeyColorBar, { backgroundColor: journey.primaryColor }]} />
                    <View style={styles.journeyContent}>
                        <Text style={styles.journeyTitle}>{journey.title}</Text>
                        <Text style={styles.journeyDescription}>{journey.description}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </>
    );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        // Chart preview
        chartCard: {
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.md,
            padding: spacingValues.md,
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
        chartArea: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: CHART_MAX_HEIGHT + spacingValues.xl,
            marginBottom: spacingValues.sm,
        },
        chartColumn: {
            flex: 1,
            alignItems: 'center',
        },
        chartBarContainer: {
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
        },
        chartBar: {
            width: spacingValues.sm,
            borderRadius: borderRadiusValues.xs,
        },
        chartDayLabel: {
            fontSize: 10,
            color: theme.colors.text.muted,
            marginTop: spacingValues['3xs'],
        },
        chartLegend: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacingValues.md,
            marginBottom: spacingValues.sm,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        legendDot: {
            width: spacingValues.xs,
            height: spacingValues.xs,
            borderRadius: borderRadiusValues.full,
            marginRight: spacingValues['3xs'],
        },
        legendText: {
            fontSize: fontSizeValues.xs,
            color: theme.colors.text.muted,
        },
        viewDetailsLink: {
            fontSize: fontSizeValues.sm,
            fontWeight: '600',
            color: colors.journeys.health.primary,
            textAlign: 'center',
        },

        // Goals
        goalCard: {
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.md,
            padding: spacingValues.md,
            marginBottom: spacingValues.sm,
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        goalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacingValues.xs,
        },
        goalTitle: {
            fontSize: fontSizeValues.sm,
            fontWeight: '600',
            color: theme.colors.text.default,
        },
        goalPercentage: {
            fontSize: fontSizeValues.sm,
            fontWeight: '700',
            color: colors.journeys.health.primary,
        },
        goalPercentageCompleted: {
            color: colors.semantic.success,
        },
        progressBarTrack: {
            height: spacingValues.xs,
            backgroundColor: theme.colors.background.subtle,
            borderRadius: borderRadiusValues.full,
            overflow: 'hidden',
        },
        progressBarFill: {
            height: '100%',
            borderRadius: borderRadiusValues.full,
        },
        goalCompletedText: {
            fontSize: fontSizeValues.xs,
            color: colors.semantic.success,
            fontWeight: '500',
            marginTop: spacingValues['3xs'],
        },

        // Journey cards
        journeyCard: {
            flexDirection: 'row',
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.md,
            marginBottom: spacingValues.sm,
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            overflow: 'hidden',
        },
        journeyColorBar: {
            width: spacingValues['2xs'],
        },
        journeyContent: {
            flex: 1,
            padding: spacingValues.md,
        },
        journeyTitle: {
            fontSize: fontSizeValues.md,
            fontWeight: '600',
            color: theme.colors.text.default,
            marginBottom: spacingValues['3xs'],
        },
        journeyDescription: {
            fontSize: fontSizeValues.sm,
            color: theme.colors.text.muted,
            lineHeight: fontSizeValues.sm * 1.5,
        },
    });
