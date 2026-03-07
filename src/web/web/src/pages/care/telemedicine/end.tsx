import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const STAR_RATINGS = [1, 2, 3, 4, 5];

const MOCK_SUMMARY = {
    doctorName: 'Dr. Maria Santos',
    specialty: 'General Practitioner',
    duration: '18 min 42 sec',
    date: 'Feb 21, 2026',
};

/** Call ended page with rating, feedback, and follow-up actions. */
const EndPage: React.FC = () => {
    const router = useRouter();

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="center" style={{ marginBottom: spacing.lg }}>
                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                    Call Ended
                </Text>
            </Box>

            <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.md }}
                >
                    Call Summary
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Doctor
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                            {MOCK_SUMMARY.doctorName}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Specialty
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                            {MOCK_SUMMARY.specialty}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Duration
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                            {MOCK_SUMMARY.duration}
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Date
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                            {MOCK_SUMMARY.date}
                        </Text>
                    </Box>
                </div>
            </Card>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Rate Your Experience
                </Text>
                <Box display="flex" justifyContent="center" style={{ gap: spacing.md, marginBottom: spacing.md }}>
                    {STAR_RATINGS.map((star) => (
                        <Button
                            key={star}
                            variant="tertiary"
                            journey="care"
                            onPress={() => {}}
                            accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            data-testid={`end-rating-${star}-btn`}
                        >
                            {star <= 4 ? '\u2606' : '\u2605'}
                        </Button>
                    ))}
                </Box>

                <div
                    style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: spacing.sm,
                        border: `1px solid ${colors.gray[20]}`,
                        borderRadius: spacing.xs,
                        backgroundColor: colors.neutral.white,
                    }}
                >
                    <Text fontSize="sm" color={colors.gray[40]}>
                        Share your feedback about this consultation (optional)...
                    </Text>
                </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                <Button
                    journey="care"
                    onPress={() => router.push('/care/visits/summary')}
                    accessibilityLabel="View visit summary"
                    data-testid="end-view-summary-btn"
                >
                    View Summary
                </Button>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.push('/care/visits/follow-up')}
                    accessibilityLabel="Book follow-up appointment"
                    data-testid="end-book-followup-btn"
                >
                    Book Follow-Up
                </Button>
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={() => router.push('/care')}
                    accessibilityLabel="Return to care dashboard"
                    data-testid="end-return-dashboard-btn"
                >
                    Return to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default EndPage;
