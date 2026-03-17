import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

import { useSymptomChecker } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface Section {
    title: string;
    content: string;
}

const CONDITION_DETAIL = {
    name: 'Upper Respiratory Infection',
    severity: 'low' as const,
    probability: 72,
    sections: [
        {
            title: 'Overview',
            content:
                'An upper respiratory infection (URI) is a ' +
                'viral illness that affects the nose, throat, ' +
                'and airways. It is one of the most common ' +
                'reasons for medical visits and typically ' +
                'resolves without treatment.',
        },
        {
            title: 'Common Causes',
            content:
                'Rhinoviruses are the most common cause. ' +
                'Other causes include coronavirus, adenovirus, ' +
                'and influenza virus. Transmission occurs ' +
                'through respiratory droplets or contaminated ' +
                'surfaces.',
        },
        {
            title: 'Treatment Options',
            content:
                'Rest and fluids are the primary treatment. ' +
                'Over-the-counter medications like ' +
                'acetaminophen, ibuprofen, decongestants, and ' +
                'antihistamines can help manage symptoms. ' +
                'Antibiotics are not effective against viral ' +
                'infections.',
        },
        {
            title: 'When to Worry',
            content:
                'Seek medical attention if symptoms worsen ' +
                'after 10 days, you develop a high fever ' +
                '(above 39.4C), experience difficulty ' +
                'breathing, chest pain, severe headache with ' +
                'stiff neck, or symptoms significantly impact ' +
                'daily activities.',
        },
    ] as Section[],
};

/** Condition detail page showing overview, causes, treatment, and when-to-worry sections. */
const ConditionDetailPage: React.FC = () => {
    const router = useRouter();
    const { results: _results, isLoading, error } = useSymptomChecker();

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

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.xs }}>
                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                    {CONDITION_DETAIL.name}
                </Text>
                <Badge variant="status" status="success">
                    {CONDITION_DETAIL.severity.charAt(0).toUpperCase() + CONDITION_DETAIL.severity.slice(1)}
                </Badge>
            </Box>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginBottom: spacing.xl }}>
                Match probability: {CONDITION_DETAIL.probability}%
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {CONDITION_DETAIL.sections.map((section) => (
                    <Card
                        key={section.title}
                        journey="care"
                        elevation="sm"
                        padding="lg"
                        borderColor={
                            section.title === 'When to Worry' ? colors.semantic.warning : colors.neutral.gray300
                        }
                    >
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={
                                section.title === 'When to Worry' ? colors.semantic.warning : colors.journeys.care.text
                            }
                            style={{ marginBottom: spacing.xs }}
                        >
                            {section.title}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[60]}>
                            {section.content}
                        </Text>
                    </Card>
                ))}
            </div>

            <Card journey="care" elevation="md" padding="lg" style={{ marginTop: spacing.xl }}>
                <Text fontWeight="medium" fontSize="md" style={{ marginBottom: spacing.md }}>
                    Want professional guidance?
                </Text>
                <Box display="flex" style={{ gap: spacing.md, flexWrap: 'wrap' }}>
                    <Button
                        journey="care"
                        onPress={() => void router.push(WEB_CARE_ROUTES.BOOK_APPOINTMENT)}
                        accessibilityLabel="Book an appointment"
                        data-testid="condition-detail-book-btn"
                    >
                        Book Appointment
                    </Button>
                    <Button
                        variant="secondary"
                        journey="care"
                        onPress={() => void router.push(WEB_CARE_ROUTES.TELEMEDICINE)}
                        accessibilityLabel="Start telemedicine"
                        data-testid="condition-detail-tele-btn"
                    >
                        Telemedicine
                    </Button>
                </Box>
            </Card>

            <Box display="flex" justifyContent="flex-start" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back to conditions list"
                    data-testid="condition-detail-back-btn"
                >
                    Back to Conditions
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default ConditionDetailPage;
