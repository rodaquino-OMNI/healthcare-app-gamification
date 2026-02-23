import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { borderRadius } from '@design-system/tokens/borderRadius';
import { sizing } from '@design-system/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border.default};
`;

const BackButton = styled.TouchableOpacity`
  width: ${sizing.component.sm};
  height: ${sizing.component.sm};
  align-items: center;
  justify-content: center;
`;

const BackText = styled.Text`
  font-size: ${typography.fontSize['text-xl']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const HeaderTitle = styled.Text`
  flex: 1;
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  text-align: center;
`;

const HeaderSpacer = styled.View`
  width: ${sizing.component.sm};
`;

const DateRangeContainer = styled.View`
  align-items: center;
  padding-vertical: ${spacing.md};
  padding-horizontal: ${spacing.xl};
`;

const DateRangeText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const MetricsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-horizontal: ${spacing.md};
  padding-top: ${spacing.sm};
`;

const MetricCard = styled.View`
  width: 48%;
  margin-bottom: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.muted};
  shadow-color: ${colors.neutral.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 4px;
  elevation: 2;
`;

const MetricIconRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.sm};
`;

const MetricIcon = styled.Text`
  font-size: ${typography.fontSize['heading-xl']};
`;

const TrendBadge = styled.View<{ bgColor: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.bgColor};
  padding-horizontal: ${spacing.xs};
  padding-vertical: ${spacing['4xs']};
  border-radius: ${borderRadius.full};
`;

const TrendText = styled.Text<{ textColor: string }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.bold};
  color: ${(props) => props.textColor};
`;

const MetricName = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: ${spacing['3xs']};
`;

const MetricValue = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const MetricUnit = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.subtle};
  margin-top: ${spacing['4xs']};
`;

const SectionTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  padding-horizontal: ${spacing.md};
  margin-top: ${spacing.xl};
  margin-bottom: ${spacing.sm};
`;

const InsightCard = styled.View`
  margin-horizontal: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.muted};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-bottom: ${spacing.sm};
`;

const InsightText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.default};
  line-height: 20px;
`;

const InsightLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.brand.primary};
  margin-bottom: ${spacing['3xs']};
`;

// --- Types ---

type TrendDirection = 'up' | 'down' | 'stable';

interface WeeklyMetric {
  id: string;
  icon: string;
  nameKey: string;
  value: string;
  unit: string;
  trend: TrendDirection;
  trendValue: string;
}

// --- Mock Data ---

const MOCK_METRICS: WeeklyMetric[] = [
  {
    id: 'steps',
    icon: '\uD83D\uDEB6',
    nameKey: 'home.weeklySummary.steps',
    value: '45,230',
    unit: 'steps',
    trend: 'up',
    trendValue: '+12%',
  },
  {
    id: 'calories',
    icon: '\uD83D\uDD25',
    nameKey: 'home.weeklySummary.calories',
    value: '12,450',
    unit: 'kcal',
    trend: 'down',
    trendValue: '-3%',
  },
  {
    id: 'sleep',
    icon: '\uD83C\uDF19',
    nameKey: 'home.weeklySummary.sleep',
    value: '7.2',
    unit: 'h avg',
    trend: 'stable',
    trendValue: '0%',
  },
  {
    id: 'heart',
    icon: '\u2764\uFE0F',
    nameKey: 'home.weeklySummary.heartRate',
    value: '72',
    unit: 'bpm avg',
    trend: 'stable',
    trendValue: '0%',
  },
];

const MOCK_INSIGHTS = [
  {
    id: 'insight-1',
    labelKey: 'home.weeklySummary.insightActivity',
    textKey: 'home.weeklySummary.insightActivityText',
  },
  {
    id: 'insight-2',
    labelKey: 'home.weeklySummary.insightSleep',
    textKey: 'home.weeklySummary.insightSleepText',
  },
];

// --- Helpers ---

const getTrendColor = (trend: TrendDirection): string => {
  switch (trend) {
    case 'up':
      return colors.semantic.success;
    case 'down':
      return colors.semantic.error;
    case 'stable':
      return colors.gray[50];
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

// --- Component ---

export const WeeklySummaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Container>
      <Header>
        <BackButton
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          testID="weekly-summary-back"
        >
          <BackText>{'\u003C'}</BackText>
        </BackButton>
        <HeaderTitle
          accessibilityRole="header"
          testID="weekly-summary-title"
        >
          {t('home.weeklySummary.title')}
        </HeaderTitle>
        <HeaderSpacer />
      </Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <DateRangeContainer>
          <DateRangeText testID="weekly-summary-date-range">
            {t('home.weeklySummary.dateRange', {
              start: 'Feb 14',
              end: 'Feb 21',
            })}
          </DateRangeText>
        </DateRangeContainer>

        <MetricsGrid>
          {MOCK_METRICS.map((metric, index) => {
            const trendColor = getTrendColor(metric.trend);
            const arrow = getTrendArrow(metric.trend);
            return (
              <MetricCard
                key={metric.id}
                style={index % 2 === 0 ? { marginRight: '4%' } : undefined}
                testID={`weekly-metric-${metric.id}`}
              >
                <MetricIconRow>
                  <MetricIcon accessibilityElementsHidden>
                    {metric.icon}
                  </MetricIcon>
                  <TrendBadge bgColor={`${trendColor}15`}>
                    <TrendText textColor={trendColor}>
                      {arrow} {metric.trendValue}
                    </TrendText>
                  </TrendBadge>
                </MetricIconRow>
                <MetricName>{t(metric.nameKey)}</MetricName>
                <MetricValue>{metric.value}</MetricValue>
                <MetricUnit>{metric.unit}</MetricUnit>
              </MetricCard>
            );
          })}
        </MetricsGrid>

        <SectionTitle testID="weekly-insights-title">
          {t('home.weeklySummary.insights')}
        </SectionTitle>

        {MOCK_INSIGHTS.map((insight) => (
          <InsightCard key={insight.id} testID={`weekly-insight-${insight.id}`}>
            <InsightLabel>{t(insight.labelKey)}</InsightLabel>
            <InsightText>{t(insight.textKey)}</InsightText>
          </InsightCard>
        ))}
      </ScrollView>
    </Container>
  );
};

export default WeeklySummaryScreen;
