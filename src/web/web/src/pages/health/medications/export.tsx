import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useMemo } from 'react';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

import { useMedications } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

/**
 * Export format type
 */
type ExportFormat = 'pdf' | 'csv' | 'print';

/**
 * Data scope type
 */
type DataScope = 'all' | 'active' | 'date_range';

/**
 * Format option definition
 */
interface FormatOption {
    id: ExportFormat;
    label: string;
    description: string;
}

/**
 * Scope option definition
 */
interface ScopeOption {
    id: DataScope;
    label: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
    {
        id: 'pdf',
        label: 'PDF Document',
        description: 'Best for printing and sharing with doctors',
    },
    {
        id: 'csv',
        label: 'CSV Spreadsheet',
        description: 'Best for data analysis and record-keeping',
    },
    {
        id: 'print',
        label: 'Print Directly',
        description: 'Send directly to your printer',
    },
];

const SCOPE_OPTIONS: ScopeOption[] = [
    { id: 'all', label: 'All Medications' },
    { id: 'active', label: 'Active Only' },
    { id: 'date_range', label: 'Date Range' },
];

/** Mock export summary */
const EXPORT_SUMMARY = {
    totalMedications: 6,
    activeMedications: 4,
    dateRange: '2025-09-01 - 2026-02-21',
};

/**
 * Export options page for medication data.
 * Mirrors the mobile MedicationExport screen.
 */
const ExportPage: React.FC = () => {
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
    const [selectedScope, setSelectedScope] = useState<DataScope>('all');

    const exportCount = useMemo(() => {
        switch (selectedScope) {
            case 'active':
                return EXPORT_SUMMARY.activeMedications;
            case 'all':
            case 'date_range':
            default:
                return EXPORT_SUMMARY.totalMedications;
        }
    }, [selectedScope]);

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

    void medications;

    const handleExport = (): void => {
        window.alert(`Exporting ${exportCount} medications as ${selectedFormat.toUpperCase()}`);
    };

    const handleShare = (): void => {
        window.alert('Share exported file feature coming soon.');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" style={{ alignItems: 'center', marginBottom: spacing.xl }}>
                <button
                    onClick={() => void router.push(WEB_HEALTH_ROUTES.MEDICATIONS)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.journeys.health.primary,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: 0,
                    }}
                >
                    Back
                </button>
            </Box>

            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Export Medications
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Export your medication list in your preferred format.
            </Text>

            {/* Export Format */}
            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Select Format
            </Text>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                    marginBottom: spacing.xl,
                }}
            >
                {FORMAT_OPTIONS.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => setSelectedFormat(option.id)}
                        role="radio"
                        aria-checked={selectedFormat === option.id}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setSelectedFormat(option.id);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                <div
                                    style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '50%',
                                        border: `2px solid ${colors.journeys.health.primary}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {selectedFormat === option.id && (
                                        <div
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: colors.journeys.health.primary,
                                            }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <Text fontWeight="semiBold" fontSize="md">
                                        {option.label}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {option.description}
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Data Scope */}
            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Data Scope
            </Text>
            <div
                style={{
                    display: 'flex',
                    borderRadius: '8px',
                    border: `1px solid ${colors.gray[20]}`,
                    overflow: 'hidden',
                    marginBottom: spacing.xl,
                }}
            >
                {SCOPE_OPTIONS.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setSelectedScope(option.id)}
                        style={{
                            flex: 1,
                            padding: `${spacing.sm} ${spacing.xs}`,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: selectedScope === option.id ? 600 : 400,
                            color: selectedScope === option.id ? colors.journeys.health.primary : colors.gray[50],
                            backgroundColor:
                                selectedScope === option.id ? colors.journeys.health.background : colors.gray[0],
                            transition: 'all 0.15s ease',
                        }}
                        aria-pressed={selectedScope === option.id}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Preview Summary */}
            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Export Preview
            </Text>
            <Card journey="health" elevation="sm" padding="md">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: `${spacing.xs} 0`,
                    }}
                >
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Medications
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold">
                        {exportCount}
                    </Text>
                </div>
                <div
                    style={{
                        height: '1px',
                        backgroundColor: colors.gray[10],
                    }}
                />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: `${spacing.xs} 0`,
                    }}
                >
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Format
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold">
                        {selectedFormat.toUpperCase()}
                    </Text>
                </div>
                <div
                    style={{
                        height: '1px',
                        backgroundColor: colors.gray[10],
                    }}
                />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: `${spacing.xs} 0`,
                    }}
                >
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Date Range
                    </Text>
                    <Text fontSize="sm" fontWeight="semiBold">
                        {EXPORT_SUMMARY.dateRange}
                    </Text>
                </div>
            </Card>

            {/* Action Buttons */}
            <Box
                display="flex"
                style={{
                    flexDirection: 'column',
                    gap: spacing.sm,
                    marginTop: spacing['2xl'],
                }}
            >
                <Button journey="health" onPress={handleExport} accessibilityLabel="Export medications">
                    Export
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={handleShare}
                    accessibilityLabel="Share exported file"
                >
                    Share
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default ExportPage;
