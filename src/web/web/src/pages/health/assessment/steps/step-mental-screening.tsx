import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const QUESTIONS = [
    { key: 'interest', text: 'Little interest or pleasure in doing things' },
    { key: 'depressed', text: 'Feeling down, depressed, or hopeless' },
];

const OPTIONS = [
    { key: 'notAtAll', label: 'Not at all', score: 0 },
    { key: 'severalDays', label: 'Several days', score: 1 },
    { key: 'moreThanHalf', label: 'More than half the days', score: 2 },
    { key: 'nearlyEvery', label: 'Nearly every day', score: 3 },
];

const optionStyle = (selected: boolean): React.CSSProperties => ({
    padding: spacing.sm,
    borderRadius: 8,
    border: `1px solid ${selected ? colors.journeys.health.primary : colors.neutral.gray300}`,
    backgroundColor: selected ? colors.journeys.health.background : colors.neutral.white,
    textAlign: 'left' as const,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontSize: 14,
    fontWeight: selected ? 600 : 400,
    color: colors.neutral.gray900,
});

const StepMentalScreeningPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    const getScore = (): number => {
        let total = 0;
        QUESTIONS.forEach((q) => {
            const answer = data[`phq2_${q.key}`] as string | undefined;
            const opt = OPTIONS.find((o) => o.key === answer);
            if (opt) {
                total += opt.score;
            }
        });
        return total;
    };

    const score = getScore();
    const bothAnswered = QUESTIONS.every((q) => data[`phq2_${q.key}`] !== undefined);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Mental Health Screening (PHQ-2)
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Over the last 2 weeks, how often have you been bothered by the following problems?
            </Text>

            {QUESTIONS.map((question) => (
                <Card key={question.key} journey="health" elevation="sm" padding="lg">
                    <Text
                        fontSize="sm"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        {question.text}
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        {OPTIONS.map((option) => {
                            const isActive = (data[`phq2_${question.key}`] as string) === option.key;
                            return (
                                <button
                                    key={option.key}
                                    onClick={() => onUpdate(`phq2_${question.key}`, option.key)}
                                    style={optionStyle(isActive)}
                                    aria-pressed={isActive}
                                    aria-label={`${option.label} for ${question.text}`}
                                >
                                    <div
                                        style={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            border: `2px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray400}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {isActive && (
                                            <div
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    backgroundColor: colors.journeys.health.primary,
                                                }}
                                            />
                                        )}
                                    </div>
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </Card>
            ))}

            {bothAnswered && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: spacing.sm,
                        backgroundColor: colors.neutral.gray100,
                        borderRadius: 8,
                    }}
                >
                    <Text fontSize="sm" color={colors.neutral.gray700}>
                        PHQ-2 Score
                    </Text>
                    <div
                        style={{
                            padding: `${spacing['3xs']} ${spacing.sm}`,
                            borderRadius: 20,
                            backgroundColor: score >= 3 ? colors.semantic.warning : colors.journeys.health.primary,
                            color: colors.neutral.white,
                            fontWeight: 700,
                            fontSize: 14,
                        }}
                    >
                        {score}/6
                    </div>
                </div>
            )}

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ borderLeft: `3px solid ${colors.semantic.info}` }}
            >
                <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                    Confidentiality Notice
                </Text>
                <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                    Your responses are confidential and protected by medical privacy regulations. This screening is not
                    a diagnosis but helps identify areas where you may benefit from additional support.
                </Text>
            </Card>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default StepMentalScreeningPage;
