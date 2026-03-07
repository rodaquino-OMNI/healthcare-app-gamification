import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

type ExportFormat = 'pdf' | 'csv';

interface ContentOption {
    id: string;
    label: string;
}

const FORMAT_OPTIONS: Array<{ id: ExportFormat; label: string; description: string }> = [
    { id: 'pdf', label: 'PDF Report', description: 'Formatted report for sharing with doctors' },
    { id: 'csv', label: 'CSV Data', description: 'Raw data for analysis in spreadsheets' },
];

const CONTENT_OPTIONS: ContentOption[] = [
    { id: 'cycle_dates', label: 'Cycle Dates' },
    { id: 'symptoms', label: 'Symptoms Log' },
    { id: 'flow_data', label: 'Flow Intensity' },
    { id: 'mood', label: 'Mood Entries' },
    { id: 'fertility', label: 'Fertility Predictions' },
    { id: 'statistics', label: 'Statistics & Analysis' },
];

const ExportPage: React.FC = () => {
    const router = useRouter();
    const [format, setFormat] = useState<ExportFormat>('pdf');
    const [startDate, setStartDate] = useState('2025-09-01');
    const [endDate, setEndDate] = useState('2026-02-22');
    const [selectedContent, setSelectedContent] = useState<string[]>(['cycle_dates', 'symptoms', 'flow_data']);

    const toggleContent = (id: string) => {
        setSelectedContent((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
    };

    const selectedCount = useMemo(() => selectedContent.length, [selectedContent]);

    const handleGenerate = () => {
        window.alert(
            `Generating ${format.toUpperCase()} with ${selectedCount} data sections for ${startDate} to ${endDate}`
        );
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/cycle')}
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
                Export Report
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Export your cycle data in your preferred format
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
                            style={{
                                width: '100%',
                                padding: spacing.xs,
                                border: `1px solid ${colors.gray[20]}`,
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: colors.gray[60],
                            }}
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
                            style={{
                                width: '100%',
                                padding: spacing.xs,
                                border: `1px solid ${colors.gray[20]}`,
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: colors.gray[60],
                            }}
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
                Content
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
                {CONTENT_OPTIONS.map((opt) => (
                    <div
                        key={opt.id}
                        onClick={() => toggleContent(opt.id)}
                        role="checkbox"
                        aria-checked={selectedContent.includes(opt.id)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') toggleContent(opt.id);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                                <div
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: '4px',
                                        border: `2px solid ${colors.journeys.health.primary}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        backgroundColor: selectedContent.includes(opt.id)
                                            ? colors.journeys.health.primary
                                            : 'transparent',
                                    }}
                                >
                                    {selectedContent.includes(opt.id) && (
                                        <Text fontSize="xs" color={colors.gray[0]} fontWeight="bold">
                                            &#10003;
                                        </Text>
                                    )}
                                </div>
                                <Text fontSize="md">{opt.label}</Text>
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
                            if (e.key === 'Enter' || e.key === ' ') setFormat(opt.id);
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

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing['2xl'] }}>
                <Box display="flex" justifyContent="space-between">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Sections Selected
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold">
                        {selectedCount} of {CONTENT_OPTIONS.length}
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

            <Button journey="health" onPress={handleGenerate} accessibilityLabel="Generate export">
                Generate Report
            </Button>
        </div>
    );
};

export default ExportPage;
