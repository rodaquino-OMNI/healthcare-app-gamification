import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';

import { useCycle } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface FlowOption {
    id: string;
    label: string;
    description: string;
    dotCount: number;
}

const FLOW_OPTIONS: FlowOption[] = [
    { id: 'light', label: 'Light', description: 'Spotting or minimal flow', dotCount: 1 },
    { id: 'medium', label: 'Medium', description: 'Regular, moderate flow', dotCount: 2 },
    { id: 'heavy', label: 'Heavy', description: 'Heavy or very heavy flow', dotCount: 3 },
];

const LogFlowPage: React.FC = () => {
    const router = useRouter();
    const { data: cycleData, loading, error, refetch } = useCycle();
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedFlow, setSelectedFlow] = useState('medium');
    const [date, setDate] = useState(todayStr);

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>Loading...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    Error loading data. <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void cycleData;

    const handleSave = (): void => {
        window.alert(`Flow logged: ${selectedFlow} on ${date}`);
        void router.push('/health/cycle');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/cycle')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to cycle home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Log Flow
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Record your flow intensity for the day
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Date
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    aria-label="Flow date"
                    style={{
                        width: '100%',
                        padding: spacing.sm,
                        border: `1px solid ${colors.gray[20]}`,
                        borderRadius: '8px',
                        fontSize: '16px',
                        color: colors.gray[60],
                        outline: 'none',
                    }}
                />
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Flow Intensity
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {FLOW_OPTIONS.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => setSelectedFlow(option.id)}
                        role="radio"
                        aria-checked={selectedFlow === option.id}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setSelectedFlow(option.id);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Box display="flex" alignItems="center" style={{ gap: spacing.md }}>
                                <div
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: '50%',
                                        border: `2px solid ${colors.journeys.health.primary}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {selectedFlow === option.id && (
                                        <div
                                            style={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: colors.journeys.health.primary,
                                            }}
                                        />
                                    )}
                                </div>
                                <Box style={{ flex: 1 }}>
                                    <Box display="flex" alignItems="center" style={{ gap: spacing.xs }}>
                                        <Text fontWeight="semiBold" fontSize="md">
                                            {option.label}
                                        </Text>
                                        <div style={{ display: 'flex', gap: spacing['3xs'] }}>
                                            {Array.from({ length: option.dotCount }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        backgroundColor: colors.semantic.error,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </Box>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {option.description}
                                    </Text>
                                </Box>
                            </Box>
                        </Card>
                    </div>
                ))}
            </div>

            <Box display="flex" style={{ flexDirection: 'column', gap: spacing.sm, marginTop: spacing['2xl'] }}>
                <Button journey="health" onPress={handleSave} accessibilityLabel="Save flow log">
                    Save
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => void router.push('/health/cycle')}
                    accessibilityLabel="Cancel"
                >
                    Cancel
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default LogFlowPage;
