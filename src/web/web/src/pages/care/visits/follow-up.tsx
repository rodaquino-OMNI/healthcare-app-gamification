import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

import { useVisits } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface DateSuggestion {
    id: string;
    date: string;
    time: string;
    type: 'in-person' | 'telemedicine';
    recommended: boolean;
}

/** Follow-up scheduling page with date suggestions from the doctor. */
const FollowUpPage: React.FC = () => {
    const router = useRouter();
    const { isLoading, error } = useVisits();
    const suggestions: DateSuggestion[] = [];

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading follow-up options...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    Failed to load follow-up data.
                </Text>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Schedule Follow-Up
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Dr. Santos recommends a follow-up visit within 2 weeks.
            </Text>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Text
                    fontWeight="medium"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.xs }}
                >
                    Doctor Recommendation
                </Text>
                <Text fontSize="sm" color={colors.gray[60]}>
                    A follow-up is recommended to evaluate headache progression and assess response to prescribed
                    treatment. If symptoms worsen before your follow-up, please contact us immediately.
                </Text>
            </Card>

            <Text
                fontWeight="bold"
                fontSize="md"
                color={colors.journeys.care.text}
                style={{ marginBottom: spacing.md }}
            >
                Available Dates
            </Text>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                    marginBottom: spacing.xl,
                }}
            >
                {suggestions.map((slot) => (
                    <Card
                        key={slot.id}
                        journey="care"
                        elevation="md"
                        padding="lg"
                        style={{
                            border: slot.recommended ? `2px solid ${colors.journeys.care.primary}` : undefined,
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginBottom: spacing.sm }}
                        >
                            <div>
                                <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                    {slot.date}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    {slot.time}
                                </Text>
                            </div>
                            <div style={{ display: 'flex', gap: spacing.xs }}>
                                <Badge variant="status" status={slot.type === 'telemedicine' ? 'info' : 'success'}>
                                    {slot.type === 'telemedicine' ? 'Video' : 'In-Person'}
                                </Badge>
                                {slot.recommended && (
                                    <Badge variant="status" status="warning">
                                        Recommended
                                    </Badge>
                                )}
                            </div>
                        </Box>
                        <Button
                            journey="care"
                            onPress={() => void router.push('/care/appointments/confirm')}
                            accessibilityLabel={`Book follow-up on ${slot.date}`}
                            data-testid={`followup-book-${slot.id}-btn`}
                        >
                            Book This Slot
                        </Button>
                    </Card>
                ))}
            </div>

            <Box display="flex" justifyContent="center">
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="followup-back-btn"
                >
                    Back
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default FollowUpPage;
