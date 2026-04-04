import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useMedications } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface MedicationSummary {
    id: string;
    name: string;
    dosage: string;
    totalDoses: number;
    takenDoses: number;
    adherence: number;
}

interface DayStatus {
    day: number;
    taken: boolean;
}

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MOCK_MEDICATIONS: MedicationSummary[] = [
    { id: '1', name: 'Metformin', dosage: '500mg', totalDoses: 56, takenDoses: 52, adherence: 93 },
    { id: '2', name: 'Lisinopril', dosage: '10mg', totalDoses: 28, takenDoses: 25, adherence: 89 },
    { id: '3', name: 'Atorvastatin', dosage: '20mg', totalDoses: 28, takenDoses: 20, adherence: 71 },
];

const getDaysInMonth = (month: number, year: number): number => new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (month: number, year: number): number => new Date(year, month, 1).getDay();

const generateDayStatuses = (count: number): DayStatus[] =>
    Array.from({ length: count }, (_, i) => ({
        day: i + 1,
        taken: Math.random() > 0.15,
    }));

/**
 * Monthly medication adherence report page with summary, medication breakdown,
 * and daily calendar grid showing taken/missed doses.
 */
const MedicationMonthlyReportPage: React.FC = () => {
    const { t } = useTranslation();
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth());
    const [year, setYear] = useState(now.getFullYear());

    const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);
    const firstDay = useMemo(() => getFirstDayOfMonth(month, year), [month, year]);
    const dayStatuses = useMemo(() => generateDayStatuses(daysInMonth), [daysInMonth]);

    const summary = useMemo(() => {
        const totalDoses = MOCK_MEDICATIONS.reduce((s, m) => s + m.totalDoses, 0);
        const takenDoses = MOCK_MEDICATIONS.reduce((s, m) => s + m.takenDoses, 0);
        const missedDoses = totalDoses - takenDoses;
        const adherence = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
        return { totalDoses, takenDoses, missedDoses, adherence };
    }, []);

    const gridCells = useMemo(() => {
        const cells: (DayStatus | null)[] = [];
        for (let i = 0; i < firstDay; i++) {
            cells.push(null);
        }
        dayStatuses.forEach((ds) => cells.push(ds));
        return cells;
    }, [firstDay, dayStatuses]);

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>{t('common.loading')}</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    {t('common.error')} <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void medications;

    const handlePrevMonth = (): void => {
        if (month === 0) {
            setMonth(11);
            setYear((y) => y - 1);
        } else {
            setMonth((m) => m - 1);
        }
    };

    const handleNextMonth = (): void => {
        if (month === 11) {
            setMonth(0);
            setYear((y) => y + 1);
        } else {
            setMonth((m) => m + 1);
        }
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Monthly Report
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Your medication adherence summary.
            </Text>

            {/* Month Selector */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing.lg,
                }}
            >
                <button
                    onClick={handlePrevMonth}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        color: colors.journeys.health.primary,
                        cursor: 'pointer',
                    }}
                    data-testid="prev-month-button"
                >
                    {'<'}
                </button>
                <Text fontWeight="semiBold" fontSize="lg">
                    {MONTHS[month]} {year}
                </Text>
                <button
                    onClick={handleNextMonth}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        color: colors.journeys.health.primary,
                        cursor: 'pointer',
                    }}
                    data-testid="next-month-button"
                >
                    {'>'}
                </button>
            </div>

            {/* Summary Card */}
            <Card journey="health" elevation="md" padding="lg">
                <Text fontWeight="semiBold" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Summary
                </Text>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: spacing.md,
                        textAlign: 'center',
                    }}
                >
                    <Box>
                        <Text fontSize="heading-xl" fontWeight="bold" color={colors.journeys.health.primary}>
                            {summary.totalDoses}
                        </Text>
                        <Text fontSize="xs" color={colors.gray[50]}>
                            Total Doses
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize="heading-xl" fontWeight="bold" color={colors.semantic.success}>
                            {summary.takenDoses}
                        </Text>
                        <Text fontSize="xs" color={colors.gray[50]}>
                            Taken
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize="heading-xl" fontWeight="bold" color={colors.semantic.error}>
                            {summary.missedDoses}
                        </Text>
                        <Text fontSize="xs" color={colors.gray[50]}>
                            Missed
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize="heading-xl" fontWeight="bold" color={colors.journeys.health.primary}>
                            {summary.adherence}%
                        </Text>
                        <Text fontSize="xs" color={colors.gray[50]}>
                            Adherence
                        </Text>
                    </Box>
                </div>
            </Card>

            {/* Medication Breakdown */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.lg }}>
                <Text fontWeight="semiBold" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Medication Breakdown
                </Text>
                {MOCK_MEDICATIONS.map((med, idx) => (
                    <Box
                        key={med.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{
                            paddingBottom: spacing.sm,
                            paddingTop: idx > 0 ? spacing.sm : 0,
                            borderBottom:
                                idx < MOCK_MEDICATIONS.length - 1 ? `1px solid ${colors.neutral.gray200}` : 'none',
                        }}
                    >
                        <Box>
                            <Text fontWeight="medium" fontSize="sm">
                                {med.name}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {med.dosage} - {med.takenDoses}/{med.totalDoses} doses
                            </Text>
                        </Box>
                        <Badge
                            variant="status"
                            status={med.adherence >= 80 ? 'success' : med.adherence >= 50 ? 'warning' : 'error'}
                        >
                            {med.adherence}%
                        </Badge>
                    </Box>
                ))}
            </Card>

            {/* Daily Grid */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.lg }}>
                <Text fontWeight="semiBold" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Daily Overview
                </Text>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: spacing.xs,
                        textAlign: 'center',
                    }}
                >
                    {WEEKDAY_LABELS.map((label, i) => (
                        <Text key={`wk-${i}`} fontSize="xs" fontWeight="medium" color={colors.neutral.gray600}>
                            {label}
                        </Text>
                    ))}
                    {gridCells.map((cell, i) => (
                        <div
                            key={`cell-${i}`}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '32px',
                            }}
                        >
                            {cell ? (
                                <div
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        backgroundColor: cell.taken ? colors.semantic.success : colors.semantic.error,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: colors.neutral.white,
                                        fontSize: '11px',
                                    }}
                                    data-testid={`day-dot-${cell.day}`}
                                >
                                    {cell.day}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Actions */}
            <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing['2xl'] }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={() => alert('Export PDF coming soon')}
                    accessibilityLabel="Export PDF"
                >
                    Export PDF
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => alert('Share feature coming soon')}
                    accessibilityLabel="Share report"
                >
                    Share
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

export const getServerSideProps = () => ({ props: {} });

export default MedicationMonthlyReportPage;
