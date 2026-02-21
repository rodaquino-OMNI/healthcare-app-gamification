import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { HomeHeader } from './HomeHeader';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { ROUTES } from '../../constants/routes';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MetricSummary {
  id: string;
  name: string;
  value: string;
  unit: string;
  trend: string;
  icon: string;
}

interface GoalProgress {
  id: string;
  title: string;
  percentage: number;
  completed: boolean;
}

interface JourneyCard {
  id: string;
  title: string;
  description: string;
  primaryColor: string;
  backgroundColor: string;
  route: string;
}

interface QuickAction {
  id: string;
  label: string;
  route: string;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const METRIC_SUMMARIES: MetricSummary[] = [
  { id: 'hr', name: 'Freq. Cardiaca', value: '72', unit: 'bpm', trend: 'Estavel', icon: '\u2764\uFE0F' },
  { id: 'steps', name: 'Passos', value: '8.432', unit: 'passos', trend: 'Subindo', icon: '\uD83D\uDEB6' },
  { id: 'sleep', name: 'Sono', value: '7.5', unit: 'h', trend: 'Subindo', icon: '\uD83C\uDF19' },
  { id: 'bp', name: 'Pressao', value: '120/80', unit: 'mmHg', trend: 'Estavel', icon: '\uD83E\uDE7A' },
];

const GOALS: GoalProgress[] = [
  { id: 'steps-goal', title: 'Passos Diarios', percentage: 84, completed: false },
  { id: 'meds-goal', title: 'Adesao Medicamentos', percentage: 100, completed: true },
];

const JOURNEYS: JourneyCard[] = [
  {
    id: 'health',
    title: 'Minha Saude',
    description: 'Acompanhe metricas de saude, metas e dispositivos conectados.',
    primaryColor: colors.journeys.health.primary,
    backgroundColor: colors.journeys.health.background,
    route: ROUTES.HEALTH_DASHBOARD,
  },
  {
    id: 'care',
    title: 'Cuidado Agora',
    description: 'Encontre profissionais, agende consultas e inicie telemedicina.',
    primaryColor: colors.journeys.care.primary,
    backgroundColor: colors.journeys.care.background,
    route: ROUTES.CARE_DASHBOARD,
  },
  {
    id: 'plan',
    title: 'Meu Plano',
    description: 'Veja cobertura, envie reembolsos e simule custos.',
    primaryColor: colors.journeys.plan.primary,
    backgroundColor: colors.journeys.plan.background,
    route: ROUTES.PLAN_DASHBOARD,
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'alerts', label: 'Alertas', route: 'HomeAlert' },
  { id: 'metrics', label: 'Metricas', route: 'HomeMetrics' },
  { id: 'profile', label: 'Perfil', route: ROUTES.PROFILE },
];

// ---------------------------------------------------------------------------
// Weekly chart bar heights (mock representation)
// ---------------------------------------------------------------------------

const WEEKLY_BARS = [
  { day: 'Seg', health: 0.6, care: 0.3, plan: 0.1 },
  { day: 'Ter', health: 0.8, care: 0.2, plan: 0.3 },
  { day: 'Qua', health: 0.5, care: 0.5, plan: 0.2 },
  { day: 'Qui', health: 0.9, care: 0.4, plan: 0.4 },
  { day: 'Sex', health: 0.7, care: 0.3, plan: 0.5 },
  { day: 'Sab', health: 0.4, care: 0.1, plan: 0.2 },
  { day: 'Dom', health: 0.3, care: 0.2, plan: 0.1 },
];

const CHART_MAX_HEIGHT = 80;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Home dashboard screen displaying a health metrics summary, chart preview,
 * goal progress, journey navigation cards, and quick action buttons.
 */
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { session, getUserFromToken } = useAuth();
  const { gameProfile } = useGamification();

  // Derive user info from auth token
  const user = session?.accessToken
    ? getUserFromToken(session.accessToken)
    : null;

  const userName = user?.name || 'Usuario';
  const userLevel = gameProfile?.level ?? 1;
  const userXP = gameProfile?.xp ?? 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <HomeHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Gamification badge */}
        <View style={styles.levelRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {userLevel}</Text>
            <Text style={styles.xpText}>{userXP} XP</Text>
          </View>
        </View>

        {/* ---- Health Metrics Summary (2x2 grid) ---- */}
        <Text style={styles.sectionTitle}>Resumo de Saude</Text>
        <View style={styles.metricsGrid}>
          {METRIC_SUMMARIES.map((metric) => (
            <TouchableOpacity
              key={metric.id}
              style={styles.metricCard}
              onPress={() =>
                navigation.navigate(ROUTES.HEALTH_METRIC_DETAIL as never, { metricId: metric.id } as never)
              }
              accessibilityRole="button"
              accessibilityLabel={`${metric.name}: ${metric.value} ${metric.unit}`}
            >
              <View style={styles.metricCardColorBar} />
              <View style={styles.metricCardContent}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={styles.metricName}>{metric.name}</Text>
                <View style={styles.metricValueRow}>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricUnit}> {metric.unit}</Text>
                </View>
                <Text style={styles.metricTrend}>{metric.trend}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ---- Chart Preview ---- */}
        <Text style={styles.sectionTitle}>Atividade Semanal</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartArea}>
            {WEEKLY_BARS.map((bar) => (
              <View key={bar.day} style={styles.chartColumn}>
                <View style={styles.chartBarContainer}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: bar.health * CHART_MAX_HEIGHT,
                        backgroundColor: colors.journeys.health.primary,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: bar.care * CHART_MAX_HEIGHT * 0.5,
                        backgroundColor: colors.journeys.care.primary,
                        marginTop: spacingValues['3xs'],
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: bar.plan * CHART_MAX_HEIGHT * 0.3,
                        backgroundColor: colors.journeys.plan.primary,
                        marginTop: spacingValues['3xs'],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartDayLabel}>{bar.day}</Text>
              </View>
            ))}
          </View>

          {/* Chart legend */}
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.journeys.health.primary }]} />
              <Text style={styles.legendText}>Saude</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.journeys.care.primary }]} />
              <Text style={styles.legendText}>Cuidado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.journeys.plan.primary }]} />
              <Text style={styles.legendText}>Plano</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.HEALTH_DASHBOARD as never)}
            accessibilityRole="link"
            accessibilityLabel="Ver detalhes da atividade semanal"
          >
            <Text style={styles.viewDetailsLink}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>

        {/* ---- Goals Progress ---- */}
        <Text style={styles.sectionTitle}>Progresso de Metas</Text>
        {GOALS.map((goal) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text
                style={[
                  styles.goalPercentage,
                  goal.completed && styles.goalPercentageCompleted,
                ]}
              >
                {goal.percentage}%
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${goal.percentage}%`,
                    backgroundColor: goal.completed
                      ? colors.semantic.success
                      : colors.journeys.health.primary,
                  },
                ]}
              />
            </View>
            {goal.completed && (
              <Text style={styles.goalCompletedText}>Concluido</Text>
            )}
          </View>
        ))}

        {/* ---- Journey Navigation Cards ---- */}
        <Text style={styles.sectionTitle}>Suas Jornadas</Text>
        {JOURNEYS.map((journey) => (
          <TouchableOpacity
            key={journey.id}
            style={styles.journeyCard}
            onPress={() => navigation.navigate(journey.route as never)}
            accessibilityRole="button"
            accessibilityLabel={`Navegar para ${journey.title}`}
          >
            <View
              style={[
                styles.journeyColorBar,
                { backgroundColor: journey.primaryColor },
              ]}
            />
            <View style={styles.journeyContent}>
              <Text style={styles.journeyTitle}>{journey.title}</Text>
              <Text style={styles.journeyDescription}>
                {journey.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* ---- Quick Actions ---- */}
        <Text style={styles.sectionTitle}>Acoes Rapidas</Text>
        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => navigation.navigate(action.route as never)}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Text style={styles.quickActionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  scrollContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },

  // Level badge
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: spacingValues.xs,
  },
  levelBadge: {
    backgroundColor: colors.gray[10],
    borderRadius: borderRadiusValues.lg,
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues['3xs'],
    alignItems: 'center',
  },
  levelText: {
    fontSize: fontSizeValues.sm,
    fontWeight: '700',
    color: colors.brand.primary,
  },
  xpText: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[50],
    marginTop: 1,
  },

  // Section title
  sectionTitle: {
    fontSize: fontSizeValues.lg,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginTop: spacingValues.md,
    marginBottom: spacingValues.sm,
  },

  // Metrics grid (2x2)
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadiusValues.md,
    marginBottom: spacingValues.sm,
    overflow: 'hidden',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
  },
  metricCardColorBar: {
    width: spacingValues['3xs'],
    backgroundColor: colors.journeys.health.primary,
  },
  metricCardContent: {
    flex: 1,
    padding: spacingValues.sm,
  },
  metricIcon: {
    fontSize: fontSizeValues.lg,
    marginBottom: spacingValues['3xs'],
  },
  metricName: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[50],
    marginBottom: spacingValues['3xs'],
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: fontSizeValues.xl,
    fontWeight: '700',
    color: colors.neutral.gray900,
  },
  metricUnit: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[50],
  },
  metricTrend: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[40],
    marginTop: spacingValues['3xs'],
  },

  // Chart preview
  chartCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadiusValues.md,
    padding: spacingValues.md,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: CHART_MAX_HEIGHT + spacingValues.xl,
    marginBottom: spacingValues.sm,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  chartBar: {
    width: spacingValues.sm,
    borderRadius: borderRadiusValues.xs,
  },
  chartDayLabel: {
    fontSize: 10,
    color: colors.gray[50],
    marginTop: spacingValues['3xs'],
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacingValues.md,
    marginBottom: spacingValues.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: spacingValues.xs,
    height: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
    marginRight: spacingValues['3xs'],
  },
  legendText: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[50],
  },
  viewDetailsLink: {
    fontSize: fontSizeValues.sm,
    fontWeight: '600',
    color: colors.journeys.health.primary,
    textAlign: 'center',
  },

  // Goals
  goalCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadiusValues.md,
    padding: spacingValues.md,
    marginBottom: spacingValues.sm,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.xs,
  },
  goalTitle: {
    fontSize: fontSizeValues.sm,
    fontWeight: '600',
    color: colors.neutral.gray900,
  },
  goalPercentage: {
    fontSize: fontSizeValues.sm,
    fontWeight: '700',
    color: colors.journeys.health.primary,
  },
  goalPercentageCompleted: {
    color: colors.semantic.success,
  },
  progressBarTrack: {
    height: spacingValues.xs,
    backgroundColor: colors.gray[10],
    borderRadius: borderRadiusValues.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadiusValues.full,
  },
  goalCompletedText: {
    fontSize: fontSizeValues.xs,
    color: colors.semantic.success,
    fontWeight: '500',
    marginTop: spacingValues['3xs'],
  },

  // Journey cards
  journeyCard: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadiusValues.md,
    marginBottom: spacingValues.sm,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  journeyColorBar: {
    width: spacingValues['2xs'],
  },
  journeyContent: {
    flex: 1,
    padding: spacingValues.md,
  },
  journeyTitle: {
    fontSize: fontSizeValues.md,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: spacingValues['3xs'],
  },
  journeyDescription: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    lineHeight: fontSizeValues.sm * 1.5,
  },

  // Quick actions
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.gray[5],
    borderRadius: borderRadiusValues.md,
    paddingVertical: spacingValues.sm,
    alignItems: 'center',
    marginHorizontal: spacingValues['3xs'],
  },
  quickActionText: {
    fontSize: fontSizeValues.sm,
    fontWeight: '600',
    color: colors.neutral.gray900,
  },
});

export default HomeScreen;
