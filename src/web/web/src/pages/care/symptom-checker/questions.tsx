import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Checkbox } from 'design-system/components/Checkbox/Checkbox';
import { RadioButton } from 'design-system/components/RadioButton/RadioButton';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

import { useSymptomChecker } from '@/hooks';

/** Follow-up question type definition */
interface FollowUpQuestion {
    id: string;
    text: string;
    type: 'single' | 'multiple';
    options: Array<{ label: string; value: string }>;
}

/** Mock follow-up questions based on common symptom assessments */
const FOLLOW_UP_QUESTIONS: FollowUpQuestion[] = [
    {
        id: 'q1',
        text: 'Have you experienced a fever in the last 48 hours?',
        type: 'single',
        options: [
            { label: 'Yes, above 38C (100.4F)', value: 'fever-high' },
            { label: 'Yes, mild fever', value: 'fever-mild' },
            { label: 'No', value: 'no-fever' },
            { label: 'Not sure', value: 'unsure' },
        ],
    },
    {
        id: 'q2',
        text: 'Which of the following apply to you?',
        type: 'multiple',
        options: [
            { label: 'Chronic condition (e.g., diabetes, hypertension)', value: 'chronic' },
            { label: 'Currently taking medication', value: 'medication' },
            { label: 'Recent surgery or hospitalization', value: 'recent-surgery' },
            { label: 'Pregnant or possibly pregnant', value: 'pregnant' },
            { label: 'None of the above', value: 'none' },
        ],
    },
    {
        id: 'q3',
        text: 'Have you traveled internationally in the last 30 days?',
        type: 'single',
        options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
        ],
    },
];

/**
 * Follow-up questions page in the symptom checker flow.
 * Presents contextual questions with radio/checkbox options to refine the assessment.
 */
const SymptomQuestionsPage: React.FC = () => {
    const router = useRouter();
    const {
        symptoms: _symptoms,
        currentStep: _currentStep,
        setCurrentStep: _setCurrentStep,
        isLoading,
        error,
    } = useSymptomChecker();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {error.message}
                </Text>
            </div>
        );
    }

    const currentQuestion = FOLLOW_UP_QUESTIONS[currentIndex];
    const isLastQuestion = currentIndex === FOLLOW_UP_QUESTIONS.length - 1;
    const currentAnswer = answers[currentQuestion.id];
    const hasAnswer =
        currentQuestion.type === 'single'
            ? typeof currentAnswer === 'string' && currentAnswer !== ''
            : Array.isArray(currentAnswer) && currentAnswer.length > 0;

    const handleSingleAnswer = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: e.target.value,
        }));
    };

    const handleMultipleAnswer = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const val = e.target.value;
        const checked = e.target.checked;
        setAnswers((prev) => {
            const current = (prev[currentQuestion.id] as string[]) || [];
            const updated = checked ? [...current, val] : current.filter((v) => v !== val);
            return { ...prev, [currentQuestion.id]: updated };
        });
    };

    const handleNext = (): void => {
        if (isLastQuestion) {
            void router.push({
                pathname: WEB_CARE_ROUTES.SYMPTOM_SEVERITY,
                query: router.query,
            });
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = (): void => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        } else {
            router.back();
        }
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Follow-up Questions
            </Text>
            <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Question {currentIndex + 1} of {FOLLOW_UP_QUESTIONS.length}
            </Text>

            <Card journey="care" elevation="md" padding="lg">
                <Text fontWeight="medium" fontSize="lg" style={{ marginBottom: spacing.lg }}>
                    {currentQuestion.text}
                </Text>

                <Box style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {currentQuestion.type === 'single'
                        ? currentQuestion.options.map((option) => (
                              <RadioButton
                                  key={option.value}
                                  id={`${currentQuestion.id}-${option.value}`}
                                  name={currentQuestion.id}
                                  value={option.value}
                                  label={option.label}
                                  checked={currentAnswer === option.value}
                                  onChange={handleSingleAnswer}
                                  journey="care"
                                  testID={`radio-${option.value}`}
                              />
                          ))
                        : currentQuestion.options.map((option) => (
                              <Checkbox
                                  key={option.value}
                                  id={`${currentQuestion.id}-${option.value}`}
                                  name={currentQuestion.id}
                                  value={option.value}
                                  label={option.label}
                                  checked={Array.isArray(currentAnswer) && currentAnswer.includes(option.value)}
                                  onChange={handleMultipleAnswer}
                                  journey="care"
                                  testID={`checkbox-${option.value}`}
                              />
                          ))}
                </Box>
            </Card>

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={handlePrevious}
                    accessibilityLabel={currentIndex > 0 ? 'Previous question' : 'Go back'}
                >
                    {currentIndex > 0 ? 'Previous' : 'Back'}
                </Button>
                <Button
                    journey="care"
                    onPress={handleNext}
                    disabled={!hasAnswer}
                    accessibilityLabel={isLastQuestion ? 'Continue to severity' : 'Next question'}
                >
                    {isLastQuestion ? 'Continue' : 'Next'}
                </Button>
            </Box>
        </div>
    );
};

export default SymptomQuestionsPage;
