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
 * A single macro definition.
 */
interface MacroConfig {
  id: 'carbs' | 'protein' | 'fat';
  labelKey: string;
  color: string;
  actual: number;
}

const MACROS: MacroConfig[] = [
  {
    id: 'carbs',
    labelKey: 'journeys.health.nutrition.goals.carbs',
    color: colors.semantic.info,
    actual: 220,
  },
  {
    id: 'protein',
    labelKey: 'journeys.health.nutrition.goals.protein',
    color: colors.semantic.success,
    actual: 85,
  },
  {
    id: 'fat',
    labelKey: 'journeys.health.nutrition.goals.fat',
    color: colors.semantic.warning,
    actual: 60,
  },
];

const DEFAULT_CALORIE_TARGET = '2000';
const DEFAULT_CARBS_PCT = 50;
const DEFAULT_PROTEIN_PCT = 25;
const DEFAULT_FAT_PCT = 25;

/**
 * DietaryGoals allows users to configure their calorie target, macronutrient
 * percentage split (Carbs / Protein / Fat), and compare actual vs goal values.
 */
export const DietaryGoals: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const [calorieTarget, setCalorieTarget] = useState(DEFAULT_CALORIE_TARGET);
  const [carbsPct, setCarbsPct] = useState(DEFAULT_CARBS_PCT);
  const [proteinPct, setProteinPct] = useState(DEFAULT_PROTEIN_PCT);
  const [fatPct, setFatPct] = useState(DEFAULT_FAT_PCT);

  const totalPct = useMemo(
    () => carbsPct + proteinPct + fatPct,
    [carbsPct, proteinPct, fatPct],
  );

  const adjust = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<number>>,
      current: number,
      delta: number,
    ) => {
      const next = current + delta;
      if (next < 5 || next > 90) return;
      setter(next);
    },
    [],
  );

  const handleSave = useCallback(() => {
    Alert.alert(
      t('journeys.health.nutrition.goals.savedTitle'),
      t('journeys.health.nutrition.goals.savedMessage'),
      [{ text: t('common.buttons.ok'), onPress: () => navigation.goBack() }],
    );
  }, [navigation, t]);

  const handleReset = useCallback(() => {
    setCalorieTarget(DEFAULT_CALORIE_TARGET);
    setCarbsPct(DEFAULT_CARBS_PCT);
    setProteinPct(DEFAULT_PROTEIN_PCT);
    setFatPct(DEFAULT_FAT_PCT);
  }, []);

  const macroState = useMemo(
    () => ({
      carbs: carbsPct,
      protein: proteinPct,
      fat: fatPct,
    }),
    [carbsPct, proteinPct, fatPct],
  );

  const macroSetters = useMemo(
    () => ({
      carbs: setCarbsPct,
      protein: setProteinPct,
      fat: setFatPct,
    }),
    [],
  );

  const macroTargetGrams = useCallback(
    (pct: number) => {
      const kcal = parseInt(calorieTarget, 10) || 0;
      return Math.round((kcal * pct) / 100 / 4);
    },
    [calorieTarget],
  );

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
          {t('journeys.health.nutrition.goals.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Calorie Target */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.nutrition.goals.calorieTarget')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <View style={styles.calorieRow}>
              <Ionicons
                name="flame-outline"
                size={22}
                color={colors.semantic.warning}
              />
              <TextInput
                style={styles.calorieInput}
                value={calorieTarget}
                onChangeText={setCalorieTarget}
                keyboardType="numeric"
                accessibilityLabel={t('journeys.health.nutrition.goals.calorieTarget')}
                testID="nutrition-goals-calories-input"
              />
              <Text fontSize="sm" color={colors.gray[50]}>
                {t('journeys.health.nutrition.goals.kcal')}
              </Text>
            </View>
          </Card>
        </View>

        {/* Macro Percentage Sliders */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.nutrition.goals.macros')}
          </Text>

          {MACROS.map((macro) => {
            const pct = macroState[macro.id];
            const setter = macroSetters[macro.id];
            return (
              <Card key={macro.id} journey="health" elevation="sm" padding="md">
                <View style={styles.macroRow}>
                  <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={macro.color}
                    style={styles.macroLabel}
                  >
                    {t(macro.labelKey)}
                  </Text>
                  <Touchable
                    onPress={() => adjust(setter, pct, -5)}
                    accessibilityLabel={t('journeys.health.nutrition.goals.decrease', { macro: t(macro.labelKey) })}
                    accessibilityRole="button"
                    testID={`nutrition-goals-${macro.id}-minus`}
                    style={styles.adjustButton}
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={28}
                      color={colors.journeys.health.primary}
                    />
                  </Touchable>
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    color={macro.color}
                    style={styles.pctText}
                  >
                    {pct}%
                  </Text>
                  <Touchable
                    onPress={() => adjust(setter, pct, 5)}
                    accessibilityLabel={t('journeys.health.nutrition.goals.increase', { macro: t(macro.labelKey) })}
                    accessibilityRole="button"
                    testID={`nutrition-goals-${macro.id}-plus`}
                    style={styles.adjustButton}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={28}
                      color={colors.journeys.health.primary}
                    />
                  </Touchable>
                </View>
                {/* Visual bar */}
                <View style={styles.macroBarBg}>
                  <View
                    style={[
                      styles.macroBarFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: macro.color,
                      },
                    ]}
                  />
                </View>
              </Card>
            );
          })}

          {/* Total display */}
          <Card journey="health" elevation="sm" padding="md">
            <View style={styles.totalRow}>
              <Text fontSize="sm" color={colors.gray[50]}>
                {t('journeys.health.nutrition.goals.total')}
              </Text>
              <Text
                fontSize="md"
                fontWeight="bold"
                color={
                  Math.abs(totalPct - 100) <= 5
                    ? colors.semantic.success
                    : colors.semantic.error
                }
              >
                {totalPct}%
              </Text>
            </View>
          </Card>
        </View>

        {/* Current vs Target Comparison */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.nutrition.goals.comparison')}
          </Text>
          {MACROS.map((macro) => {
            const pct = macroState[macro.id];
            const targetG = macroTargetGrams(pct);
            return (
              <Card key={macro.id} journey="health" elevation="sm" padding="md">
                <View style={styles.comparisonHeader}>
                  <View
                    style={[styles.macroDot, { backgroundColor: macro.color }]}
                  />
                  <Text fontSize="sm" fontWeight="semiBold">
                    {t(macro.labelKey)}
                  </Text>
                </View>
                <View style={styles.comparisonRow}>
                  <View style={styles.comparisonItem}>
                    <Text fontSize="xs" color={colors.gray[40]}>
                      {t('journeys.health.nutrition.goals.actual')}
                    </Text>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color={colors.gray[70]}
                    >
                      {macro.actual}g
                    </Text>
                  </View>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={colors.gray[30]}
                  />
                  <View style={styles.comparisonItem}>
                    <Text fontSize="xs" color={colors.gray[40]}>
                      {t('journeys.health.nutrition.goals.target')}
                    </Text>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color={macro.color}
                    >
                      {targetG}g
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            journey="health"
            onPress={handleSave}
            accessibilityLabel={t('journeys.health.nutrition.goals.save')}
            testID="nutrition-goals-save-button"
          >
            {t('journeys.health.nutrition.goals.save')}
          </Button>
          <View style={styles.buttonSpacer} />
          <Button
            variant="secondary"
            journey="health"
            onPress={handleReset}
            accessibilityLabel={t('journeys.health.nutrition.goals.reset')}
            testID="nutrition-goals-reset-button"
          >
            {t('journeys.health.nutrition.goals.reset')}
          </Button>
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
  sectionContainer: {
    marginTop: spacingValues.xl,
    gap: spacingValues.sm,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
  },
  calorieInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[70],
    borderBottomWidth: 2,
    borderBottomColor: colors.journeys.health.primary,
    paddingVertical: spacingValues['4xs'],
    textAlign: 'center',
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingValues.xs,
  },
  macroLabel: {
    flex: 1,
  },
  adjustButton: {
    padding: spacingValues['4xs'],
  },
  pctText: {
    minWidth: 48,
    textAlign: 'center',
  },
  macroBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[10],
    overflow: 'hidden',
  },
  macroBarFill: {
    height: 8,
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.xs,
    marginBottom: spacingValues.xs,
  },
  macroDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  comparisonItem: {
    alignItems: 'center',
    gap: spacingValues['4xs'],
  },
  actionsContainer: {
    marginTop: spacingValues['2xl'],
    marginBottom: spacingValues.xl,
  },
  buttonSpacer: {
    height: spacingValues.sm,
  },
});

export default DietaryGoals;
