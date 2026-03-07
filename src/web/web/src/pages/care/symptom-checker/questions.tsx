import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { RadioButton } from 'src/web/design-system/src/components/RadioButton/RadioButton';
import { Checkbox } from 'src/web/design-system/src/components/Checkbox/Checkbox';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_CARE_ROUTES } from 'src/web/shared/constants/routes';

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

    const currentQuestion = FOLLOW_UP_QUESTIONS[currentIndex];
    const isLastQuestion = currentIndex === FOLLOW_UP_QUESTIONS.length - 1;
    const currentAnswer = answers[currentQuestion.id];
    const hasAnswer =
        currentQuestion.type === 'single'
            ? typeof currentAnswer === 'string' && currentAnswer !== ''
            : Array.isArray(currentAnswer) && currentAnswer.length > 0;

    const handleSingleAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: e.target.value,
        }));
    };

    const handleMultipleAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const checked = e.target.checked;
        setAnswers((prev) => {
            const current = (prev[currentQuestion.id] as string[]) || [];
            const updated = checked ? [...current, val] : current.filter((v) => v !== val);
            return { ...prev, [currentQuestion.id]: updated };
        });
    };

    const handleNext = () => {
        if (isLastQuestion) {
            router.push({
                pathname: WEB_CARE_ROUTES.SYMPTOM_SEVERITY,
                query: router.query,
            });
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
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
