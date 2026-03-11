import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState, useMemo } from 'react';

import { useSleep } from '@/hooks';

type ExportFormat = 'pdf' | 'csv';

const FORMAT_OPTIONS: Array<{ id: ExportFormat; label: string; description: string }> = [
    { id: 'pdf', label: 'PDF Report', description: 'Formatted report for sharing with doctors' },
    { id: 'csv', label: 'CSV Data', description: 'Raw data for analysis in spreadsheets' },
];

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.xs,
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: colors.gray[60],
};

const ExportSleepPage: React.FC = () => {
    const { data: sleepData, loading, error, refetch } = useSleep();
    const router = useRouter();
    const [format, setFormat] = useState<ExportFormat>('pdf');
    const [startDate, setStartDate] = useState('2025-12-01');
    const [endDate, setEndDate] = useState('2026-02-23');

    const nightCount = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        return diff;
    }, [startDate, endDate]);

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

    void sleepData;

    const handleGenerate = (): void => {
        window.alert(`Generating ${format.toUpperCase()} report: ${nightCount} nights from ${startDate} to ${endDate}`);
    };

    const handleShare = (): void => {
        window.alert('Share dialog opened');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/sleep')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to sleep home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Export Sleep Data
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Export your sleep data for personal use or to share with your doctor
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Date Range
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <Box display="flex" style={{ gap: spacing.md }}>
                    <Box style={{ flex: 1 }}>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                            From
                        </Text>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            aria-label="Start date"
                            style={inputStyle}
                        />
                    </Box>
                    <Box style={{ flex: 1 }}>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                            To
                        </Text>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            aria-label="End date"
                            style={inputStyle}
                        />
                    </Box>
                </Box>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Format
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
                {FORMAT_OPTIONS.map((opt) => (
                    <div
                        key={opt.id}
                        onClick={() => setFormat(opt.id)}
                        role="radio"
                        aria-checked={format === opt.id}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setFormat(opt.id);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
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
                                    {format === opt.id && (
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
                                <Box>
                                    <Text fontWeight="semiBold" fontSize="md">
                                        {opt.label}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {opt.description}
                                    </Text>
                                </Box>
                            </Box>
                        </Card>
                    </div>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Preview
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing['2xl'] }}>
                <Box display="flex" justifyContent="space-between">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Total Nights
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold">
                        {nightCount}
                    </Text>
                </Box>
                <div style={{ height: 1, backgroundColor: colors.gray[10], margin: `${spacing.xs} 0` }} />
                <Box display="flex" justifyContent="space-between">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Date Range
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold">
                        {startDate} to {endDate}
                    </Text>
                </Box>
                <div style={{ height: 1, backgroundColor: colors.gray[10], margin: `${spacing.xs} 0` }} />
                <Box display="flex" justifyContent="space-between">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Format
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold">
                        {format.toUpperCase()}
                    </Text>
                </Box>
            </Card>

            <Box display="flex" style={{ gap: spacing.sm }}>
                <Box style={{ flex: 1 }}>
                    <Button journey="health" onPress={handleGenerate} accessibilityLabel="Generate report">
                        Generate Report
                    </Button>
                </Box>
                <Box style={{ flex: 1 }}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleShare}
                        accessibilityLabel="Share report"
                    >
                        Share
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default ExportSleepPage;
