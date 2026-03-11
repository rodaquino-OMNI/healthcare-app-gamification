import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

import { useVisits } from '@/hooks';

/** Visit summary page showing diagnosis, notes, and post-visit actions. */
const VisitSummaryPage: React.FC = () => {
    const router = useRouter();
    const { currentVisit, isLoading, error } = useVisits();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading visit summary...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    Failed to load visit summary.
                </Text>
            </div>
        );
    }

    const visit = {
        doctor: currentVisit?.doctor ?? '',
        specialty: currentVisit?.specialty ?? '',
        date: currentVisit?.date ?? '',
        type: currentVisit?.type ?? '',
    };
    const diagnosis = {
        primary: currentVisit?.diagnosis ?? '',
        code: '',
        severity: '',
    };
    const recommendations: string[] = [];

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Visit Summary
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                {visit.date} - {visit.type}
            </Text>

            <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Box display="flex" alignItems="center" style={{ gap: spacing.md }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: colors.journeys.care.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text fontSize="md" fontWeight="bold" color={colors.neutral.white}>
                            {'--'}
                        </Text>
                    </div>
                    <div>
                        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                            {visit.doctor}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {visit.specialty}
                        </Text>
                    </div>
                </Box>
            </Card>

            <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ marginBottom: spacing.sm }}
                >
                    <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.text}>
                        Diagnosis
                    </Text>
                    {diagnosis.severity && (
                        <Badge variant="status" status="success">
                            {diagnosis.severity}
                        </Badge>
                    )}
                </Box>
                <Text fontSize="md" fontWeight="medium" color={colors.journeys.care.text}>
                    {diagnosis.primary}
                </Text>
                {diagnosis.code && (
                    <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                        ICD-10: {diagnosis.code}
                    </Text>
                )}
            </Card>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.lg }}>
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Clinical Notes
                </Text>
                <Text fontSize="sm" color={colors.gray[60]}>
                    {currentVisit?.notes ?? 'No clinical notes available.'}
                </Text>
            </Card>

            <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Recommendations
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {recommendations.map((rec, idx) => (
                        <Box key={idx} display="flex" style={{ gap: spacing.xs }}>
                            <Text fontSize="sm" color={colors.journeys.care.primary}>
                                {'•'}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[60]}>
                                {rec}
                            </Text>
                        </Box>
                    ))}
                </div>
            </Card>

            <div style={{ display: 'flex', gap: spacing.sm }}>
                <Button
                    journey="care"
                    onPress={() => void router.push('/care/visits/prescriptions')}
                    accessibilityLabel="View prescriptions"
                    data-testid="summary-prescriptions-btn"
                >
                    View Prescriptions
                </Button>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => void router.push('/care/visits/follow-up')}
                    accessibilityLabel="Schedule follow-up"
                    data-testid="summary-followup-btn"
                >
                    Schedule Follow-Up
                </Button>
            </div>

            <Box display="flex" justifyContent="center" style={{ marginTop: spacing.lg }}>
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={() => void router.push('/care')}
                    accessibilityLabel="Back to care"
                    data-testid="summary-back-btn"
                >
                    Back to Care
                </Button>
            </Box>
        </div>
    );
};

export default VisitSummaryPage;
