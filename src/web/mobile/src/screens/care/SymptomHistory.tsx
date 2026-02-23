import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { ROUTES } from '@constants/routes';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

interface PastCheck {
  id: string;
  date: string;
  timestamp: number;
  primarySymptom: string;
  symptomsCount: number;
  overallSeverity: number;
  topCondition: string;
  topConditionProbability: number;
}

const MOCK_PAST_CHECKS: PastCheck[] = [
  {
    id: 'check-1',
    date: '2026-02-20',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    primarySymptom: 'Headache',
    symptomsCount: 3,
    overallSeverity: 4,
    topCondition: 'Tension Headache',
    topConditionProbability: 72,
  },
  {
    id: 'check-2',
    date: '2026-02-18',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    primarySymptom: 'Sore Throat',
    symptomsCount: 4,
    overallSeverity: 5,
    topCondition: 'Common Cold',
    topConditionProbability: 68,
  },
  {
    id: 'check-3',
    date: '2026-02-10',
    timestamp: Date.now() - 11 * 24 * 60 * 60 * 1000,
    primarySymptom: 'Stomach Pain',
    symptomsCount: 2,
    overallSeverity: 6,
    topCondition: 'Gastroenteritis',
    topConditionProbability: 55,
  },
  {
    id: 'check-4',
    date: '2026-01-25',
    timestamp: Date.now() - 27 * 24 * 60 * 60 * 1000,
    primarySymptom: 'Back Pain',
    symptomsCount: 2,
    overallSeverity: 3,
    topCondition: 'Muscle Strain',
    topConditionProbability: 80,
  },
  {
    id: 'check-5',
    date: '2026-01-15',
    timestamp: Date.now() - 37 * 24 * 60 * 60 * 1000,
    primarySymptom: 'Chest Tightness',
    symptomsCount: 5,
    overallSeverity: 7,
    topCondition: 'Anxiety',
    topConditionProbability: 60,
  },
  {
    id: 'check-6',
    date: '2025-12-20',
    timestamp: Date.now() - 63 * 24 * 60 * 60 * 1000,
    primarySymptom: 'Cough',
    symptomsCount: 3,
    overallSeverity: 4,
    topCondition: 'Seasonal Allergies',
    topConditionProbability: 65,
  },
  {
    id: 'check-7',
    date: '2025-12-01',
    timestamp: Date.now() - 82 * 24 * 60 * 60 * 1000,
    primarySymptom: 'Fatigue',
    symptomsCount: 4,
    overallSeverity: 5,
    topCondition: 'Iron Deficiency',
    topConditionProbability: 45,
  },
  {
    id: 'check-8',
    date: '2025-11-10',
    timestamp: Date.now() - 103 * 24 * 60 * 60 * 1000,
    primarySymptom: 'Dizziness',
    symptomsCount: 2,
    overallSeverity: 3,
    topCondition: 'Low Blood Pressure',
    topConditionProbability: 50,
  },
];

type FilterOption = 'all' | '7d' | '30d' | '90d';

const FILTER_OPTIONS: { key: FilterOption; labelKey: string; days: number }[] = [
  { key: 'all', labelKey: 'journeys.care.symptomChecker.history.filterAll', days: Infinity },
  { key: '7d', labelKey: 'journeys.care.symptomChecker.history.filter7Days', days: 7 },
  { key: '30d', labelKey: 'journeys.care.symptomChecker.history.filter30Days', days: 30 },
  { key: '90d', labelKey: 'journeys.care.symptomChecker.history.filter90Days', days: 90 },
];

const getSeverityBadgeStatus = (
  severity: number,
): 'success' | 'warning' | 'error' => {
  if (severity <= 3) return 'success';
  if (severity <= 6) return 'warning';
  return 'error';
};

const getSeverityLabel = (severity: number): string => {
  if (severity <= 3) return 'Low';
  if (severity <= 6) return 'Moderate';
  return 'High';
};

/**
 * Timeline of past symptom checks.
 * Displays a filterable list of previous symptom check sessions.
 */
const SymptomHistory: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const filteredChecks = useMemo(() => {
    const option = FILTER_OPTIONS.find((o) => o.key === activeFilter);
    if (!option || option.days === Infinity) return MOCK_PAST_CHECKS;
    const cutoff = Date.now() - option.days * 24 * 60 * 60 * 1000;
    return MOCK_PAST_CHECKS.filter((check) => check.timestamp >= cutoff);
  }, [activeFilter]);

  const handleCheckPress = (checkId: string) => {
    navigation.navigate(ROUTES.CARE_SYMPTOM_HISTORY_DETAIL, { checkId });
  };

  const renderFilterTab = (option: typeof FILTER_OPTIONS[number]) => {
    const isActive = activeFilter === option.key;
    return (
      <Touchable
        key={option.key}
        onPress={() => setActiveFilter(option.key)}
        accessibilityLabel={t(option.labelKey)}
        accessibilityRole="button"
        testID={`filter-${option.key}`}
      >
        <View style={[styles.filterTab, isActive && styles.filterTabActive]}>
          <Text
            fontSize="text-sm"
            fontWeight={isActive ? 'semiBold' : 'regular'}
            color={isActive ? colors.neutral.white : colors.neutral.gray600}
          >
            {t(option.labelKey)}
          </Text>
        </View>
      </Touchable>
    );
  };

  const renderCheckItem = ({ item, index }: { item: PastCheck; index: number }) => (
    <Touchable
      onPress={() => handleCheckPress(item.id)}
      accessibilityLabel={`${t('journeys.care.symptomChecker.history.checkFrom')} ${item.date}: ${item.primarySymptom}`}
      accessibilityRole="button"
      testID={`history-item-${index}`}
    >
      <Card journey="care" elevation="sm">
        <View style={styles.checkHeader}>
          <Text
            fontSize="text-sm"
            color={colors.neutral.gray600}
            testID={`check-date-${index}`}
          >
            {item.date}
          </Text>
          <Badge
            variant="status"
            status={getSeverityBadgeStatus(item.overallSeverity)}
            testID={`check-severity-${index}`}
            accessibilityLabel={`${t('journeys.care.symptomChecker.history.severity')}: ${getSeverityLabel(item.overallSeverity)}`}
          >
            {getSeverityLabel(item.overallSeverity)}
          </Badge>
        </View>

        <Text
          fontSize="heading-md"
          fontWeight="semiBold"
          journey="care"
          testID={`check-symptom-${index}`}
        >
          {item.primarySymptom}
        </Text>

        <Text
          fontSize="text-sm"
          color={colors.neutral.gray600}
        >
          {item.symptomsCount} {t('journeys.care.symptomChecker.history.symptomsReported')}
        </Text>

        <View style={styles.conditionRow}>
          <Text fontSize="text-sm" color={colors.neutral.gray600}>
            {t('journeys.care.symptomChecker.history.topCondition')}:
          </Text>
          <Text
            fontSize="text-sm"
            fontWeight="semiBold"
            color={colors.journeys.care.primary}
          >
            {item.topCondition} ({item.topConditionProbability}%)
          </Text>
        </View>
      </Card>
    </Touchable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="body" fontWeight="semiBold" journey="care" testID="empty-state-title">
        {t('journeys.care.symptomChecker.history.emptyTitle')}
      </Text>
      <Text variant="body" color={colors.neutral.gray600} testID="empty-state-message">
        {t('journeys.care.symptomChecker.history.emptyMessage')}
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <Text
        variant="heading"
        journey="care"
        testID="history-title"
        style={styles.title}
      >
        {t('journeys.care.symptomChecker.history.title')}
      </Text>

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        {FILTER_OPTIONS.map(renderFilterTab)}
      </View>

      <FlatList
        data={filteredChecks}
        renderItem={renderCheckItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        testID="history-list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  title: {
    paddingHorizontal: spacingValues.md,
    paddingTop: spacingValues.md,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    gap: spacingValues.xs,
  },
  filterTab: {
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues['2xs'],
    borderRadius: spacingValues.md,
    backgroundColor: colors.neutral.gray200,
  },
  filterTabActive: {
    backgroundColor: colors.journeys.care.primary,
  },
  listContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
    gap: spacingValues.sm,
  },
  checkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues['3xs'],
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues['3xs'],
    marginTop: spacingValues['3xs'],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacingValues['5xl'],
    gap: spacingValues.xs,
  },
});

export { SymptomHistory };
export default SymptomHistory;
