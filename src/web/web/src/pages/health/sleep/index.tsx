import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSleep } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const NAV_LINKS = [
    { label: 'Log Sleep', href: '/health/sleep/log' },
    { label: 'Quality', href: '/health/sleep/quality' },
    { label: 'Diary', href: '/health/sleep/diary' },
    { label: 'Trends', href: '/health/sleep/trends' },
    { label: 'Goals', href: '/health/sleep/goals' },
    { label: 'Bedtime Routine', href: '/health/sleep/bedtime-routine' },
    { label: 'Smart Alarm', href: '/health/sleep/smart-alarm' },
    { label: 'Insights', href: '/health/sleep/insights' },
    { label: 'Device Sync', href: '/health/sleep/device-sync' },
    { label: 'Export', href: '/health/sleep/export' },
];

const SleepHomePage: React.FC = () => {
    const { t } = useTranslation();
    const { data: sleepData, loading, error, refetch } = useSleep();
    const router = useRouter();

    const stats = sleepData
        ? [
              {
                  label: 'Sleep Score',
                  value: String(sleepData.find((m) => String(m.type) === 'sleep_score')?.value ?? '—'),
              },
              {
                  label: 'Hours Slept',
                  value: `${sleepData.find((m) => String(m.type) === 'sleep_duration')?.value ?? '—'}h`,
              },
              {
                  label: 'Sleep Quality',
                  value: String(sleepData.find((m) => String(m.type) === 'sleep_quality')?.value ?? '—'),
              },
              {
                  label: 'Streak',
                  value: `${sleepData.find((m) => String(m.type) === 'sleep_streak')?.value ?? '—'} days`,
              },
          ]
        : [];

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

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to health home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Sleep Management
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Track and improve your sleep patterns for better health
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Quick Stats
            </Text>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.sm,
                    marginBottom: spacing['2xl'],
                }}
            >
                {stats.map((stat) => (
                    <Card key={stat.label} journey="health" elevation="sm" padding="md">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {stat.label}
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                            {stat.value}
                        </Text>
                    </Card>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
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

export default SleepHomePage;
