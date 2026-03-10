import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

import { useSymptomChecker } from '@/hooks';

/** Recommendation action type */
interface Recommendation {
    id: string;
    type: 'emergency' | 'doctor' | 'self-care' | 'medication';
    title: string;
    description: string;
    urgency: 'immediate' | 'soon' | 'routine';
}

/** Mock recommendations based on assessment */
const MOCK_RECOMMENDATIONS: Recommendation[] = [
    {
        id: 'r1',
        type: 'self-care',
        title: 'Rest and Hydration',
        description:
            'Get plenty of rest and drink fluids. ' +
            'Most upper respiratory infections ' +
            'resolve within 7-10 days.',
        urgency: 'routine',
    },
    {
        id: 'r2',
        type: 'medication',
        title: 'Over-the-Counter Relief',
        description:
            'Consider acetaminophen or ibuprofen ' +
            'for fever and pain. Decongestants may ' +
            'help with nasal symptoms.',
        urgency: 'routine',
    },
    {
        id: 'r3',
        type: 'doctor',
        title: 'Schedule a Visit',
        description:
            'If symptoms persist beyond 10 days or ' +
            'worsen significantly, schedule an ' +
            'appointment with your primary care ' +
            'provider.',
        urgency: 'soon',
    },
    {
        id: 'r4',
        type: 'emergency',
        title: 'Seek Immediate Care If...',
        description:
            'Go to the emergency room if you experience ' +
            'difficulty breathing, chest pain, persistent ' +
            'high fever (above 39.4C/103F), or confusion.',
        urgency: 'immediate',
    },
];

const getTypeIcon = (type: string): string => {
    switch (type) {
        case 'emergency':
            return 'Emergency';
        case 'doctor':
            return 'See Doctor';
        case 'medication':
            return 'Medication';
        case 'self-care':
            return 'Self Care';
        default:
            return 'Info';
    }
};

const getUrgencyStatus = (urgency: string): 'error' | 'warning' | 'success' => {
    switch (urgency) {
        case 'immediate':
            return 'error';
        case 'soon':
            return 'warning';
        default:
            return 'success';
    }
};

const getUrgencyLabel = (urgency: string): string => {
    switch (urgency) {
        case 'immediate':
            return 'Immediate';
        case 'soon':
            return 'Within a few days';
        default:
            return 'Routine';
    }
};

/**
 * Recommendation page showing actionable next steps
 * organized by urgency: emergency, see doctor, self-care, and medication suggestions.
 */
const SymptomRecommendationPage: React.FC = () => {
    const router = useRouter();
    const { results: _results, isLoading, error, getRecommendations: _getRecommendations } = useSymptomChecker();

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

    const handleDone = (): void => {
        void router.push(WEB_CARE_ROUTES.SYMPTOM_CHECKER);
    };

    const handleBookAppointment = (): void => {
        void router.push(WEB_CARE_ROUTES.BOOK_APPOINTMENT);
    };

    const handleTelemedicine = (): void => {
        void router.push(WEB_CARE_ROUTES.TELEMEDICINE);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Recommendations
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Based on your assessment, here are our recommended next steps.
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {MOCK_RECOMMENDATIONS.map((rec) => (
                    <Card
                        key={rec.id}
                        journey="care"
                        elevation="sm"
                        padding="lg"
                        borderColor={
                            rec.urgency === 'immediate'
                                ? colors.semantic.error
                                : rec.urgency === 'soon'
                                  ? colors.semantic.warning
                                  : colors.neutral.gray300
                        }
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginBottom: spacing.xs }}
                        >
                            <Box display="flex" alignItems="center" style={{ gap: spacing.xs }}>
                                <Badge variant="status" status={getUrgencyStatus(rec.urgency)}>
                                    {getTypeIcon(rec.type)}
                                </Badge>
                                <Text fontWeight="bold" fontSize="md">
                                    {rec.title}
                                </Text>
                            </Box>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {getUrgencyLabel(rec.urgency)}
                            </Text>
                        </Box>
                        <Text fontSize="sm" color={colors.gray[60]}>
                            {rec.description}
                        </Text>
                    </Card>
                ))}
            </div>

            <Card journey="care" elevation="md" padding="lg" style={{ marginTop: spacing.xl }}>
                <Text fontWeight="medium" fontSize="md" style={{ marginBottom: spacing.md }}>
                    Need to talk to a professional?
                </Text>
                <Box display="flex" style={{ gap: spacing.md, flexWrap: 'wrap' }}>
                    <Button journey="care" onPress={handleBookAppointment} accessibilityLabel="Book an appointment">
                        Book Appointment
                    </Button>
                    <Button
                        variant="secondary"
                        journey="care"
                        onPress={handleTelemedicine}
                        accessibilityLabel="Start a telemedicine consultation"
                    >
                        Telemedicine
                    </Button>
                </Box>
            </Card>

            <Box display="flex" justifyContent="center" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={handleDone}
                    accessibilityLabel="Done, return to symptom checker"
                >
                    Done
                </Button>
            </Box>
        </div>
    );
};

export default SymptomRecommendationPage;
