import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState, useMemo } from 'react';

type TimeRange = 'daily' | 'weekly' | 'monthly';

interface ChartDataPoint {
    label: string;
    adherence: number;
}

const DAILY_DATA: ChartDataPoint[] = [
    { label: 'Mon', adherence: 100 },
    { label: 'Tue', adherence: 80 },
    { label: 'Wed', adherence: 100 },
    { label: 'Thu', adherence: 60 },
    { label: 'Fri', adherence: 100 },
    { label: 'Sat', adherence: 40 },
    { label: 'Sun', adherence: 80 },
];

const WEEKLY_DATA: ChartDataPoint[] = [
    { label: 'Week 1', adherence: 85 },
    { label: 'Week 2', adherence: 92 },
    { label: 'Week 3', adherence: 78 },
    { label: 'Week 4', adherence: 88 },
];

const MONTHLY_DATA: ChartDataPoint[] = [
    { label: 'Sep', adherence: 75 },
    { label: 'Oct', adherence: 82 },
    { label: 'Nov', adherence: 90 },
    { label: 'Dec', adherence: 88 },
    { label: 'Jan', adherence: 95 },
    { label: 'Feb', adherence: 85 },
];

const MAX_BAR_HEIGHT = 180;

const getBarColor = (adherence: number): string => {
    if (adherence >= 80) {
        return colors.semantic.success;
    }
    if (adherence >= 50) {
        return colors.semantic.warning;
    }
    return colors.semantic.error;
};

const tabs: { key: TimeRange; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
];

/**
 * Medication adherence chart page with daily/weekly/monthly tab views.
 * Displays bar chart visualization with overall adherence percentage.
 */
const MedicationAdherencePage: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TimeRange>('daily');

    const chartData = useMemo(() => {
        switch (activeTab) {
            case 'daily':
                return DAILY_DATA;
            case 'weekly':
                return WEEKLY_DATA;
            case 'monthly':
                return MONTHLY_DATA;
            default:
                return DAILY_DATA;
        }
    }, [activeTab]);

    const overallAdherence = useMemo(() => {
        if (chartData.length === 0) {
            return 0;
        }
        const sum = chartData.reduce((acc, d) => acc + d.adherence, 0);
        return Math.round(sum / chartData.length);
    }, [chartData]);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Medication Adherence
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Track how well you follow your medication schedule.
            </Text>

            {/* Overall Adherence */}
            <Card journey="health" elevation="md" padding="lg">
                <Text fontSize="sm" color={colors.gray[50]} style={{ textAlign: 'center' }}>
                    Overall Adherence
                </Text>
                <Text
                    fontSize="heading-2xl"
                    fontWeight="bold"
                    color={getBarColor(overallAdherence)}
                    style={{ textAlign: 'center' }}
                >
                    {overallAdherence}%
                </Text>
            </Card>

            {/* Tab Selector */}
            <div
                style={{
                    display: 'flex',
                    borderBottom: `1px solid ${colors.neutral.gray300}`,
                    marginTop: spacing.xl,
                    marginBottom: spacing.lg,
                }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            flex: 1,
                            padding: spacing.sm,
                            background: 'none',
                            border: 'none',
                            borderBottom:
                                activeTab === tab.key
                                    ? `2px solid ${colors.journeys.health.primary}`
                                    : '2px solid transparent',
                            color: activeTab === tab.key ? colors.journeys.health.primary : colors.neutral.gray600,
                            fontWeight: activeTab === tab.key ? 600 : 400,
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}
                        data-testid={`tab-${tab.key}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Bar Chart */}
            <Card journey="health" elevation="sm" padding="lg">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'flex-end',
                        height: MAX_BAR_HEIGHT + 60,
                    }}
                >
                    {chartData.map((item, index) => {
                        const barHeight = (item.adherence / 100) * MAX_BAR_HEIGHT;
                        return (
                            <div
                                key={`bar-${index}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    flex: 1,
                                }}
                                data-testid={`bar-${index}`}
                            >
                                <Text fontSize="xs" fontWeight="medium" color={colors.neutral.gray700}>
                                    {item.adherence}%
                                </Text>
                                <div
                                    style={{
                                        width: '32px',
                                        height: `${barHeight}px`,
                                        backgroundColor: getBarColor(item.adherence),
                                        borderRadius: '4px',
                                        margin: `${spacing.xs} 0`,
                                        minHeight: '4px',
                                    }}
                                />
                                <Text fontSize="xs" color={colors.neutral.gray600}>
                                    {item.label}
                                </Text>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Share Report Button */}
            <Box style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={() => alert('Share report feature coming soon')}
                    accessibilityLabel="Share adherence report"
                >
                    Share Report
                </Button>
            </Box>

            <Box style={{ marginTop: spacing.md }}>
                <Button variant="secondary" journey="health" onPress={() => router.back()} accessibilityLabel="Go back">
                    Back
                </Button>
            </Box>
        </div>
    );
};

export default MedicationAdherencePage;
