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
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';

import { HomeHeader } from './HomeHeader';
import { ChartPreview, GoalsSection, JourneysSection } from './HomeWidgets';
import { QuickActions } from './HomeQuickActions';
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

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHART_MAX_HEIGHT = 80;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Home dashboard screen displaying a health metrics summary, chart preview,
 * goal progress, journey navigation cards, and quick action buttons.
 */
const HomeScreen: React.FC = () => {
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { session, getUserFromToken } = useAuth();
  const { gameProfile } = useGamification();

  // Derive user info from auth token
  const user = session?.accessToken
    ? getUserFromToken(session.accessToken)
    : null;

  const userName = user?.name || t('homeWidgets.defaultUser');

  const METRIC_SUMMARIES_LOCAL: MetricSummary[] = [
    { id: 'hr', name: t('homeWidgets.weeklySummary.heartRate'), value: '72', unit: 'bpm', trend: t('homeWidgets.weeklySummary.stable'), icon: '\u2764\uFE0F' },
    { id: 'steps', name: t('homeWidgets.weeklySummary.steps'), value: '8.432', unit: t('homeWidgets.weeklySummary.stepsUnit'), trend: t('homeWidgets.weeklySummary.rising'), icon: '\uD83D\uDEB6' },
    { id: 'sleep', name: t('homeWidgets.weeklySummary.sleep'), value: '7.5', unit: 'h', trend: t('homeWidgets.weeklySummary.rising'), icon: '\uD83C\uDF19' },
    { id: 'bp', name: t('homeWidgets.weeklySummary.bloodPressure'), value: '120/80', unit: 'mmHg', trend: t('homeWidgets.weeklySummary.stable'), icon: '\uD83E\uDE7A' },
  ];

  const GOALS_LOCAL = [
    { id: 'steps-goal', title: t('homeWidgets.weeklySummary.dailySteps'), percentage: 84, completed: false },
    { id: 'meds-goal', title: t('homeWidgets.medicationReminders.adherence'), percentage: 100, completed: true },
  ];

  const JOURNEYS_LOCAL = [
    {
      id: 'health',
      title: t('homeWidgets.bottomSheet.myHealth'),
      description: t('homeWidgets.bottomSheet.myHealthDesc'),
      primaryColor: colors.journeys.health.primary,
      backgroundColor: colors.journeys.health.background,
      route: ROUTES.HEALTH_DASHBOARD,
    },
    {
      id: 'care',
      title: t('homeWidgets.bottomSheet.careNow'),
      description: t('homeWidgets.bottomSheet.careNowDesc'),
      primaryColor: colors.journeys.care.primary,
      backgroundColor: colors.journeys.care.background,
      route: ROUTES.CARE_DASHBOARD,
    },
    {
      id: 'plan',
      title: t('homeWidgets.bottomSheet.myPlan'),
      description: t('homeWidgets.bottomSheet.myPlanDesc'),
      primaryColor: colors.journeys.plan.primary,
      backgroundColor: colors.journeys.plan.background,
      route: ROUTES.PLAN_DASHBOARD,
    },
  ];

  const QUICK_ACTIONS_LOCAL = [
    { id: 'alerts', label: t('homeWidgets.quickActions.alerts'), route: 'HomeAlert' },
    { id: 'metrics', label: t('homeWidgets.quickActions.metrics'), route: 'HomeMetrics' },
    { id: 'profile', label: t('homeWidgets.quickActions.profile'), route: ROUTES.PROFILE },
  ];

  const WEEKLY_BARS_LOCAL = [
    { day: t('homeWidgets.weeklySummary.mon'), health: 0.6, care: 0.3, plan: 0.1 },
    { day: t('homeWidgets.weeklySummary.tue'), health: 0.8, care: 0.2, plan: 0.3 },
    { day: t('homeWidgets.weeklySummary.wed'), health: 0.5, care: 0.5, plan: 0.2 },
    { day: t('homeWidgets.weeklySummary.thu'), health: 0.9, care: 0.4, plan: 0.4 },
    { day: t('homeWidgets.weeklySummary.fri'), health: 0.7, care: 0.3, plan: 0.5 },
    { day: t('homeWidgets.weeklySummary.sat'), health: 0.4, care: 0.1, plan: 0.2 },
    { day: t('homeWidgets.weeklySummary.sun'), health: 0.3, care: 0.2, plan: 0.1 },
  ];

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
            <Text style={styles.levelText}>{t('homeWidgets.level', { level: userLevel })}</Text>
            <Text style={styles.xpText}>{userXP} XP</Text>
          </View>
        </View>

        {/* ---- Health Metrics Summary (2x2 grid) ---- */}
        <Text style={styles.sectionTitle}>{t('homeWidgets.weeklySummary.title')}</Text>
        <View style={styles.metricsGrid}>
          {METRIC_SUMMARIES_LOCAL.map((metric) => (
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
        <Text style={styles.sectionTitle}>{t('homeWidgets.weeklySummary.weeklyActivity')}</Text>
        <ChartPreview
          navigation={navigation}
          bars={WEEKLY_BARS_LOCAL}
          legendLabels={{
            health: t('homeWidgets.bottomSheet.myHealth'),
            care: t('homeWidgets.bottomSheet.careNow'),
            plan: t('homeWidgets.bottomSheet.myPlan'),
          }}
          viewDetailsLabel={t('homeWidgets.weeklySummary.viewDetails')}
          viewDetailsAccessibilityLabel={t('homeWidgets.weeklySummary.viewDetails')}
          healthDashboardRoute={ROUTES.HEALTH_DASHBOARD}
        />

        {/* ---- Goals Progress ---- */}
        <Text style={styles.sectionTitle}>{t('homeWidgets.weeklySummary.goalProgress')}</Text>
        <GoalsSection
          goals={GOALS_LOCAL}
          completedLabel={t('homeWidgets.weeklySummary.completed')}
        />

        {/* ---- Journey Navigation Cards ---- */}
        <Text style={styles.sectionTitle}>{t('homeWidgets.bottomSheet.yourJourneys')}</Text>
        <JourneysSection navigation={navigation} journeys={JOURNEYS_LOCAL} />

        {/* ---- Quick Actions ---- */}
        <Text style={styles.sectionTitle}>{t('homeWidgets.quickActions.title')}</Text>
        <QuickActions navigation={navigation} actions={QUICK_ACTIONS_LOCAL} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const createStyles = (theme: Theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
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
    backgroundColor: theme.colors.background.subtle,
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
    color: theme.colors.text.muted,
    marginTop: 1,
  },

  // Section title
  sectionTitle: {
    fontSize: fontSizeValues.lg,
    fontWeight: '600',
    color: theme.colors.text.default,
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
    backgroundColor: theme.colors.background.default,
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
    color: theme.colors.text.muted,
    marginBottom: spacingValues['3xs'],
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: fontSizeValues.xl,
    fontWeight: '700',
    color: theme.colors.text.default,
  },
  metricUnit: {
    fontSize: fontSizeValues.xs,
    color: theme.colors.text.muted,
  },
  metricTrend: {
    fontSize: fontSizeValues.xs,
    color: theme.colors.text.subtle,
    marginTop: spacingValues['3xs'],
  },
});

export default HomeScreen;
