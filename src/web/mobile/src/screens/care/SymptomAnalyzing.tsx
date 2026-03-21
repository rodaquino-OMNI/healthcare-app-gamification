import { Card } from '@austa/design-system/src/components/Card/Card';
import { ProgressBar } from '@austa/design-system/src/components/ProgressBar/ProgressBar';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Animated } from 'react-native';

import { ROUTES } from '@constants/routes';

interface PossibleCondition {
    id: string;
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
}

const MOCK_CONDITIONS: PossibleCondition[] = [
    {
        id: 'c1',
        name: 'Common Cold',
        probability: 72,
        severity: 'low',
        description:
            'A viral infection of the upper respiratory tract. Symptoms typically resolve within 7-10 days with rest and hydration.',
    },
    {
        id: 'c2',
        name: 'Seasonal Allergies',
        probability: 58,
        severity: 'low',
        description:
            'An immune response to environmental allergens such as pollen, dust, or pet dander. Treatable with antihistamines.',
    },
    {
        id: 'c3',
        name: 'Tension Headache',
        probability: 45,
        severity: 'medium',
        description:
            'A common type of headache caused by muscle tension, stress, or fatigue. Usually responds to OTC pain relievers.',
    },
    {
        id: 'c4',
        name: 'Gastroenteritis',
        probability: 30,
        severity: 'medium',
        description:
            'Inflammation of the stomach and intestines, often caused by viral or bacterial infection. Hydration is critical.',
    },
    {
        id: 'c5',
        name: 'Influenza',
        probability: 18,
        severity: 'high',
        description:
            'A viral respiratory infection that can cause severe symptoms. May require antiviral medication if caught early.',
    },
];

const STEP_DURATION_MS = 2000;

type SymptomAnalyzingRouteParams = {
    symptoms: Array<{ id: string; name: string }>;
    description: string;
    regions: Array<{ id: string; label: string }>;
    details: any[];
    answers: Record<string, string | string[]>;
    overallSeverity: number;
};

/**
 * AI analyzing animation/loading screen.
 * Shows animated progress through 4 analysis steps, then auto-navigates
 * to the conditions list screen upon completion.
 */
const SymptomAnalyzing: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: SymptomAnalyzingRouteParams }, 'params'>>();
    const { t } = useTranslation();
    const {
        symptoms = [],
        description = '',
        regions = [],
        details = [],
        answers = {},
        overallSeverity = 5,
    } = route.params || {};

    const [currentStep, setCurrentStep] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const analysisSteps = [
        t('journeys.care.symptomChecker.analyzing.step1', { defaultValue: 'Analyzing symptoms...' }),
        t('journeys.care.symptomChecker.analyzing.step2', { defaultValue: 'Checking medical database...' }),
        t('journeys.care.symptomChecker.analyzing.step3', { defaultValue: 'Comparing patterns...' }),
        t('journeys.care.symptomChecker.analyzing.step4', { defaultValue: 'Generating results...' }),
    ];

    const totalSteps = analysisSteps.length;
    const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

    useEffect(() => {
        if (currentStep >= totalSteps) {
            const sortedConditions = [...MOCK_CONDITIONS].sort((a, b) => b.probability - a.probability);
            navigation.replace(ROUTES.CARE_SYMPTOM_CONDITIONS_LIST, {
                symptoms,
                description,
                regions,
                details,
                answers,
                overallSeverity,
                conditions: sortedConditions,
            });
            return;
        }

        const timer = setTimeout(() => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            setCurrentStep((prev) => prev + 1);
        }, STEP_DURATION_MS);

        return () => clearTimeout(timer);
    }, [
        currentStep,
        totalSteps,
        navigation,
        fadeAnim,
        symptoms,
        description,
        regions,
        details,
        answers,
        overallSeverity,
    ]);

    return (
        <View style={styles.root}>
            <View style={styles.container}>
                <Text variant="heading" journey="care" textAlign="center" testID="analyzing-title">
                    {t('journeys.care.symptomChecker.analyzing.title', { defaultValue: 'Analyzing Your Symptoms' })}
                </Text>

                <Card journey="care" elevation="md">
                    <View style={styles.stepsContainer}>
                        {analysisSteps.map((step, index) => {
                            const isActive = index === currentStep;
                            const isCompleted = index < currentStep;

                            return (
                                <Animated.View key={index} style={[styles.stepRow, isActive && { opacity: fadeAnim }]}>
                                    <View
                                        style={[
                                            styles.stepIndicator,
                                            isCompleted && styles.stepIndicatorCompleted,
                                            isActive && styles.stepIndicatorActive,
                                        ]}
                                    >
                                        <Text
                                            fontSize="text-xs"
                                            fontWeight="bold"
                                            color={
                                                isCompleted || isActive ? colors.neutral.white : colors.neutral.gray500
                                            }
                                            textAlign="center"
                                        >
                                            {isCompleted ? '\u2713' : `${index + 1}`}
                                        </Text>
                                    </View>
                                    <Text
                                        variant="body"
                                        journey="care"
                                        color={
                                            isActive
                                                ? colors.journeys.care.primary
                                                : isCompleted
                                                  ? colors.semantic.success
                                                  : colors.neutral.gray500
                                        }
                                        fontWeight={isActive ? 'semiBold' : 'regular'}
                                        testID={`analyzing-step-${index}`}
                                    >
                                        {step}
                                    </Text>
                                </Animated.View>
                            );
                        })}
                    </View>

                    <View style={styles.progressContainer}>
                        <ProgressBar
                            current={progressPercent}
                            total={100}
                            journey="care"
                            size="md"
                            testId="analyzing-progress"
                            ariaLabel={t('journeys.care.symptomChecker.analyzing.progressLabel', {
                                defaultValue: `Analysis progress: ${progressPercent}%`,
                                percent: progressPercent,
                            })}
                        />
                        <Text
                            fontSize="text-sm"
                            color={colors.neutral.gray600}
                            textAlign="center"
                            testID="analyzing-percent"
                        >
                            {progressPercent}%
                        </Text>
                    </View>
                </Card>

                <Text variant="caption" color={colors.neutral.gray600} textAlign="center" testID="analyzing-disclaimer">
                    {t('journeys.care.symptomChecker.analyzing.disclaimer', {
                        defaultValue:
                            'This analysis is for informational purposes only and does not replace professional medical advice.',
                    })}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
        justifyContent: 'center',
    },
    container: {
        padding: spacingValues.md,
        gap: spacingValues.xl,
    },
    stepsContainer: {
        gap: spacingValues.md,
        marginBottom: spacingValues.xl,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    stepIndicator: {
        width: spacingValues.xl,
        height: spacingValues.xl,
        borderRadius: spacingValues.sm,
        backgroundColor: colors.neutral.gray300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepIndicatorCompleted: {
        backgroundColor: colors.semantic.success,
    },
    stepIndicatorActive: {
        backgroundColor: colors.journeys.care.primary,
    },
    progressContainer: {
        gap: spacingValues.xs,
    },
});

export { SymptomAnalyzing };
export default SymptomAnalyzing;
