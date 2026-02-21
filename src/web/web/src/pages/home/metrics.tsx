import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { borderRadius } from 'src/web/design-system/src/tokens/borderRadius';
import { shadows } from 'src/web/design-system/src/tokens/shadows';

import {
  MainLayout,
  useHealthMetrics,
  useAuth,
} from 'src/web/web/src/components/index';

/**
 * Filter options for the metrics view.
 */
const METRIC_FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'vitals', label: 'Sinais Vitais' },
  { id: 'activity', label: 'Atividade' },
  { id: 'nutrition', label: 'Nutricao' },
  { id: 'sleep', label: 'Sono' },
] as const;

/**
 * Sample metric card data for display when real metrics are available.
 */
const METRIC_CARDS = [
  {
    id: 'heart-rate',
    title: 'Frequencia Cardiaca',
    value: '72',
    unit: 'bpm',
    trend: 'stable' as const,
    category: 'vitals',
    color: colors.semantic.error,
    icon: '❤️',
  },
  {
    id: 'steps',
    title: 'Passos',
    value: '8,432',
    unit: 'passos',
    trend: 'up' as const,
    category: 'activity',
    color: colors.journeys.health.primary,
    icon: '🚶',
  },
  {
    id: 'sleep',
    title: 'Sono',
    value: '7.5',
    unit: 'horas',
    trend: 'up' as const,
    category: 'sleep',
    color: colors.journeys.plan.primary,
    icon: '😴',
  },
  {
    id: 'blood-pressure',
    title: 'Pressao Arterial',
    value: '120/80',
    unit: 'mmHg',
    trend: 'stable' as const,
    category: 'vitals',
    color: colors.semantic.info,
    icon: '🩺',
  },
  {
    id: 'calories',
    title: 'Calorias',
    value: '1,850',
    unit: 'kcal',
    trend: 'down' as const,
    category: 'nutrition',
    color: colors.journeys.care.primary,
    icon: '🔥',
  },
  {
    id: 'water',
    title: 'Agua',
    value: '6',
    unit: 'copos',
    trend: 'up' as const,
    category: 'nutrition',
    color: colors.brand.primary,
    icon: '💧',
  },
] as const;

/**
 * Weekly chart data points for the health trend chart.
 */
const WEEKLY_DATA = [
  { day: 'Seg', value: 65 },
  { day: 'Ter', value: 72 },
  { day: 'Qua', value: 68 },
  { day: 'Qui', value: 75 },
  { day: 'Sex', value: 70 },
  { day: 'Sab', value: 78 },
  { day: 'Dom', value: 72 },
];

/**
 * Metrics page showing expanded health metrics view with filters,
 * metric cards grid, and a weekly trend chart.
 */
const MetricsPage: React.FC = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { metrics } = useHealthMetrics('user-123', []);

  const filteredCards = activeFilter === 'all'
    ? METRIC_CARDS
    : METRIC_CARDS.filter((card) => card.category === activeFilter);

  const getTrendArrow = (trend: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return colors.semantic.success;
      case 'down': return colors.semantic.warning;
      default: return colors.neutral.gray600;
    }
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div style={pageStyles.header}>
        <div>
          <h1 style={pageStyles.pageTitle}>Minhas Metricas</h1>
          <p style={pageStyles.pageSubtitle}>
            Acompanhe seus indicadores de saude ao longo do tempo.
          </p>
        </div>
        <button
          style={pageStyles.addButton}
          onClick={() => router.push('/health/add-metric')}
        >
          + Adicionar Metrica
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={pageStyles.filterRow}>
        {METRIC_FILTERS.map((filter) => (
          <button
            key={filter.id}
            style={{
              ...pageStyles.filterButton,
              ...(activeFilter === filter.id ? pageStyles.filterButtonActive : {}),
            }}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Metric Cards Grid */}
      <div style={pageStyles.metricsGrid}>
        {filteredCards.map((card) => (
          <div key={card.id} style={pageStyles.metricCard}>
            <div style={pageStyles.metricCardHeader}>
              <span style={pageStyles.metricIcon}>{card.icon}</span>
              <span
                style={{
                  ...pageStyles.trendBadge,
                  color: getTrendColor(card.trend),
                  backgroundColor: `${getTrendColor(card.trend)}15`,
                }}
              >
                {getTrendArrow(card.trend)}
              </span>
            </div>
            <p style={pageStyles.metricTitle}>{card.title}</p>
            <div style={pageStyles.metricValueRow}>
              <span style={{ ...pageStyles.metricValue, color: card.color }}>
                {card.value}
              </span>
              <span style={pageStyles.metricUnit}>{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Trend Chart */}
      <section style={pageStyles.chartSection}>
        <h2 style={pageStyles.chartTitle}>Tendencia Semanal</h2>
        <div style={pageStyles.chartContainer}>
          <div style={pageStyles.chartBars}>
            {WEEKLY_DATA.map((data) => (
              <div key={data.day} style={pageStyles.chartBarColumn}>
                <div
                  style={{
                    ...pageStyles.chartBar,
                    height: `${data.value}%`,
                    backgroundColor: colors.brand.primary,
                  }}
                />
                <span style={pageStyles.chartLabel}>{data.day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

const pageStyles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['2xl'],
    padding: `${spacing.xl} 0`,
  },
  pageTitle: {
    fontSize: typography.fontSize['heading-xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray900,
    margin: 0,
    fontFamily: typography.fontFamily.heading,
  },
  pageSubtitle: {
    fontSize: typography.fontSize['text-md'],
    color: colors.neutral.gray600,
    margin: `${spacing.xs} 0 0 0`,
    fontFamily: typography.fontFamily.body,
  },
  addButton: {
    padding: `${spacing.sm} ${spacing.xl}`,
    backgroundColor: colors.brand.primary,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.semiBold,
    cursor: 'pointer',
    fontFamily: typography.fontFamily.body,
  },
  filterRow: {
    display: 'flex',
    gap: spacing.xs,
    marginBottom: spacing.xl,
    flexWrap: 'wrap' as const,
  },
  filterButton: {
    padding: `${spacing.xs} ${spacing.md}`,
    backgroundColor: colors.neutral.gray200,
    color: colors.neutral.gray700,
    border: 'none',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    fontFamily: typography.fontFamily.body,
    transition: 'all 0.2s ease',
  },
  filterButtonActive: {
    backgroundColor: colors.brand.primary,
    color: colors.neutral.white,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  metricCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    boxShadow: shadows.sm,
    transition: 'box-shadow 0.2s ease',
  },
  metricCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metricIcon: {
    fontSize: typography.fontSize['heading-xl'],
  },
  trendBadge: {
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.bold,
    padding: `${spacing['4xs']} ${spacing.xs}`,
    borderRadius: borderRadius.full,
  },
  metricTitle: {
    fontSize: typography.fontSize['text-sm'],
    color: colors.neutral.gray600,
    margin: `0 0 ${spacing.xs} 0`,
    fontFamily: typography.fontFamily.body,
  },
  metricValueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: spacing['3xs'],
  },
  metricValue: {
    fontSize: typography.fontSize['heading-xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.heading,
  },
  metricUnit: {
    fontSize: typography.fontSize['text-xs'],
    color: colors.neutral.gray500,
    fontFamily: typography.fontFamily.body,
  },
  chartSection: {
    marginBottom: spacing['2xl'],
  },
  chartTitle: {
    fontSize: typography.fontSize['heading-md'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.neutral.gray900,
    margin: `0 0 ${spacing.md} 0`,
    fontFamily: typography.fontFamily.heading,
  },
  chartContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    boxShadow: shadows.sm,
  },
  chartBars: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '200px',
    gap: spacing.sm,
  },
  chartBarColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    maxWidth: '40px',
    borderRadius: `${borderRadius.xs} ${borderRadius.xs} 0 0`,
    transition: 'height 0.3s ease',
  },
  chartLabel: {
    fontSize: typography.fontSize['text-xs'],
    color: colors.neutral.gray600,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.body,
  },
};

export default MetricsPage;
