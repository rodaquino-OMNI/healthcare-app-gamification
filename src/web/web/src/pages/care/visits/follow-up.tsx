import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface DateSuggestion {
    id: string;
    date: string;
    time: string;
    type: 'in-person' | 'telemedicine';
    recommended: boolean;
}

const MOCK_SUGGESTIONS: DateSuggestion[] = [
    { id: 'd1', date: 'Mar 7, 2026', time: '10:00 AM', type: 'telemedicine', recommended: true },
    { id: 'd2', date: 'Mar 9, 2026', time: '2:30 PM', type: 'in-person', recommended: false },
    { id: 'd3', date: 'Mar 12, 2026', time: '11:00 AM', type: 'telemedicine', recommended: false },
];

/** Follow-up scheduling page with date suggestions from the doctor. */
const FollowUpPage: React.FC = () => {
    const router = useRouter();

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.xl }}>
                {MOCK_SUGGESTIONS.map((slot) => (
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
                            onPress={() => router.push('/care/appointments/confirm')}
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

export default FollowUpPage;
