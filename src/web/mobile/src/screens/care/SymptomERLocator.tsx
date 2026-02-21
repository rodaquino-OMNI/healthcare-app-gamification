import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Linking, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

interface EmergencyRoom {
  id: string;
  name: string;
  address: string;
  distance: string;
  distanceKm: number;
  waitTime: string;
  phone: string;
  latitude: number;
  longitude: number;
}

const MOCK_EMERGENCY_ROOMS: EmergencyRoom[] = [
  {
    id: 'er1',
    name: 'Hospital Sao Paulo - Emergency',
    address: 'Rua Napoleao de Barros, 715 - Vila Clementino',
    distance: '1.2 km',
    distanceKm: 1.2,
    waitTime: '~15 min',
    phone: '+551150821000',
    latitude: -23.5989,
    longitude: -46.6425,
  },
  {
    id: 'er2',
    name: 'Hospital Albert Einstein - ER',
    address: 'Av. Albert Einstein, 627 - Morumbi',
    distance: '3.5 km',
    distanceKm: 3.5,
    waitTime: '~25 min',
    phone: '+551121511233',
    latitude: -23.5995,
    longitude: -46.7135,
  },
  {
    id: 'er3',
    name: 'Hospital Sirio-Libanes - ER',
    address: 'Rua Dona Adma Jafet, 91 - Bela Vista',
    distance: '4.8 km',
    distanceKm: 4.8,
    waitTime: '~30 min',
    phone: '+551131550200',
    latitude: -23.5558,
    longitude: -46.6526,
  },
  {
    id: 'er4',
    name: 'UPA Vila Mariana',
    address: 'Rua Domingos de Morais, 2564 - Vila Mariana',
    distance: '2.1 km',
    distanceKm: 2.1,
    waitTime: '~45 min',
    phone: '+551150820300',
    latitude: -23.5892,
    longitude: -46.6368,
  },
  {
    id: 'er5',
    name: 'Hospital Santa Cruz',
    address: 'Rua Santa Cruz, 398 - Vila Mariana',
    distance: '2.8 km',
    distanceKm: 2.8,
    waitTime: '~20 min',
    phone: '+551150808000',
    latitude: -23.5960,
    longitude: -46.6340,
  },
];

const getWaitTimeBadgeStatus = (waitTime: string): 'success' | 'warning' | 'error' => {
  const minutes = parseInt(waitTime.replace(/\D/g, ''), 10);
  if (minutes <= 20) return 'success';
  if (minutes <= 35) return 'warning';
  return 'error';
};

/**
 * Emergency room locator screen with mock data.
 * Displays nearby ERs sorted by distance with call and directions actions.
 */
const SymptomERLocator: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const sortedRooms = [...MOCK_EMERGENCY_ROOMS].sort(
    (a, b) => a.distanceKm - b.distanceKm,
  );

  const handleCall = (er: EmergencyRoom) => {
    Linking.openURL(`tel:${er.phone}`).catch(() => {
      Alert.alert(
        t('journeys.care.symptomChecker.erLocator.callErrorTitle'),
        t('journeys.care.symptomChecker.erLocator.callErrorMessage'),
      );
    });
  };

  const handleDirections = (er: EmergencyRoom) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${er.latitude},${er.longitude}`,
      android: `geo:${er.latitude},${er.longitude}?q=${er.latitude},${er.longitude}`,
      default: `https://maps.google.com/?q=${er.latitude},${er.longitude}`,
    });
    if (url) {
      Linking.openURL(url).catch(() => {
        Linking.openURL(
          `https://maps.google.com/?q=${er.latitude},${er.longitude}`,
        );
      });
    }
  };

  const handleCallEmergency = () => {
    Linking.openURL('tel:192');
  };

  const renderERItem = ({ item, index }: { item: EmergencyRoom; index: number }) => (
    <Card journey="care" elevation="sm">
      <View style={styles.erHeader}>
        <Text
          fontSize="heading-md"
          fontWeight="semiBold"
          journey="care"
          testID={`er-name-${index}`}
        >
          {item.name}
        </Text>
        <Badge
          variant="status"
          status={getWaitTimeBadgeStatus(item.waitTime)}
          testID={`er-wait-badge-${index}`}
          accessibilityLabel={`${t('journeys.care.symptomChecker.erLocator.waitTime')}: ${item.waitTime}`}
        >
          {item.waitTime}
        </Badge>
      </View>

      <Text variant="body" journey="care" testID={`er-address-${index}`}>
        {item.address}
      </Text>

      <View style={styles.distanceRow}>
        <Text fontSize="text-sm" color={colors.neutral.gray600}>
          {t('journeys.care.symptomChecker.erLocator.distance')}:
        </Text>
        <Text
          fontSize="text-sm"
          fontWeight="semiBold"
          color={colors.journeys.care.primary}
        >
          {item.distance}
        </Text>
      </View>

      <View style={styles.erActions}>
        <Button
          variant="secondary"
          onPress={() => handleCall(item)}
          journey="care"
          accessibilityLabel={`${t('journeys.care.symptomChecker.erLocator.call')} ${item.name}`}
          testID={`er-call-${index}`}
        >
          {t('journeys.care.symptomChecker.erLocator.call')}
        </Button>
        <Button
          onPress={() => handleDirections(item)}
          journey="care"
          accessibilityLabel={`${t('journeys.care.symptomChecker.erLocator.directions')} ${item.name}`}
          testID={`er-directions-${index}`}
        >
          {t('journeys.care.symptomChecker.erLocator.directions')}
        </Button>
      </View>
    </Card>
  );

  return (
    <View style={styles.root}>
      {/* Emergency call banner */}
      <Touchable
        onPress={handleCallEmergency}
        accessibilityLabel={t('journeys.care.symptomChecker.erLocator.callEmergency')}
        accessibilityRole="button"
        testID="emergency-call-banner"
      >
        <View style={styles.emergencyBanner}>
          <Text
            fontSize="text-sm"
            fontWeight="bold"
            color={colors.neutral.white}
          >
            {t('journeys.care.symptomChecker.erLocator.emergencyBannerText')}
          </Text>
        </View>
      </Touchable>

      <Text
        variant="heading"
        journey="care"
        testID="er-locator-title"
        style={styles.title}
      >
        {t('journeys.care.symptomChecker.erLocator.title')}
      </Text>

      <Text
        variant="body"
        journey="care"
        style={styles.subtitle}
      >
        {t('journeys.care.symptomChecker.erLocator.subtitle')}
      </Text>

      <FlatList
        data={sortedRooms}
        renderItem={renderERItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        testID="er-list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  emergencyBanner: {
    backgroundColor: colors.semantic.error,
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: spacingValues.md,
    marginTop: spacingValues.md,
  },
  subtitle: {
    paddingHorizontal: spacingValues.md,
    marginBottom: spacingValues.sm,
  },
  listContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
    gap: spacingValues.sm,
  },
  erHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacingValues['3xs'],
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues['3xs'],
    marginTop: spacingValues['3xs'],
  },
  erActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingValues.sm,
    gap: spacingValues.sm,
  },
});

export { SymptomERLocator };
export default SymptomERLocator;
