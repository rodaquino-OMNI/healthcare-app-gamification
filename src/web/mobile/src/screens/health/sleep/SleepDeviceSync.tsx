import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
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
 * Data source for sleep tracking.
 */
type DataSource = 'apple_health' | 'fitbit' | 'manual';

/**
 * Connected device information.
 */
interface ConnectedDevice {
  name: string;
  battery: number;
  lastSync: string;
}

const DATA_SOURCE_OPTIONS: { id: DataSource; labelKey: string; descKey: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'apple_health', labelKey: 'journeys.health.sleep.device.sourceAppleHealth', descKey: 'journeys.health.sleep.device.sourceAppleHealthDesc', icon: 'heart-outline' },
  { id: 'fitbit', labelKey: 'journeys.health.sleep.device.sourceFitbit', descKey: 'journeys.health.sleep.device.sourceFitbitDesc', icon: 'watch-outline' },
  { id: 'manual', labelKey: 'journeys.health.sleep.device.sourceManual', descKey: 'journeys.health.sleep.device.sourceManualDesc', icon: 'create-outline' },
];

const MOCK_DEVICE: ConnectedDevice | null = {
  name: 'Fitbit Sense 2',
  battery: 72,
  lastSync: '2026-02-22 08:15',
};

/**
 * SleepDeviceSync manages connected sleep tracking device status,
 * sync actions, and data source selection.
 */
export const SleepDeviceSync: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedSource, setSelectedSource] = useState<DataSource>('fitbit');
  const [device, setDevice] = useState<ConnectedDevice | null>(MOCK_DEVICE);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSync = useCallback(() => {
    Alert.alert(
      t('journeys.health.sleep.device.syncTitle'),
      t('journeys.health.sleep.device.syncMessage'),
    );
  }, [t]);

  const handleConnectToggle = useCallback(() => {
    if (device) {
      setDevice(null);
      Alert.alert(
        t('journeys.health.sleep.device.disconnectedTitle'),
        t('journeys.health.sleep.device.disconnectedMessage'),
      );
    } else {
      setDevice(MOCK_DEVICE);
      Alert.alert(
        t('journeys.health.sleep.device.connectedTitle'),
        t('journeys.health.sleep.device.connectedMessage'),
      );
    }
  }, [device, t]);

  const getBatteryColor = useCallback((battery: number): string => {
    if (battery >= 50) return colors.semantic.success;
    if (battery >= 20) return colors.semantic.warning;
    return colors.semantic.error;
  }, []);

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
          {t('journeys.health.sleep.device.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="sleep-device-scroll"
      >
        {/* Connected Device */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.device.connectedDevice')}
          </Text>
          {device ? (
            <Card journey="health" elevation="md" padding="md">
              <View style={styles.deviceRow}>
                <View style={styles.deviceIconContainer}>
                  <Ionicons
                    name="bluetooth-outline"
                    size={24}
                    color={colors.journeys.health.primary}
                  />
                </View>
                <View style={styles.deviceInfo}>
                  <Text fontSize="md" fontWeight="semiBold">
                    {device.name}
                  </Text>
                  <View style={styles.deviceMeta}>
                    <Ionicons
                      name="battery-half-outline"
                      size={16}
                      color={getBatteryColor(device.battery)}
                    />
                    <Text fontSize="sm" color={getBatteryColor(device.battery)}>
                      {device.battery}%
                    </Text>
                  </View>
                  <Text fontSize="xs" color={colors.gray[40]}>
                    {t('journeys.health.sleep.device.lastSync')}: {device.lastSync}
                  </Text>
                </View>
              </View>
            </Card>
          ) : (
            <Card journey="health" elevation="sm" padding="md">
              <View style={styles.emptyState}>
                <Ionicons
                  name="bluetooth-outline"
                  size={40}
                  color={colors.gray[30]}
                />
                <Text fontSize="md" fontWeight="medium" color={colors.gray[40]}>
                  {t('journeys.health.sleep.device.noDevice')}
                </Text>
                <Text fontSize="sm" color={colors.gray[30]}>
                  {t('journeys.health.sleep.device.noDeviceDesc')}
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Sync Button */}
        <View style={styles.syncContainer}>
          <Button
            journey="health"
            onPress={handleSync}
            accessibilityLabel={t('journeys.health.sleep.device.syncNow')}
            testID="sleep-device-sync-button"
          >
            {t('journeys.health.sleep.device.syncNow')}
          </Button>
        </View>

        {/* Data Source Picker */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.device.dataSource')}
          </Text>
          <View style={styles.sourceContainer}>
            {DATA_SOURCE_OPTIONS.map((option) => (
              <Touchable
                key={option.id}
                onPress={() => setSelectedSource(option.id)}
                accessibilityLabel={t(option.labelKey)}
                accessibilityRole="button"
                testID={`sleep-device-source-${option.id}`}
              >
                <Card journey="health" elevation="sm" padding="md">
                  <View style={styles.radioRow}>
                    <View style={styles.radioOuter}>
                      {selectedSource === option.id && <View style={styles.radioInner} />}
                    </View>
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={
                        selectedSource === option.id
                          ? colors.journeys.health.primary
                          : colors.gray[40]
                      }
                      style={styles.sourceIcon}
                    />
                    <View style={styles.sourceInfo}>
                      <Text fontSize="md" fontWeight="semiBold">
                        {t(option.labelKey)}
                      </Text>
                      <Text fontSize="sm" color={colors.gray[50]}>
                        {t(option.descKey)}
                      </Text>
                    </View>
                  </View>
                </Card>
              </Touchable>
            ))}
          </View>
        </View>

        {/* Connect/Disconnect */}
        <View style={styles.actionsContainer}>
          <Button
            variant={device ? 'secondary' : 'primary'}
            journey="health"
            onPress={handleConnectToggle}
            accessibilityLabel={
              device
                ? t('journeys.health.sleep.device.disconnect')
                : t('journeys.health.sleep.device.connect')
            }
            testID="sleep-device-connect-button"
          >
            {device
              ? t('journeys.health.sleep.device.disconnect')
              : t('journeys.health.sleep.device.connect')}
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
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.journeys.health.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingValues.md,
  },
  deviceInfo: {
    flex: 1,
    gap: spacingValues['4xs'],
  },
  deviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues['3xs'],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacingValues.xl,
    gap: spacingValues.sm,
  },
  syncContainer: {
    marginTop: spacingValues.xl,
  },
  sourceContainer: {
    gap: spacingValues.sm,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.journeys.health.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingValues.sm,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.journeys.health.primary,
  },
  sourceIcon: {
    marginRight: spacingValues.sm,
  },
  sourceInfo: {
    flex: 1,
    gap: spacingValues['4xs'],
  },
  actionsContainer: {
    marginTop: spacingValues['2xl'],
    marginBottom: spacingValues.xl,
  },
});

export default SleepDeviceSync;
