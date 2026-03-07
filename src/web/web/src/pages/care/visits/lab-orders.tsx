import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Badge } from 'design-system/components/Badge/Badge';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

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

const MOCK_ORDERS: LabOrder[] = [
    {
        id: 'lab1',
        name: 'Complete Blood Count (CBC)',
        description: 'Evaluate overall health and detect disorders',
        urgency: 'routine',
        fasting: false,
    },
    {
        id: 'lab2',
        name: 'Comprehensive Metabolic Panel',
        description: 'Check kidney function, blood sugar, and electrolytes',
        urgency: 'urgent',
        fasting: true,
    },
    {
        id: 'lab3',
        name: 'Thyroid Function (TSH)',
        description: 'Screen for thyroid disorders that may cause headaches',
        urgency: 'routine',
        fasting: false,
    },
];

const MOCK_LABS: NearbyLab[] = [
    {
        id: 'n1',
        name: 'LabCorp - Downtown',
        address: '123 Main St, Suite 200',
        distance: '0.8 km',
        hours: '7:00 AM - 6:00 PM',
    },
    {
        id: 'n2',
        name: 'Quest Diagnostics - Medical Center',
        address: '456 Health Ave',
        distance: '1.2 km',
        hours: '6:30 AM - 5:00 PM',
    },
];

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

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Lab Orders
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Tests ordered by Dr. Maria Santos on Feb 21, 2026.
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.xl }}>
                {MOCK_ORDERS.map((order) => (
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.xl }}>
                {MOCK_LABS.map((lab) => (
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

export default LabOrdersPage;
