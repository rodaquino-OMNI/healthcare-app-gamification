import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useVisits } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface LabOrder {
    id: string;
    name: string;
    description: string;
    urgency: 'routine' | 'urgent' | 'stat';
    fasting: boolean;
}

interface NearbyLab {
    id: string;
    name: string;
    address: string;
    distance: string;
    hours: string;
}

const getUrgencyStatus = (urgency: string): 'success' | 'warning' | 'error' => {
    switch (urgency) {
        case 'urgent':
            return 'warning';
        case 'stat':
            return 'error';
        default:
            return 'success';
    }
};

/** Lab orders page showing ordered tests and nearby lab locations. */
const LabOrdersPage: React.FC = () => {
    const router = useRouter();
    const { isLoading, error } = useVisits();
    const orders: LabOrder[] = [];
    const nearbyLabs: NearbyLab[] = [];
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('common.loading')}
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {t('common.error')}
                </Text>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Lab Orders
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Tests ordered by Dr. Maria Santos on Feb 21, 2026.
            </Text>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                    marginBottom: spacing.xl,
                }}
            >
                {orders.map((order) => (
                    <Card key={order.id} journey="care" elevation="md" padding="lg">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginBottom: spacing.xs }}
                        >
                            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                {order.name}
                            </Text>
                            <Badge variant="status" status={getUrgencyStatus(order.urgency)}>
                                {order.urgency.charAt(0).toUpperCase() + order.urgency.slice(1)}
                            </Badge>
                        </Box>
                        <Text fontSize="sm" color={colors.gray[60]} style={{ marginBottom: spacing.xs }}>
                            {order.description}
                        </Text>
                        {order.fasting && (
                            <Text fontSize="sm" fontWeight="medium" color={colors.semantic.warning}>
                                Requires fasting (8-12 hours)
                            </Text>
                        )}
                    </Card>
                ))}
            </div>

            <Text
                fontWeight="bold"
                fontSize="lg"
                color={colors.journeys.care.text}
                style={{ marginBottom: spacing.md }}
            >
                Nearby Labs
            </Text>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                    marginBottom: spacing.xl,
                }}
            >
                {nearbyLabs.map((lab) => (
                    <Card key={lab.id} journey="care" elevation="sm" padding="lg">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginBottom: spacing.xs }}
                        >
                            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                {lab.name}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {lab.distance}
                            </Text>
                        </Box>
                        <Text fontSize="sm" color={colors.gray[60]}>
                            {lab.address}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                            {lab.hours}
                        </Text>
                        <Button
                            variant="secondary"
                            journey="care"
                            onPress={() => {}}
                            accessibilityLabel={`Schedule at ${lab.name}`}
                            data-testid={`lab-schedule-${lab.id}-btn`}
                            style={{ marginTop: spacing.sm }}
                        >
                            Schedule Here
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
                    data-testid="lab-orders-back-btn"
                >
                    Back
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default LabOrdersPage;
