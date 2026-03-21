import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from 'styled-components/native';

/**
 * Muscle group tag.
 */
interface MuscleGroup {
    id: string;
    labelKey: string;
}

/**
 * Mock exercise detail data.
 */
const MOCK_EXERCISE = {
    nameKey: 'journeys.health.activity.exerciseDetail.mockName',
    categoryKey: 'journeys.health.activity.exerciseDetail.mockCategory',
    descriptionKey: 'journeys.health.activity.exerciseDetail.mockDescription',
    difficulty: 'medium' as const,
    durationMinutes: 30,
    caloriesPerSession: 250,
};

const MOCK_MUSCLE_GROUPS: MuscleGroup[] = [
    { id: 'mg-1', labelKey: 'journeys.health.activity.exerciseDetail.muscles.quadriceps' },
    { id: 'mg-2', labelKey: 'journeys.health.activity.exerciseDetail.muscles.hamstrings' },
    { id: 'mg-3', labelKey: 'journeys.health.activity.exerciseDetail.muscles.glutes' },
    { id: 'mg-4', labelKey: 'journeys.health.activity.exerciseDetail.muscles.calves' },
    { id: 'mg-5', labelKey: 'journeys.health.activity.exerciseDetail.muscles.core' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
    easy: colors.semantic.success,
    medium: colors.semantic.warning,
    hard: colors.semantic.error,
};

/**
 * ExerciseDetail displays a comprehensive view of a single exercise,
 * including description, muscle groups, video placeholder, and action buttons.
 */
export const ExerciseDetail: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const _theme = useTheme();

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleStartExercise = useCallback(() => {
        Alert.alert(
            t('journeys.health.activity.exerciseDetail.startTitle'),
            t('journeys.health.activity.exerciseDetail.startMessage')
        );
    }, [t]);

    const difficultyColor = useMemo(() => DIFFICULTY_COLORS[MOCK_EXERCISE.difficulty] || colors.gray[40], []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleGoBack}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.activity.exerciseDetail.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Exercise Name + Category Badge */}
                <View style={styles.titleSection}>
                    <Text fontSize="xl" fontWeight="bold" journey="health">
                        {t(MOCK_EXERCISE.nameKey)}
                    </Text>
                    <View style={styles.badgeRow}>
                        <View style={[styles.categoryBadge, { borderColor: colors.journeys.health.primary }]}>
                            <Text fontSize="xs" fontWeight="semiBold" color={colors.journeys.health.primary}>
                                {t(MOCK_EXERCISE.categoryKey)}
                            </Text>
                        </View>
                        <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
                            <Text fontSize="xs" fontWeight="semiBold" color={colors.gray[0]}>
                                {t(
                                    `journeys.health.activity.exerciseDetail.difficulty${MOCK_EXERCISE.difficulty.charAt(0).toUpperCase()}${MOCK_EXERCISE.difficulty.slice(1)}`
                                )}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Quick Stats */}
                <View style={styles.quickStatsRow}>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.quickStatItem}>
                            <Ionicons name="time-outline" size={20} color={colors.journeys.health.primary} />
                            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                                {MOCK_EXERCISE.durationMinutes}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.activity.exerciseDetail.minutes')}
                            </Text>
                        </View>
                    </Card>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.quickStatItem}>
                            <Ionicons name="flame-outline" size={20} color={colors.semantic.warning} />
                            <Text fontSize="lg" fontWeight="bold" color={colors.semantic.warning}>
                                {MOCK_EXERCISE.caloriesPerSession}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.activity.exerciseDetail.calories')}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Description */}
                <View style={styles.sectionContainer} testID="activity-exercise-detail-description">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.exerciseDetail.descriptionTitle')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <Text fontSize="sm" color={colors.gray[60]} style={styles.descriptionText}>
                            {t(MOCK_EXERCISE.descriptionKey)}
                        </Text>
                    </Card>
                </View>

                {/* Muscle Groups */}
                <View style={styles.sectionContainer} testID="activity-exercise-detail-muscles">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.exerciseDetail.muscleGroups')}
                    </Text>
                    <View style={styles.muscleTagsContainer}>
                        {MOCK_MUSCLE_GROUPS.map((muscle) => (
                            <View key={muscle.id} style={styles.muscleTag}>
                                <Text fontSize="sm" fontWeight="medium" color={colors.journeys.health.primary}>
                                    {t(muscle.labelKey)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Video Placeholder */}
                <View style={styles.sectionContainer} testID="activity-exercise-detail-video">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.exerciseDetail.videoTitle')}
                    </Text>
                    <View style={styles.videoPlaceholder}>
                        <View style={styles.playIconContainer}>
                            <Ionicons name="play-outline" size={48} color={colors.gray[0]} />
                        </View>
                        <Text fontSize="sm" color={colors.gray[40]}>
                            {t('journeys.health.activity.exerciseDetail.videoPlaceholder')}
                        </Text>
                    </View>
                </View>

                {/* Action Button */}
                <View style={styles.actionsContainer} testID="activity-exercise-detail-start-button">
                    <Button
                        journey="health"
                        onPress={handleStartExercise}
                        accessibilityLabel={t('journeys.health.activity.exerciseDetail.startExercise')}
                        testID="activity-exercise-detail-start-cta"
                    >
                        {t('journeys.health.activity.exerciseDetail.startExercise')}
                    </Button>
                </View>
            </ScrollView>
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
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    titleSection: {
        marginTop: spacingValues.md,
        gap: spacingValues.sm,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: spacingValues.sm,
    },
    categoryBadge: {
        paddingHorizontal: spacingValues.sm,
        paddingVertical: spacingValues['4xs'],
        borderRadius: 12,
        borderWidth: 1,
    },
    difficultyBadge: {
        paddingHorizontal: spacingValues.sm,
        paddingVertical: spacingValues['4xs'],
        borderRadius: 12,
    },
    quickStatsRow: {
        flexDirection: 'row',
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    quickStatItem: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
        minWidth: 80,
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    descriptionText: {
        lineHeight: 22,
    },
    muscleTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacingValues.sm,
    },
    muscleTag: {
        paddingHorizontal: spacingValues.md,
        paddingVertical: spacingValues.xs,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.journeys.health.primary,
        backgroundColor: colors.journeys.health.background,
    },
    videoPlaceholder: {
        height: 200,
        borderRadius: 12,
        backgroundColor: colors.gray[10],
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacingValues.sm,
    },
    playIconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.gray[30],
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
        marginBottom: spacingValues.xl,
    },
});

export default ExerciseDetail;
