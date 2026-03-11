import { useState, useCallback } from 'react';
import { HealthMetric } from 'shared/types/health.types';

import { createHealthMetric } from '@/api/health';
import { useAuth } from '@/hooks/useAuth';

const TOTAL_STEPS = 26;

interface UseAssessmentReturn {
    currentStep: number;
    totalSteps: number;
    answers: Record<string, unknown>;
    isSubmitting: boolean;
    assessmentResult: HealthMetric | null;
    assessmentError: Error | null;
    submitStep: (stepData: Record<string, unknown>) => void;
    goBack: () => void;
    resetAssessment: () => void;
}

/**
 * Hook for managing a multi-step health assessment flow.
 * Tracks the current step, accumulated answers, and submission state.
 * On the final step, calls createHealthMetric to persist the result.
 *
 * @param recordId - The health record ID to associate the assessment metric with
 * @returns Object with step state, answers, submission helpers, and result/error
 */
export const useAssessment = (recordId: string): UseAssessmentReturn => {
    const { session } = useAuth();
    const userId = session?.userId || '';

    const [currentStep, setCurrentStep] = useState(1);
    const [answers, setAnswers] = useState<Record<string, unknown>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState<HealthMetric | null>(null);
    const [assessmentError, setAssessmentError] = useState<Error | null>(null);

    const submitStep = useCallback(
        (stepData: Record<string, unknown>) => {
            const updatedAnswers = { ...answers, [`step_${currentStep}`]: stepData };
            setAnswers(updatedAnswers);

            if (currentStep < TOTAL_STEPS) {
                setCurrentStep((prev) => prev + 1);
                return;
            }

            // Final step: submit the assessment
            if (!userId || !recordId) {
                return;
            }
            setIsSubmitting(true);
            setAssessmentError(null);

            createHealthMetric(recordId, {
                type: 'assessment',
                value: Object.keys(updatedAnswers).length,
                unit: 'steps_completed',
                source: 'health_assessment',
                timestamp: new Date().toISOString(),
            })
                .then((result) => {
                    setAssessmentResult(result);
                })
                .catch((err: Error) => {
                    setAssessmentError(err);
                    console.error('Error submitting assessment:', err);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        },
        [answers, currentStep, userId, recordId]
    );

    const goBack = useCallback(() => {
        setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
    }, []);

    const resetAssessment = useCallback(() => {
        setCurrentStep(1);
        setAnswers({});
        setIsSubmitting(false);
        setAssessmentResult(null);
        setAssessmentError(null);
    }, []);

    return {
        currentStep,
        totalSteps: TOTAL_STEPS,
        answers,
        isSubmitting,
        assessmentResult,
        assessmentError,
        submitStep,
        goBack,
        resetAssessment,
    };
};
