import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCycle } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PHASE_COLORS: Record<string, string> = {
    menstrual: colors.semantic.error,
    follicular: colors.journeys.health.primary,
    ovulation: colors.semantic.warning,
    luteal: colors.journeys.health.secondary,
};

const PHASE_LABELS: Record<string, string> = {
    menstrual: 'Menstrual',
    follicular: 'Follicular',
    ovulation: 'Ovulation',
    luteal: 'Luteal',
};

const NAV_LINKS = [
    { label: 'Today', href: '/health/cycle/today' },
    { label: 'Log Period', href: '/health/cycle/log-period' },
    { label: 'Fertility', href: '/health/cycle/fertility' },
    { label: 'History', href: '/health/cycle/history' },
    { label: 'Analysis', href: '/health/cycle/analysis' },
    { label: 'Settings', href: '/health/cycle/settings' },
];

const generateMonthDays = (year: number, month: number): { key: string; day: number; phase: string }[] => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay }, (_, i) => ({ key: `b-${i}`, day: 0, phase: '' }));
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const d = i + 1;
        let phase = '';
        if (d >= 1 && d <= 5) {
            phase = 'menstrual';
        } else if (d >= 6 && d <= 12) {
            phase = 'follicular';
        } else if (d >= 13 && d <= 15) {
            phase = 'ovulation';
        } else {
            phase = 'luteal';
        }
        return { key: `d-${d}`, day: d, phase };
    });
    return [...blanks, ...days];
};

const CycleHomePage: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { data: cycleData, loading, error, refetch } = useCycle();
    const today = new Date();
    const [month] = useState(today.getMonth());
    const [year] = useState(today.getFullYear());
    const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const calendarDays = useMemo(() => generateMonthDays(year, month), [year, month]);

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

    void cycleData;

    const currentPhase = 'luteal';

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Cycle Tracking
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Monitor your menstrual cycle and health patterns
            </Text>

            <Card journey="health" elevation="sm" padding="md">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ marginBottom: spacing.sm }}
                >
                    <Text fontWeight="semiBold" fontSize="lg">
                        {monthName}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <div
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: PHASE_COLORS[currentPhase],
                            }}
                        />
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {PHASE_LABELS[currentPhase]}
                        </Text>
                    </div>
                </Box>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: spacing['3xs'],
                        textAlign: 'center',
                    }}
                >
                    {DAY_LABELS.map((d) => (
                        <Text key={d} fontSize="xs" fontWeight="semiBold" color={colors.gray[40]}>
                            {d}
                        </Text>
                    ))}
                    {calendarDays.map((cell: { key: string; day: number; phase: string }) => (
                        <div
                            key={cell.key}
                            style={{
                                height: 36,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                backgroundColor: cell.phase ? `${PHASE_COLORS[cell.phase]}22` : 'transparent',
                            }}
                        >
                            {cell.day > 0 && (
                                <Text
                                    fontSize="sm"
                                    color={
                                        cell.day === today.getDate() ? colors.journeys.health.primary : colors.gray[60]
                                    }
                                    fontWeight={cell.day === today.getDate() ? 'bold' : 'regular'}
                                >
                                    {cell.day}
                                </Text>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing['2xl'], marginBottom: spacing.sm }}
            >
                Quick Stats
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Cycle Length
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        28 days
                    </Text>
                </Card>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Period Length
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        5 days
                    </Text>
                </Card>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Day of Cycle
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        Day 22
                    </Text>
                </Card>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        Next Period
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        6 days
                    </Text>
                </Card>
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing['2xl'], marginBottom: spacing.sm }}
            >
                Navigation
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.sm }}>
                {NAV_LINKS.map((link) => (
                    <Button
                        key={link.href}
                        variant="secondary"
                        journey="health"
                        onPress={() => void router.push(link.href)}
                        accessibilityLabel={link.label}
                    >
                        {link.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default CycleHomePage;
