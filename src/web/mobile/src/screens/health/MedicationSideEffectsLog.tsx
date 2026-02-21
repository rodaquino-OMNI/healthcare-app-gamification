import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

type SeverityLevel = 'mild' | 'moderate' | 'severe';

interface SideEffectEntry {
  id: string;
  date: string;
  effectName: string;
  severity: SeverityLevel;
  notes: string;
}

const SEVERITY_CONFIG: Record<
  SeverityLevel,
  { badgeStatus: 'info' | 'warning' | 'error'; label: string }
> = {
  mild: { badgeStatus: 'info', label: 'Mild' },
  moderate: { badgeStatus: 'warning', label: 'Moderate' },
  severe: { badgeStatus: 'error', label: 'Severe' },
};

const MOCK_SIDE_EFFECTS: SideEffectEntry[] = [
  {
    id: '1',
    date: '2026-02-20',
    effectName: 'Nausea',
    severity: 'mild',
    notes: 'Slight nausea after morning dose. Resolved within 30 minutes.',
  },
  {
    id: '2',
    date: '2026-02-18',
    effectName: 'Headache',
    severity: 'moderate',
    notes: 'Persistent headache lasting several hours after taking medication.',
  },
  {
    id: '3',
    date: '2026-02-15',
    effectName: 'Dizziness',
    severity: 'mild',
    notes: 'Brief dizziness when standing up quickly.',
  },
  {
    id: '4',
    date: '2026-02-10',
    effectName: 'Fatigue',
    severity: 'severe',
    notes: 'Extreme tiredness throughout the day. Unable to perform normal activities.',
  },
  {
    id: '5',
    date: '2026-02-05',
    effectName: 'Insomnia',
    severity: 'moderate',
    notes: 'Difficulty falling asleep. Stayed awake until 2 AM.',
  },
];

/**
 * MedicationSideEffectsLog displays a timeline of reported side effects
 * with severity badges, dates, and notes. Includes a FAB to add new entries.
 */
export const MedicationSideEffectsLog: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleAddSideEffect = useCallback(() => {
    navigation.navigate(ROUTES.HEALTH_MEDICATION_SIDE_EFFECT_FORM);
  }, [navigation]);

  const renderSideEffectItem = useCallback(
    ({ item }: ListRenderItemInfo<SideEffectEntry>) => {
      const config = SEVERITY_CONFIG[item.severity];
      return (
        <Card
          journey="health"
          elevation="sm"
          padding="md"
          style={styles.entryCard}
        >
          <View style={styles.entryHeader}>
            <Text fontSize="xs" color={colors.neutral.gray500}>
              {item.date}
            </Text>
            <Badge
              variant="status"
              status={config.badgeStatus}
              accessibilityLabel={`${t('medication.severity')}: ${config.label}`}
            >
              {config.label}
            </Badge>
          </View>
          <Text
            fontWeight="semiBold"
            fontSize="md"
            color={colors.neutral.gray800}
            style={styles.effectName}
          >
            {item.effectName}
          </Text>
          <Text
            fontSize="sm"
            color={colors.neutral.gray600}
            numberOfLines={3}
          >
            {item.notes}
          </Text>
        </Card>
      );
    },
    [t],
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Text
          fontSize="xl"
          color={colors.neutral.gray500}
          textAlign="center"
        >
          {t('medication.noSideEffects')}
        </Text>
        <Text
          fontSize="sm"
          color={colors.neutral.gray500}
          textAlign="center"
        >
          {t('medication.noSideEffectsHint')}
        </Text>
      </View>
    ),
    [t],
  );

  const keyExtractor = useCallback(
    (item: SideEffectEntry) => item.id,
    [],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('medication.goBack')}
          accessibilityRole="button"
          testID="back-button"
        >
          <Text fontSize="lg" color={colors.journeys.health.primary}>
            {t('medication.back')}
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {t('medication.sideEffectsLog')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Side Effects List */}
      <FlatList
        data={MOCK_SIDE_EFFECTS}
        renderItem={renderSideEffectItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        testID="side-effects-list"
      />

      {/* Floating Action Button */}
      <Touchable
        onPress={handleAddSideEffect}
        accessibilityLabel={t('medication.addSideEffect')}
        accessibilityRole="button"
        testID="fab-add-side-effect"
        style={styles.fab}
      >
        <Text
          fontSize="2xl"
          color={colors.neutral.white}
          textAlign="center"
        >
          +
        </Text>
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.journeys.health.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md,
    paddingTop: spacingValues['3xl'],
    paddingBottom: spacingValues.sm,
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['5xl'],
  },
  entryCard: {
    marginBottom: spacingValues.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.xs,
  },
  effectName: {
    marginBottom: spacingValues['3xs'],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingValues['5xl'],
    gap: spacingValues.xs,
  },
  fab: {
    position: 'absolute',
    bottom: spacingValues.xl,
    right: spacingValues.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.journeys.health.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default MedicationSideEffectsLog;
