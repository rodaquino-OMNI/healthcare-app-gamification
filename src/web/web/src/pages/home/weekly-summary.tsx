import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/hooks/useAuth';

type TrendDirection = 'up' | 'down' | 'stable';

interface WeeklyMetric {
    id: string;
    icon: string;
    name: string;
    value: string;
    unit: string;
    trend: TrendDirection;
    trendValue: string;
}

const MOCK_METRICS: WeeklyMetric[] = [
    {
        id: 'steps',
        icon: '\uD83D\uDEB6',
        name: 'Passos',
        value: '45,230',
        unit: 'passos',
        trend: 'up',
        trendValue: '+12%',
    },
    {
        id: 'calories',
        icon: '\uD83D\uDD25',
        name: 'Calorias',
        value: '12,450',
        unit: 'kcal',
        trend: 'down',
        trendValue: '-3%',
    },
    {
        id: 'sleep',
        icon: '\uD83C\uDF19',
        name: 'Sono',
        value: '7.2',
        unit: 'h media',
        trend: 'stable',
        trendValue: '0%',
    },
    {
        id: 'heart',
        icon: '\u2764\uFE0F',
        name: 'Frequencia Cardiaca',
        value: '72',
        unit: 'bpm media',
        trend: 'stable',
        trendValue: '0%',
    },
];

const getTrendColor = (trend: TrendDirection): string => {
    switch (trend) {
        case 'up':
            return colors.semantic.success;
        case 'down':
            return colors.semantic.error;
        case 'stable':
            return colors.neutral.gray600;
    }
};

const getTrendArrow = (trend: TrendDirection): string => {
    switch (trend) {
        case 'up':
            return '\u2191';
        case 'down':
            return '\u2193';
        case 'stable':
            return '\u2192';
    }
};

const WeeklySummaryPage: React.FC = () => {
    const { t: _t } = useTranslation();
    const { isAuthenticated: _isAuthenticated } = useAuth();

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Resumo Semanal</h1>
            <p style={styles.dateRange}>14 Fev - 21 Fev 2026</p>

            <div style={styles.grid}>
                {MOCK_METRICS.map((metric) => {
                    const trendColor = getTrendColor(metric.trend);
                    return (
                        <div key={metric.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={styles.icon}>{metric.icon}</span>
                                <span
                                    style={{
                                        ...styles.trendBadge,
                                        color: trendColor,
                                        backgroundColor: `${trendColor}15`,
                                    }}
                                >
                                    {getTrendArrow(metric.trend)} {metric.trendValue}
                                </span>
                            </div>
                            <p style={styles.metricName}>{metric.name}</p>
                            <div style={styles.valueRow}>
                                <span style={styles.value}>{metric.value}</span>
                                <span style={styles.unit}>{metric.unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <section style={styles.insightSection}>
                <h2 style={styles.insightTitle}>Insights da Semana</h2>
                <div style={styles.insightCard}>
                    <p style={styles.insightLabel}>Atividade</p>
                    <p style={styles.insightText}>
                        Seus passos aumentaram 12% comparado a semana anterior. Continue assim!
                    </p>
                </div>
                <div style={styles.insightCard}>
                    <p style={styles.insightLabel}>Sono</p>
                    <p style={styles.insightText}>Sua media de sono esta estavel em 7.2h. Proximo da meta de 8h.</p>
                </div>
            </section>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: { maxWidth: '800px', margin: '0 auto', padding: spacing.xl },
    title: {
        fontSize: typography.fontSize['heading-xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.heading,
        margin: 0,
    },
    dateRange: {
        fontSize: typography.fontSize['text-sm'],
        color: colors.neutral.gray600,
        fontFamily: typography.fontFamily.body,
        margin: `${spacing.xs} 0 ${spacing.xl} 0`,
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.md, marginBottom: spacing['2xl'] },
    card: {
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    icon: { fontSize: typography.fontSize['heading-xl'] },
    trendBadge: {
        fontSize: typography.fontSize['text-xs'],
        fontWeight: typography.fontWeight.bold,
        padding: `${spacing['4xs']} ${spacing.xs}`,
        borderRadius: borderRadius.full,
    },
    metricName: {
        fontSize: typography.fontSize['text-sm'],
        color: colors.neutral.gray600,
        margin: `0 0 ${spacing['3xs']} 0`,
        fontFamily: typography.fontFamily.body,
    },
    valueRow: { display: 'flex', alignItems: 'baseline', gap: spacing['3xs'] },
    value: {
        fontSize: typography.fontSize['heading-xl'],
        fontWeight: typography.fontWeight.bold,
        fontFamily: typography.fontFamily.heading,
        color: colors.neutral.gray900,
    },
    unit: {
        fontSize: typography.fontSize['text-xs'],
        color: colors.neutral.gray500,
        fontFamily: typography.fontFamily.body,
    },
    insightSection: { marginTop: spacing.xl },
    insightTitle: {
        fontSize: typography.fontSize['heading-md'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.heading,
        margin: `0 0 ${spacing.md} 0`,
    },
    insightCard: {
        backgroundColor: colors.neutral.gray100,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    insightLabel: {
        fontSize: typography.fontSize['text-xs'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.brand.primary,
        margin: `0 0 ${spacing['3xs']} 0`,
    },
    insightText: {
        fontSize: typography.fontSize['text-sm'],
        color: colors.neutral.gray900,
        margin: 0,
        lineHeight: '20px',
    },
};

export const getServerSideProps = () => ({ props: {} });

export default WeeklySummaryPage;
