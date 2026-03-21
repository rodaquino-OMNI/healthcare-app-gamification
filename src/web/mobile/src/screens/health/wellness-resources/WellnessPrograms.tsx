import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { ProgressBar } from '@austa/design-system/src/components/ProgressBar/ProgressBar';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, ScrollView, StyleSheet, ListRenderItemInfo } from 'react-native';
import { useTheme } from 'styled-components/native';

/**
 * Difficulty level for wellness programs.
 */
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Filter tab key.
 */
type FilterKey = 'all' | 'beginner' | 'intermediate' | 'advanced';

/**
 * A wellness program item.
 */
interface Program {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: Difficulty;
    enrolled: number;
    progress: number;
    total: number;
    isEnrolled: boolean;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

const FILTERS: { key: FilterKey; labelKey: string }[] = [
    { key: 'all', labelKey: 'journeys.health.wellnessResources.programs.filterAll' },
    { key: 'beginner', labelKey: 'journeys.health.wellnessResources.programs.filterBeginner' },
    { key: 'intermediate', labelKey: 'journeys.health.wellnessResources.programs.filterIntermediate' },
    { key: 'advanced', labelKey: 'journeys.health.wellnessResources.programs.filterAdvanced' },
];

const MOCK_PROGRAMS: Program[] = [
    {
        id: 'prog-1',
        title: 'Stress Management Essentials',
        description: 'Learn evidence-based techniques to reduce daily stress and build resilience.',
        duration: '4 weeks',
        difficulty: 'beginner',
        enrolled: 1200,
        progress: 3,
        total: 8,
        isEnrolled: true,
    },
    {
        id: 'prog-2',
        title: 'Mindful Movement Program',
        description: 'Combine yoga, stretching, and breathing for holistic body wellness.',
        duration: '6 weeks',
        difficulty: 'intermediate',
        enrolled: 850,
        progress: 0,
        total: 12,
        isEnrolled: false,
    },
    {
        id: 'prog-3',
        title: 'Better Sleep Habits',
        description: 'Develop a consistent sleep routine and improve sleep quality naturally.',
        duration: '3 weeks',
        difficulty: 'beginner',
        enrolled: 2300,
        progress: 6,
        total: 6,
        isEnrolled: true,
    },
    {
        id: 'prog-4',
        title: 'Advanced Meditation Practice',
        description: 'Deepen your meditation practice with vipassana, loving-kindness, and body scan.',
        duration: '8 weeks',
        difficulty: 'advanced',
        enrolled: 420,
        progress: 0,
        total: 16,
        isEnrolled: false,
    },
    {
        id: 'prog-5',
        title: 'Nutrition and Mindfulness',
        description: 'Explore the connection between mindful eating and overall wellness.',
        duration: '4 weeks',
        difficulty: 'intermediate',
        enrolled: 680,
        progress: 2,
        total: 8,
        isEnrolled: true,
    },
];

/**
 * Formats enrolled count to a compact label (e.g. "1.2k enrolled").
 */
const formatEnrolled = (count: number): string => {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
    }
    return `${count}`;
};

/**
 * WellnessPrograms displays a filterable list of wellness programs
 * with progress indicators, difficulty badges, and enrollment CTAs.
 */
export const WellnessPrograms: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

    const filteredPrograms = useMemo(() => {
        if (activeFilter === 'all') {
            return MOCK_PROGRAMS;
        }
        return MOCK_PROGRAMS.filter((p) => p.difficulty === activeFilter);
    }, [activeFilter]);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleFilterPress = useCallback((filter: FilterKey) => {
        setActiveFilter(filter);
    }, []);

    const handleProgramPress = useCallback(
        (programId: string) => {
            navigation.navigate('HealthWellnessResourcesProgramDetail', { programId });
        },
        [navigation]
    );

    const renderProgramCard = useCallback(
        ({ item }: ListRenderItemInfo<Program>) => {
            const progressPercent = item.total > 0 ? Math.round((item.progress / item.total) * 100) : 0;

            return (
                <Touchable
                    onPress={() => handleProgramPress(item.id)}
                    accessibilityLabel={item.title}
                    accessibilityRole="button"
                    testID={`wellness-resources-programs-card-${item.id}`}
                >
                    <Card journey="health" elevation="sm" padding="md">
                        {/* Title and Description */}
                        <Text fontSize="md" fontWeight="bold" journey="health">
                            {item.title}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]} numberOfLines={2} style={styles.descriptionText}>
                            {item.description}
                        </Text>

                        {/* Progress */}
                        {item.isEnrolled && (
                            <View style={styles.progressSection}>
                                <ProgressBar
                                    current={item.progress}
                                    total={item.total}
                                    journey="health"
                                    ariaLabel={`${t('journeys.health.wellnessResources.programs.progress')}: ${progressPercent}%`}
                                    testId={`progress-bar-${item.id}`}
                                    size="sm"
                                />
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {item.progress} / {item.total}{' '}
                                    {t('journeys.health.wellnessResources.programs.stepsComplete')}
                                </Text>
                            </View>
                        )}

                        {/* Badges Row */}
                        <View style={styles.badgesRow}>
                            <View style={styles.badge}>
                                <Ionicons name="time-outline" size={14} color={colors.journeys.health.primary} />
                                <Text fontSize="xs" color={colors.gray[60]}>
                                    {item.duration}
                                </Text>
                            </View>
                            <View style={styles.badge}>
                                <Ionicons name="fitness-outline" size={14} color={colors.journeys.health.primary} />
                                <Text fontSize="xs" color={colors.gray[60]}>
                                    {DIFFICULTY_LABELS[item.difficulty]}
                                </Text>
                            </View>
                            <View style={styles.badge}>
                                <Ionicons name="people-outline" size={14} color={colors.gray[40]} />
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {formatEnrolled(item.enrolled)}{' '}
                                    {t('journeys.health.wellnessResources.programs.enrolled')}
                                </Text>
                            </View>
                        </View>

                        {/* CTA Button */}
                        <View style={styles.ctaContainer}>
                            <Button
                                journey="health"
                                onPress={() => handleProgramPress(item.id)}
                                accessibilityLabel={
                                    item.isEnrolled
                                        ? t('journeys.health.wellnessResources.programs.continue')
                                        : t('journeys.health.wellnessResources.programs.enroll')
                                }
                                testID={`wellness-resources-programs-cta-${item.id}`}
                            >
                                {item.isEnrolled
                                    ? t('journeys.health.wellnessResources.programs.continue')
                                    : t('journeys.health.wellnessResources.programs.enroll')}
                            </Button>
                        </View>
                    </Card>
                </Touchable>
            );
        },
        [handleProgramPress, t]
    );

    const keyExtractor = useCallback((item: Program) => item.id, []);

    const renderEmpty = useCallback(
        () => (
            <View style={styles.emptyContainer}>
                <Ionicons name="library-outline" size={48} color={colors.gray[30]} />
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('journeys.health.wellnessResources.programs.noPrograms')}
                </Text>
            </View>
        ),
        [t]
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleGoBack}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="wellness-resources-programs-back"
                >
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.wellnessResources.programs.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Filter Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
                style={styles.filterScroll}
            >
                {FILTERS.map((filter) => {
                    const isActive = activeFilter === filter.key;
                    return (
                        <Touchable
                            key={filter.key}
                            onPress={() => handleFilterPress(filter.key)}
                            accessibilityLabel={t(filter.labelKey)}
                            accessibilityRole="button"
                            testID={`wellness-resources-programs-filter-${filter.key}`}
                            style={[styles.filterChip, isActive && styles.filterChipActive] as any}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={isActive ? 'semiBold' : 'regular'}
                                color={isActive ? colors.neutral.white : colors.gray[50]}
                            >
                                {t(filter.labelKey)}
                            </Text>
                        </Touchable>
                    );
                })}
            </ScrollView>

            {/* Program List */}
            <FlatList
                data={filteredPrograms}
                renderItem={renderProgramCard}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                testID="wellness-resources-programs-list"
                ListEmptyComponent={renderEmpty}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues['3xl'],
        paddingBottom: spacingValues.sm,
    },
    headerSpacer: {
        width: 40,
    },
    filterScroll: {
        maxHeight: 48,
    },
    filterScrollContent: {
        paddingHorizontal: spacingValues.md,
        gap: spacingValues.xs,
        alignItems: 'center',
    },
    filterChip: {
        paddingVertical: spacingValues.xs,
        paddingHorizontal: spacingValues.md,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.gray[20],
        backgroundColor: colors.gray[0],
    },
    filterChipActive: {
        backgroundColor: colors.journeys.health.primary,
        borderColor: colors.journeys.health.primary,
    },
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues.sm,
        paddingBottom: spacingValues['3xl'],
        gap: spacingValues.sm,
    },
    descriptionText: {
        marginTop: spacingValues['4xs'],
    },
    progressSection: {
        marginTop: spacingValues.sm,
        gap: spacingValues['4xs'],
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacingValues.sm,
        gap: spacingValues.sm,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    ctaContainer: {
        marginTop: spacingValues.md,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacingValues['3xl'],
        gap: spacingValues.md,
    },
});

export default WellnessPrograms;
