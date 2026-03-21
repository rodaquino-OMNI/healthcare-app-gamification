import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { ProgressBar } from '@austa/design-system/src/components/ProgressBar/ProgressBar';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WellnessResourcesNavigationProp, WellnessResourcesParamList } from '../../../navigation/types';

/**
 * A step within a wellness program.
 */
interface ProgramStep {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

/**
 * Full program data for the detail view.
 */
interface ProgramData {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: string;
    participants: number;
    steps: ProgramStep[];
}

const MOCK_PROGRAM: ProgramData = {
    id: 'prog-1',
    title: 'Stress Management Essentials',
    description:
        'A comprehensive program designed to help you understand stress triggers, build coping mechanisms, and develop long-term resilience through evidence-based techniques.',
    duration: '4 weeks',
    difficulty: 'Beginner',
    participants: 1200,
    steps: [
        {
            id: 'step-1',
            title: 'Understanding Stress',
            description: 'Learn about the science behind stress and how it affects your body and mind.',
            completed: true,
        },
        {
            id: 'step-2',
            title: 'Breathing Techniques',
            description: 'Practice diaphragmatic breathing, box breathing, and the 4-7-8 method.',
            completed: true,
        },
        {
            id: 'step-3',
            title: 'Progressive Muscle Relaxation',
            description: 'Master the technique of systematically tensing and releasing muscle groups.',
            completed: true,
        },
        {
            id: 'step-4',
            title: 'Mindfulness Meditation',
            description: 'Develop a daily meditation practice starting with 5-minute guided sessions.',
            completed: false,
        },
        {
            id: 'step-5',
            title: 'Cognitive Reframing',
            description: 'Learn to identify and challenge negative thought patterns that increase stress.',
            completed: false,
        },
        {
            id: 'step-6',
            title: 'Building a Resilience Plan',
            description: 'Create your personal resilience toolkit and long-term stress management plan.',
            completed: false,
        },
    ],
};

/**
 * ProgramDetail shows the full view of a wellness program with
 * progress indicator, participant count, and a step-by-step checklist.
 */
export const ProgramDetail: React.FC = () => {
    const navigation = useNavigation<WellnessResourcesNavigationProp>();
    const route = useRoute<RouteProp<WellnessResourcesParamList, 'HealthWellnessResourcesProgramDetail'>>();
    const { t } = useTranslation();

    const { programId: _programId } = route.params;

    const [steps, setSteps] = useState<ProgramStep[]>(MOCK_PROGRAM.steps);

    const completedCount = useMemo(() => steps.filter((s) => s.completed).length, [steps]);

    const totalSteps = steps.length;

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleToggleStep = useCallback((stepId: string) => {
        setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s)));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleGoBack}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="wellness-resources-program-detail-back"
                >
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health" numberOfLines={1} style={styles.headerTitle}>
                    {MOCK_PROGRAM.title}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="wellness-resources-program-detail-scroll"
            >
                {/* Progress Section */}
                <Card journey="health" elevation="sm" padding="md">
                    <View style={styles.progressHeader}>
                        <Text fontSize="md" fontWeight="semiBold" journey="health">
                            {t('journeys.health.wellnessResources.programDetail.progress')}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {completedCount} / {totalSteps}{' '}
                            {t('journeys.health.wellnessResources.programDetail.stepsComplete')}
                        </Text>
                    </View>
                    <ProgressBar
                        current={completedCount}
                        total={totalSteps}
                        journey="health"
                        ariaLabel={`${t('journeys.health.wellnessResources.programDetail.progress')}: ${completedCount} of ${totalSteps}`}
                        testId="wellness-resources-program-detail-progress"
                    />
                </Card>

                {/* Participants */}
                <View style={styles.participantsRow}>
                    <Ionicons name="people-outline" size={18} color={colors.journeys.health.primary} />
                    <Text fontSize="sm" color={colors.gray[50]}>
                        {MOCK_PROGRAM.participants.toLocaleString()}{' '}
                        {t('journeys.health.wellnessResources.programDetail.participants')}
                    </Text>
                </View>

                {/* Description */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.wellnessResources.programDetail.about')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <Text fontSize="md" color={colors.gray[60]}>
                            {MOCK_PROGRAM.description}
                        </Text>
                        <View style={styles.detailBadges}>
                            <View style={styles.detailBadge}>
                                <Ionicons name="time-outline" size={14} color={colors.journeys.health.primary} />
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {MOCK_PROGRAM.duration}
                                </Text>
                            </View>
                            <View style={styles.detailBadge}>
                                <Ionicons name="fitness-outline" size={14} color={colors.journeys.health.primary} />
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {MOCK_PROGRAM.difficulty}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Steps Checklist */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.wellnessResources.programDetail.steps')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        {steps.map((step, index) => (
                            <View key={step.id}>
                                <Touchable
                                    onPress={() => handleToggleStep(step.id)}
                                    accessibilityLabel={`${step.title} - ${
                                        step.completed
                                            ? t('journeys.health.wellnessResources.programDetail.completed')
                                            : t('journeys.health.wellnessResources.programDetail.incomplete')
                                    }`}
                                    accessibilityRole="checkbox"
                                    testID={`wellness-resources-program-detail-step-${step.id}`}
                                >
                                    <View style={styles.stepRow}>
                                        {/* Step Number */}
                                        <View style={[styles.stepNumber, step.completed && styles.stepNumberCompleted]}>
                                            {step.completed ? (
                                                <Ionicons name="checkmark" size={14} color={colors.neutral.white} />
                                            ) : (
                                                <Text fontSize="sm" fontWeight="bold" color={colors.gray[50]}>
                                                    {index + 1}
                                                </Text>
                                            )}
                                        </View>

                                        {/* Step Content */}
                                        <View style={styles.stepContent}>
                                            <Text
                                                fontSize="md"
                                                fontWeight="medium"
                                                color={step.completed ? colors.gray[40] : colors.gray[70]}
                                            >
                                                {step.title}
                                            </Text>
                                            <Text fontSize="sm" color={colors.gray[40]} numberOfLines={2}>
                                                {step.description}
                                            </Text>
                                        </View>

                                        {/* Status Icon */}
                                        <Ionicons
                                            name={step.completed ? 'checkmark-circle' : 'ellipse-outline'}
                                            size={24}
                                            color={step.completed ? colors.semantic.success : colors.gray[30]}
                                        />
                                    </View>
                                </Touchable>
                                {index < steps.length - 1 && <View style={styles.divider} />}
                            </View>
                        ))}
                    </Card>
                </View>
            </ScrollView>

            {/* Sticky CTA Button */}
            <View style={styles.stickyFooter}>
                <Button
                    journey="health"
                    onPress={() => {
                        /* Navigate to current step */
                    }}
                    accessibilityLabel={
                        completedCount === 0
                            ? t('journeys.health.wellnessResources.programDetail.start')
                            : t('journeys.health.wellnessResources.programDetail.continue')
                    }
                    testID="wellness-resources-program-detail-cta"
                >
                    {completedCount === 0
                        ? t('journeys.health.wellnessResources.programDetail.start')
                        : completedCount >= totalSteps
                          ? t('journeys.health.wellnessResources.programDetail.completed')
                          : t('journeys.health.wellnessResources.programDetail.continue')}
                </Button>
            </View>
        </SafeAreaView>
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
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        marginHorizontal: spacingValues.xs,
    },
    headerSpacer: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['5xl'],
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    participantsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.xs,
        marginTop: spacingValues.md,
        paddingHorizontal: spacingValues.xs,
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    detailBadges: {
        flexDirection: 'row',
        marginTop: spacingValues.md,
        gap: spacingValues.lg,
    },
    detailBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
        gap: spacingValues.sm,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: colors.gray[20],
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberCompleted: {
        backgroundColor: colors.semantic.success,
        borderColor: colors.semantic.success,
    },
    stepContent: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[10],
    },
    stickyFooter: {
        paddingHorizontal: spacingValues.md,
        paddingVertical: spacingValues.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray[10],
        backgroundColor: colors.journeys.health.background,
    },
});

export default ProgramDetail;
