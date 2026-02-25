import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Switch,
  StyleSheet,
  Alert,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../../constants/routes';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Cycle configuration values.
 */
interface CycleConfig {
  averageCycleLength: number;
  averagePeriodLength: number;
  lutealPhaseLength: number;
  birthControlEnabled: boolean;
  notificationsEnabled: boolean;
}

const MIN_CYCLE_LENGTH = 21;
const MAX_CYCLE_LENGTH = 45;
const MIN_PERIOD_LENGTH = 2;
const MAX_PERIOD_LENGTH = 10;
const MIN_LUTEAL_LENGTH = 10;
const MAX_LUTEAL_LENGTH = 16;

const DEFAULT_CONFIG: CycleConfig = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lutealPhaseLength: 14,
  birthControlEnabled: false,
  notificationsEnabled: true,
};

/**
 * CycleSettings allows users to configure their cycle tracking parameters,
 * birth control effects on predictions, data privacy, and notification preferences.
 */
export const CycleSettings: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [config, setConfig] = useState<CycleConfig>(DEFAULT_CONFIG);
  const [showLutealPhase, setShowLutealPhase] = useState(false);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const adjustValue = useCallback(
    (field: keyof CycleConfig, delta: number, min: number, max: number) => {
      setConfig((prev) => {
        const currentVal = prev[field] as number;
        const newVal = Math.max(min, Math.min(max, currentVal + delta));
        return { ...prev, [field]: newVal };
      });
    },
    [],
  );

  const handleBirthControlToggle = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      birthControlEnabled: !prev.birthControlEnabled,
    }));
  }, []);

  const handleNotificationsToggle = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  }, []);

  const handleToggleLuteal = useCallback(() => {
    setShowLutealPhase((prev) => !prev);
  }, []);

  const handleExportData = useCallback(() => {
    navigation.navigate(ROUTES.HEALTH_CYCLE_EXPORT_REPORT);
  }, [navigation]);

  const handleDeleteData = useCallback(() => {
    Alert.alert(
      t('journeys.health.cycle.settings.deleteTitle'),
      t('journeys.health.cycle.settings.deleteConfirm'),
      [
        {
          text: t('common.buttons.cancel'),
          style: 'cancel',
        },
        {
          text: t('journeys.health.cycle.settings.deleteAction'),
          style: 'destructive',
          onPress: () => {
            // Reset to defaults
            setConfig(DEFAULT_CONFIG);
          },
        },
      ],
    );
  }, [t]);

  const renderNumberInput = useCallback(
    (
      label: string,
      value: number,
      field: keyof CycleConfig,
      min: number,
      max: number,
      unit: string,
    ) => (
      <Card journey="health" elevation="sm" padding="md">
        <View style={styles.inputRow}>
          <View style={styles.inputLabel}>
            <Text fontSize="md" fontWeight="medium">
              {label}
            </Text>
            <Text fontSize="xs" color={colors.gray[40]}>
              {min}-{max} {unit}
            </Text>
          </View>
          <View style={styles.stepper}>
            <Touchable
              onPress={() => adjustValue(field, -1, min, max)}
              accessibilityLabel={t('journeys.health.cycle.settings.decrease', { field: label })}
              accessibilityRole="button"
              testID={`decrease-${field}`}
              style={[styles.stepButton, value <= min && styles.stepButtonDisabled] as any}
            >
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={value <= min ? colors.gray[30] : colors.journeys.health.primary}
              >
                -
              </Text>
            </Touchable>
            <View style={styles.valueDisplay}>
              <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                {value}
              </Text>
            </View>
            <Touchable
              onPress={() => adjustValue(field, 1, min, max)}
              accessibilityLabel={t('journeys.health.cycle.settings.increase', { field: label })}
              accessibilityRole="button"
              testID={`increase-${field}`}
              style={[styles.stepButton, value >= max && styles.stepButtonDisabled] as any}
            >
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={value >= max ? colors.gray[30] : colors.journeys.health.primary}
              >
                +
              </Text>
            </Touchable>
          </View>
        </View>
      </Card>
    ),
    [adjustValue, t],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={handleGoBack}
          accessibilityLabel={t('common.buttons.back')}
          accessibilityRole="button"
          testID="back-button"
        >
          <Text fontSize="lg" color={colors.journeys.health.primary}>
            {t('common.buttons.back')}
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.cycle.settings.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="cycle-settings-scroll"
      >
        {/* Cycle Configuration */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.settings.cycleConfig')}
          </Text>
          {renderNumberInput(
            t('journeys.health.cycle.settings.avgCycleLength'),
            config.averageCycleLength,
            'averageCycleLength',
            MIN_CYCLE_LENGTH,
            MAX_CYCLE_LENGTH,
            t('journeys.health.cycle.settings.days'),
          )}
          {renderNumberInput(
            t('journeys.health.cycle.settings.avgPeriodLength'),
            config.averagePeriodLength,
            'averagePeriodLength',
            MIN_PERIOD_LENGTH,
            MAX_PERIOD_LENGTH,
            t('journeys.health.cycle.settings.days'),
          )}

          {/* Advanced: Luteal Phase */}
          <Touchable
            onPress={handleToggleLuteal}
            accessibilityLabel={t('journeys.health.cycle.settings.advancedOptions')}
            accessibilityRole="button"
            testID="toggle-luteal-section"
          >
            <Text fontSize="sm" color={colors.journeys.health.secondary} fontWeight="medium">
              {showLutealPhase
                ? t('journeys.health.cycle.settings.hideAdvanced')
                : t('journeys.health.cycle.settings.showAdvanced')}
            </Text>
          </Touchable>

          {showLutealPhase &&
            renderNumberInput(
              t('journeys.health.cycle.settings.lutealPhase'),
              config.lutealPhaseLength,
              'lutealPhaseLength',
              MIN_LUTEAL_LENGTH,
              MAX_LUTEAL_LENGTH,
              t('journeys.health.cycle.settings.days'),
            )}
        </View>

        {/* Birth Control */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.settings.birthControl')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabel}>
                <Text fontSize="md" fontWeight="medium">
                  {t('journeys.health.cycle.settings.usingBirthControl')}
                </Text>
                <Text fontSize="sm" color={colors.gray[50]}>
                  {t('journeys.health.cycle.settings.birthControlDesc')}
                </Text>
              </View>
              <Switch
                value={config.birthControlEnabled}
                onValueChange={handleBirthControlToggle}
                trackColor={{
                  false: colors.gray[20],
                  true: colors.journeys.health.primary,
                }}
                thumbColor={colors.gray[0]}
                accessibilityLabel={t('journeys.health.cycle.settings.usingBirthControl')}
                testID="birth-control-toggle"
              />
            </View>
          </Card>
        </View>

        {/* Notifications */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.settings.notifications')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <View style={styles.toggleRow}>
              <Text fontSize="md" fontWeight="medium" style={styles.toggleLabelText}>
                {t('journeys.health.cycle.settings.enableNotifications')}
              </Text>
              <Switch
                value={config.notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{
                  false: colors.gray[20],
                  true: colors.journeys.health.primary,
                }}
                thumbColor={colors.gray[0]}
                accessibilityLabel={t('journeys.health.cycle.settings.enableNotifications')}
                testID="notifications-toggle"
              />
            </View>
          </Card>
          <Touchable
            onPress={() => navigation.navigate(ROUTES.HEALTH_CYCLE_REMINDERS)}
            accessibilityLabel={t('journeys.health.cycle.settings.manageReminders')}
            accessibilityRole="button"
            testID="manage-reminders-link"
          >
            <Text fontSize="sm" color={colors.journeys.health.secondary} fontWeight="medium">
              {t('journeys.health.cycle.settings.manageReminders')}
            </Text>
          </Touchable>
        </View>

        {/* Data Privacy */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.settings.dataPrivacy')}
          </Text>
          <Button
            variant="secondary"
            journey="health"
            onPress={handleExportData}
            accessibilityLabel={t('journeys.health.cycle.settings.exportData')}
            testID="export-data-button"
          >
            {t('journeys.health.cycle.settings.exportData')}
          </Button>
          <Touchable
            onPress={handleDeleteData}
            accessibilityLabel={t('journeys.health.cycle.settings.deleteAllData')}
            accessibilityRole="button"
            testID="delete-data-button"
          >
            <Text fontSize="sm" color={colors.semantic.error} fontWeight="medium">
              {t('journeys.health.cycle.settings.deleteAllData')}
            </Text>
          </Touchable>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    flex: 1,
    gap: spacingValues['4xs'],
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues['3xs'],
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.gray[20],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[0],
  },
  stepButtonDisabled: {
    backgroundColor: colors.gray[5],
  },
  valueDisplay: {
    width: 48,
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    flex: 1,
    marginRight: spacingValues.sm,
    gap: spacingValues['4xs'],
  },
  toggleLabelText: {
    flex: 1,
    marginRight: spacingValues.sm,
  },
});

export default CycleSettings;
