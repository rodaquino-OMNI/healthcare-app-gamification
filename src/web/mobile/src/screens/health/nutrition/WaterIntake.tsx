import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * A water intake history entry.
 */
interface WaterEntry {
  id: string;
  time: string;
  glasses: number;
}

const MOCK_HISTORY: WaterEntry[] = [
  { id: '1', time: '08:00', glasses: 2 },
  { id: '2', time: '10:30', glasses: 1 },
  { id: '3', time: '12:15', glasses: 2 },
  { id: '4', time: '14:45', glasses: 1 },
  { id: '5', time: '16:30', glasses: 1 },
];

const DAILY_GOAL = 8;

/**
 * WaterIntake lets users track their daily water consumption with quick-add
 * glass buttons, a custom amount input, and a hydration streak display.
 */
export const WaterIntake: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const [currentIntake, setCurrentIntake] = useState(7);
  const [customAmount, setCustomAmount] = useState('');
  const [streak, setStreak] = useState(5);
  const [history, setHistory] = useState<WaterEntry[]>(MOCK_HISTORY);

  const fillPercent = useMemo(
    () => Math.min(currentIntake / DAILY_GOAL, 1),
    [currentIntake],
  );

  const handleAddGlasses = useCallback(
    (count: number) => {
      const newTotal = Math.min(currentIntake + count, DAILY_GOAL * 2);
      setCurrentIntake(newTotal);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setHistory((prev) => [
        { id: String(Date.now()), time: timeStr, glasses: count },
        ...prev.slice(0, 4),
      ]);
    },
    [currentIntake],
  );

  const handleAddCustom = useCallback(() => {
    const parsed = parseInt(customAmount, 10);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert(
        t('journeys.health.nutrition.water.invalidTitle'),
        t('journeys.health.nutrition.water.invalidMessage'),
      );
      return;
    }
    handleAddGlasses(parsed);
    setCustomAmount('');
  }, [customAmount, handleAddGlasses, t]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('common.buttons.back')}
          accessibilityRole="button"
          testID="back-button"
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.journeys.health.primary}
          />
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.nutrition.water.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="nutrition-water-scroll"
      >
        {/* Daily Goal Ring */}
        <Card journey="health" elevation="md" padding="md">
          <View style={styles.ringContainer} testID="nutrition-water-goal-ring">
            <View style={styles.ringOuter}>
              <View
                style={[
                  styles.ringFill,
                  {
                    height: `${Math.round(fillPercent * 100)}%`,
                    backgroundColor:
                      fillPercent >= 1
                        ? colors.semantic.success
                        : colors.journeys.health.primary,
                  },
                ]}
              />
              <View style={styles.ringCenter}>
                <Ionicons
                  name="water-outline"
                  size={28}
                  color={colors.journeys.health.primary}
                />
                <Text
                  fontSize="heading-2xl"
                  fontWeight="bold"
                  color={colors.journeys.health.primary}
                >
                  {currentIntake}/{DAILY_GOAL}
                </Text>
                <Text fontSize="sm" color={colors.gray[50]}>
                  {t('journeys.health.nutrition.water.glassesLabel')}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Quick-Add Glass Buttons */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.nutrition.water.quickAdd')}
          </Text>
          <View style={styles.quickAddRow}>
            {[1, 2, 3].map((count) => (
              <Touchable
                key={count}
                onPress={() => handleAddGlasses(count)}
                accessibilityLabel={t('journeys.health.nutrition.water.addGlasses', { count })}
                accessibilityRole="button"
                testID={`nutrition-water-add-${count}`}
                style={styles.quickAddCard}
              >
                <Card journey="health" elevation="sm" padding="md">
                  <View style={styles.quickAddContent}>
                    <Ionicons
                      name="water"
                      size={24}
                      color={colors.journeys.health.primary}
                    />
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color={colors.journeys.health.primary}
                    >
                      +{count}
                    </Text>
                    <Text fontSize="xs" color={colors.gray[50]}>
                      {count === 1
                        ? t('journeys.health.nutrition.water.glass')
                        : t('journeys.health.nutrition.water.glasses')}
                    </Text>
                  </View>
                </Card>
              </Touchable>
            ))}
          </View>
        </View>

        {/* Custom Amount Input */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.nutrition.water.customAmount')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <View style={styles.customInputRow}>
              <TextInput
                style={styles.customInput}
                value={customAmount}
                onChangeText={setCustomAmount}
                keyboardType="numeric"
                placeholder={t('journeys.health.nutrition.water.customPlaceholder')}
                placeholderTextColor={colors.gray[30]}
                accessibilityLabel={t('journeys.health.nutrition.water.customAmount')}
                testID="nutrition-water-custom-input"
              />
              <Text fontSize="sm" color={colors.gray[50]}>
                {t('journeys.health.nutrition.water.glassUnit')}
              </Text>
              <Button
                journey="health"
                onPress={handleAddCustom}
                accessibilityLabel={t('journeys.health.nutrition.water.add')}
                testID="nutrition-water-custom-add"
              >
                {t('journeys.health.nutrition.water.add')}
              </Button>
            </View>
          </Card>
        </View>

        {/* Hydration Streak */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.nutrition.water.streak')}
          </Text>
          <Card journey="health" elevation="sm" padding="md" testID="nutrition-water-streak">
            <View style={styles.streakRow}>
              <Ionicons name="flame" size={32} color={colors.semantic.warning} />
              <View style={styles.streakContent}>
                <Text
                  fontSize="heading-2xl"
                  fontWeight="bold"
                  color={colors.semantic.warning}
                >
                  {streak}
                </Text>
                <Text fontSize="sm" color={colors.gray[50]}>
                  {t('journeys.health.nutrition.water.streakDays')}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* History — last 5 entries */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.nutrition.water.history')}
          </Text>
          {history.map((entry) => (
            <Card key={entry.id} journey="health" elevation="sm" padding="md">
              <View style={styles.historyRow}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.gray[40]}
                />
                <Text fontSize="sm" color={colors.gray[60]}>
                  {entry.time}
                </Text>
                <View style={styles.historyGlasses}>
                  <Ionicons
                    name="water-outline"
                    size={16}
                    color={colors.journeys.health.primary}
                  />
                  <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.primary}
                  >
                    +{entry.glasses}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  ringContainer: {
    alignItems: 'center',
    paddingVertical: spacingValues.md,
  },
  ringOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: colors.journeys.health.secondary,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  ringFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.25,
  },
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingValues['4xs'],
  },
  sectionContainer: {
    marginTop: spacingValues.xl,
    gap: spacingValues.sm,
  },
  quickAddRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
  },
  quickAddCard: {
    flex: 1,
  },
  quickAddContent: {
    alignItems: 'center',
    gap: spacingValues['4xs'],
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
  },
  customInput: {
    flex: 1,
    fontSize: 16,
    color: colors.gray[70],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[20],
    paddingVertical: spacingValues.xs,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.md,
  },
  streakContent: {
    gap: spacingValues['4xs'],
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
  },
  historyGlasses: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues['4xs'],
    marginLeft: 'auto',
  },
});

export default WaterIntake;
